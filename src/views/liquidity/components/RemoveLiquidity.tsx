import { Box, CircularProgress, Divider, Slider, Stack, Typography } from "@mui/material"
import { BigNumber, Contract } from "ethers"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ROUTER_ADDRESS } from "@/config/constants/exchange"
import { useCurrency } from "@/hooks/Tokens"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { ApprovalState, useApproveCallback } from "@/hooks/useApproveCallback"
import { usePairContract } from "@/hooks/useContract"
import useNativeCurrency from "@/hooks/useNativeCurrency"
import { Field } from "@/state/burn/actions"
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from "@/state/burn/hooks"
import { Percent } from "@/utils/percent"
import { SVC_TESTNET } from "@/utils/token"
import { useWeb3LibraryContext } from "@/utils/wagmi"
import { useAccount } from "wagmi"
import { splitSignature } from '@ethersproject/bytes'
import { useAllTransactions, useTransactionAdder } from "@/state/transactions/hooks"
import { calculateSlippageAmount, useRouterContract } from "@/utils/exchange"
import { calculateGasMargin } from "@/utils"
import { TransactionResponse } from "@ethersproject/providers"
import { useTranslation } from "@/context/Localization"
import { useDebouncedChangeHandler } from "@/hooks/useDebounce"
import { GAS_PRICE_GWEI } from "@/state/types"
import { useUserSlippageTolerance } from "@/state/user/hooks"
import useTransactionDeadline from "@/hooks/useTransactionDeadline"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { CurrencyLogo } from "@/components/styled_components/CurrencyLogo"
import { StyledButton } from "./Styled"
import { useTokenBalance } from "@/state/wallet/hooks"
import useToast from "@/hooks/useToast"

const marks: Array<{ value: number, label: string }> = [
    {
        value: 25,
        label: '25%'
    }, {
        value: 50,
        label: '50%'
    }, {
        value: 75,
        label: '75%'
    }, {
        value: 100,
        label: '100%'
    }
]
export default function RemoveLiquity() {


    const { t } = useTranslation()
    const { toastError } = useToast()
    const navigate = useNavigate()
    const native = useNativeCurrency()
    const { address: account } = useAccount()
    const { chainId } = useActiveChainId()
    const library = useWeb3LibraryContext()
    const allTransactions = useAllTransactions()

    const [searchParams,] = useSearchParams()
    const currencyIdA = searchParams.get('currencyA') ?? native.symbol
    const currencyIdB = searchParams.get('currencyB') ?? SVC_TESTNET.address

    const currencyA = useCurrency(currencyIdA)
    const currencyB = useCurrency(currencyIdB)

    const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

    // burn state
    const { independentField, typedValue } = useBurnState()
    const { pair, parsedAmounts, error, tokenToReceive } = useDerivedBurnInfo(
        currencyA ?? undefined,
        currencyB ?? undefined
    )
    const { onUserInput: _onUserInput } = useBurnActionHandlers()

    const userLpTokenBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)

    const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
        attemptingTxn: boolean
        liquidityErrorMessage: string | undefined
        txHash: string | undefined
    }>({
        attemptingTxn: false,
        liquidityErrorMessage: undefined,
        txHash: undefined,
    })


    // txn values
    const deadline = useTransactionDeadline()
    const [allowedSlippage] = useUserSlippageTolerance()

    const formattedAmounts = {
        [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
            ? '0'
            : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
                ? '<1'
                : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
        [Field.LIQUIDITY]:
            independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '0',
        [Field.CURRENCY_A]:
            independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
        [Field.CURRENCY_B]:
            independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    }

    // pair contract
    const pairContractRead: Contract | null = usePairContract(pair?.liquidityToken?.address, false)

    // allowance handling
    const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
    const [approval, approveCallback] = useApproveCallback(
        parsedAmounts[Field.LIQUIDITY],
        ROUTER_ADDRESS[chainId],
    )

    async function onAttemptToApprove() {
        if (!pairContractRead || !pair || !library || !deadline) throw new Error('missing dependencies')
        const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
        if (!liquidityAmount) {
            throw new Error('missing liquidity amount')
        }

        // try to gather a signature for permission
        const nonce = await pairContractRead.nonces(account)

        const EIP712Domain = [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
        ]
        const domain = {
            name: 'SVCD LPs',
            version: '1',
            chainId,
            verifyingContract: pair.liquidityToken.address,
        }
        const Permit = [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ]
        const message = {
            owner: account,
            spender: ROUTER_ADDRESS[chainId],
            value: liquidityAmount.quotient.toString(),
            nonce: nonce.toHexString(),
            deadline: deadline.toNumber(),
        }
        const data = JSON.stringify({
            types: {
                EIP712Domain,
                Permit,
            },
            domain,
            primaryType: 'Permit',
            message,
        })

        library
            .send('eth_signTypedData_v4', [account, data])
            .then(splitSignature)
            .then((signature) => {
                setSignatureData({
                    v: signature.v,
                    r: signature.r,
                    s: signature.s,
                    deadline: deadline.toNumber(),
                })
            })
            .catch((err) => {
                // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
                if (err?.code !== 4001) {
                    approveCallback()
                }
            })
    }

    // wrapped onUserInput to clear signatures
    const onUserInput = useCallback(
        (field: Field, value: string) => {
            setSignatureData(null)
            return _onUserInput(field, value)
        },
        [_onUserInput],
    )
    const onLiquidityInput = useCallback((value: string): void => onUserInput(Field.LIQUIDITY, value), [onUserInput])


    // tx sending
    const addTransaction = useTransactionAdder()
    const routerContract = useRouterContract()

    async function onRemove() {
        if (!chainId || !account || !deadline || !routerContract) throw new Error('missing dependencies')
        const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
        if (!currencyAmountA || !currencyAmountB) {
            throw new Error('missing currency amounts')
        }

        const amountsMin = {
            [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
            [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
        }

        if (!currencyA || !currencyB) {
            throw new Error('missing tokens')
        }
        const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
        if (!liquidityAmount) {
            throw new Error('missing liquidity amount')
        }

        const currencyBIsNative = currencyB?.isNative
        const oneCurrencyIsNative = currencyA?.isNative || currencyBIsNative

        if (!tokenA || !tokenB) {
            throw new Error('could not wrap')
        }

        let methodNames: string[]
        let args: Array<string | string[] | number | boolean>
        // we have approval, use normal remove liquidity
        if (approval === ApprovalState.APPROVED) {
            // removeLiquidityETH
            if (oneCurrencyIsNative) {
                methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
                args = [
                    currencyBIsNative ? tokenA.address : tokenB.address,
                    liquidityAmount.quotient.toString(),
                    amountsMin[currencyBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
                    amountsMin[currencyBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
                    account,
                    deadline.toHexString(),
                ]
            }
            // removeLiquidity
            else {
                methodNames = ['removeLiquidity']
                args = [
                    tokenA.address,
                    tokenB.address,
                    liquidityAmount.quotient.toString(),
                    amountsMin[Field.CURRENCY_A].toString(),
                    amountsMin[Field.CURRENCY_B].toString(),
                    account,
                    deadline.toHexString(),
                ]
            }
        }
        // we have a signature, use permit versions of remove liquidity
        else if (signatureData !== null) {
            // removeLiquidityETHWithPermit
            if (oneCurrencyIsNative) {
                methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
                args = [
                    currencyBIsNative ? tokenA.address : tokenB.address,
                    liquidityAmount.quotient.toString(),
                    amountsMin[currencyBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
                    amountsMin[currencyBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
                    account,
                    signatureData.deadline,
                    false,
                    signatureData.v,
                    signatureData.r,
                    signatureData.s,
                ]
            }
            // removeLiquidityETHWithPermit
            else {
                methodNames = ['removeLiquidityWithPermit']
                args = [
                    tokenA.address,
                    tokenB.address,
                    liquidityAmount.quotient.toString(),
                    amountsMin[Field.CURRENCY_A].toString(),
                    amountsMin[Field.CURRENCY_B].toString(),
                    account,
                    signatureData.deadline,
                    false,
                    signatureData.v,
                    signatureData.r,
                    signatureData.s,
                ]
            }
        } else {
            throw new Error('Attempting to confirm without approval or a signature')
        }

        let methodSafeGasEstimate: { methodName: string; safeGasEstimate: BigNumber }
        for (let i = 0; i < methodNames.length; i++) {
            let safeGasEstimate
            try {
                // eslint-disable-next-line no-await-in-loop
                safeGasEstimate = calculateGasMargin(await routerContract.estimateGas[methodNames[i]](...args))
            } catch (e) {
                console.error(`estimateGas failed`, methodNames[i], args, e)
            }

            if (BigNumber.isBigNumber(safeGasEstimate)) {
                methodSafeGasEstimate = { methodName: methodNames[i], safeGasEstimate }
                break
            }
        }

        // all estimations failed...
        if (!methodSafeGasEstimate) {
            console.log(t('Error'), t('This transaction would fail'))
        } else {
            const { methodName, safeGasEstimate } = methodSafeGasEstimate

            setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
            await routerContract[methodName](...args, {
                gasLimit: safeGasEstimate,
                gasPrice: GAS_PRICE_GWEI.fast,
            })
                .then((response: TransactionResponse) => {
                    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: response.hash })
                    const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
                    const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
                    addTransaction(response, {
                        summary: `Remove ${amountA} ${currencyA?.symbol} and ${amountB} ${currencyB?.symbol}`,
                        translatableSummary: {
                            text: 'Remove %amountA% %symbolA% and %amountB% %symbolB%',
                            data: { amountA, symbolA: currencyA?.symbol, amountB, symbolB: currencyB?.symbol },
                        },
                        type: 'remove-liquidity',
                    })
                })
                .catch((err) => {
                    toastError(t('User rejected transaction'))
                    if (err && err.code !== 4001) {
                        console.error(`Remove Liquidity failed`, err, args)
                    }
                    setLiquidityState({
                        attemptingTxn: false,
                        liquidityErrorMessage:
                            err && err?.code !== 4001
                                ? t('Remove liquidity failed')
                                : undefined,
                        txHash: undefined,
                    })
                })
        }
    }

    useEffect(() => {
        if (txHash) {
            const removeTx = allTransactions[chainId][txHash]
            if (removeTx.confirmedTime) {
                setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: undefined })
                onUserInput(Field.LIQUIDITY, '0')
            }
        }
    }, [txHash, allTransactions])

    const liquidityPercentChangeCallback = useCallback(
        (value: number) => {
            onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
        },
        [onUserInput],
    )

    const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
        Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
        liquidityPercentChangeCallback,
    )

    const handleChangePercent = useCallback(
        (value) => setInnerLiquidityPercentage(Math.ceil(value)),
        [setInnerLiquidityPercentage],
    )

    const enableBtnText = approval === ApprovalState.PENDING ? t('Approving') : approval === ApprovalState.APPROVED ? t('Approved') : t('Approve')
    const removeBtnDisable = !chainId || !account || !routerContract || parsedAmounts[Field.LIQUIDITY]?.toExact() === undefined || attemptingTxn || approval !== ApprovalState.APPROVED

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            '& > .MuiBox-root': {
                p: 3,
                display: 'flex'
            }
        }}>
            <Box alignItems='center' >
                <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/liquidity')}>
                    <KeyboardBackspaceIcon />
                </Box>
                <Box ml={3}>
                    <Typography sx={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#444 !important'
                    }}>{t('Remove %assetA%-%assetB% liquidity', { assetA: currencyA?.symbol, assetB: currencyB?.symbol })} 🎁</Typography>
                    <Typography mt={1}>{t('To receive %assetA% and %assetB%', { assetA: currencyA?.symbol, assetB: currencyB?.symbol })}</Typography>
                </Box>
            </Box>
            <Divider />
            <Box flexDirection='column'>
                <Typography mb={1} ml={3}>
                    {t('Wallet Balance')} : {userLpTokenBalance?.toSignificant(4) ?? 0} LP
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    border: '1px solid #eee',
                    borderRadius: '20px'
                }}>
                    <Typography ml={2} whiteSpace='nowrap' minWidth='50px'>{formattedAmounts[Field.LIQUIDITY]}</Typography>
                    <Slider
                        defaultValue={0}
                        value={innerLiquidityPercentage}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        marks={marks}
                        onChange={(e, val) => {
                            handleChangePercent(val)
                        }}
                        sx={{ color: '#e57a3b', mx: 3 }}
                    />
                </Box>
            </Box>
            <Box flexDirection='column' mt={-4}>
                <Typography mb={1} ml={3}>
                    {t('Receive')}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    gap: 1,
                    border: '1px solid #eee',
                    borderRadius: '20px',
                    '& > .MuiBox-root': {
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between'
                    }
                }}>
                    <Box>
                        <Box display='flex' alignItems='center' gap={1}>
                            <CurrencyLogo currency={currencyA} />
                            <Typography>{currencyA?.symbol}</Typography>
                        </Box>
                        <Typography>{formattedAmounts[Field.CURRENCY_A] || '0'} (50%)</Typography>
                    </Box>
                    <Box >
                        <Box display='flex' alignItems='center' gap={1}>
                            <CurrencyLogo currency={currencyB} />
                            <Typography>{currencyB?.symbol}</Typography>
                        </Box>
                        <Typography>{formattedAmounts[Field.CURRENCY_B] || '0'} (50%)</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                mt: -4,
                '& > .MuiBox-root': {
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    px: 3
                }
            }}>
                <Box>
                    <Typography>{t('LP rewards APR')}:</Typography>
                    <Typography>1.45%</Typography>
                </Box>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', gap: 2 }}>
                {
                    (approval !== ApprovalState.APPROVED && parsedAmounts[Field.LIQUIDITY] !== undefined) &&
                    <StyledButton
                        disabled={approval === ApprovalState.PENDING}
                        onClick={approveCallback}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                            {t(enableBtnText)}
                            {approval === ApprovalState.PENDING && <CircularProgress sx={{ color: 'white' }} />}
                        </Box>
                    </StyledButton>
                }
                <StyledButton
                    disabled={removeBtnDisable}
                    onClick={onRemove}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        {t('Remove')}
                        {attemptingTxn && <CircularProgress sx={{ color: 'white' }} />}
                    </Box>
                </StyledButton>
            </Box>
        </Box>
    )
}