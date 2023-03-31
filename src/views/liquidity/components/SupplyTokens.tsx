import { Box, Button, CircularProgress, Divider, TextField, Tooltip, Typography } from "@mui/material"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { Currency } from "src/utils/token"
import { StyledButton } from "./Styled"
import AddIcon from '@mui/icons-material/Add'
import { IconInfoCircle } from '@tabler/icons'
import { useAccount } from "wagmi"
import { useCurrencyBalance } from "src/state/wallet/hooks"
import { Field } from "src/state/mint/actions"
import { ONE_BIPS, ROUTER_ADDRESS } from "src/config/constants/exchange"
import { ApprovalState, useApproveCallback } from "src/hooks/useApproveCallback"
import { usePairAdder } from 'src/state/user/hooks'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'src/state/mint/hooks'
import { maxAmountSpend } from 'src/utils/maxAmountSpend'
import { useAllTransactions, useTransactionAdder } from 'src/state/transactions/hooks'
import { calculateSlippageAmount, useRouterContract } from 'src/utils/exchange'

import { CurrencyAmount, Token } from 'src/utils/token'
import { useEffect, useMemo, useState } from "react"
import { useActiveChainId } from "src/hooks/useActiveChainId"
import { calculateGasMargin, numberInputOnWheelPreventChange } from "src/utils"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { GAS_PRICE_GWEI } from "src/state/types"
import { DEFAULT_TRANSACTION_DEADLINE } from "src/config/constants"
import { useTranslation } from "src/context/Localization"

function SupplyTokens({
    currencyA,
    currencyB,
    onBack
}: {
    currencyA: Currency,
    currencyB: Currency,
    onBack: () => void
}) {


    const { address: account } = useAccount()
    const { chainId } = useActiveChainId()
    const currencyABalance = useCurrencyBalance(account ?? undefined, currencyA ?? undefined)
    const currencyBBalance = useCurrencyBalance(account ?? undefined, currencyB ?? undefined)
    const { t } = useTranslation()

    const addPair = usePairAdder()
    const allTransactions = useAllTransactions()

    const { independentField, typedValue, otherTypedValue } = useMintState()
    const {
        dependentField,
        currencies,
        pair,
        pairState,
        currencyBalances,
        parsedAmounts,
        price,
        noLiquidity,
        liquidityMinted,
        poolTokenPercentage,
        error,
        //  addError,
    } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

    const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)



    const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
        attemptingTxn: boolean
        liquidityErrorMessage: string | undefined
        txHash: string | undefined
    }>({
        attemptingTxn: false,
        liquidityErrorMessage: undefined,
        txHash: undefined,
    })

    const maxAmounts: { [field in Field]?: CurrencyAmount<Token> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
        (accumulator, field) => {
            return {
                ...accumulator,
                [field]: maxAmountSpend(currencyBalances[field]),
            }
        },
        {},
    )
    const formattedAmounts = useMemo(
        () => ({
            [independentField]: typedValue,
            [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
        }),
        [
            dependentField,
            independentField,
            noLiquidity,
            otherTypedValue,
            parsedAmounts,
            typedValue
        ],
    )


    // check whether the user has approved the router on the tokens
    const [approvalA, approveACallback] = useApproveCallback(
        parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[chainId],
    )

    const [approvalB, approveBCallback] = useApproveCallback(
        parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[chainId],
    )

    const showFieldAApproval =
        (approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING)
    const showFieldBApproval =
        (approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING)

    const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval)

    const addTransaction = useTransactionAdder()

    const routerContract = useRouterContract()

    async function onAdd() {
        if (!chainId || !account || !routerContract) return

        const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
        if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
            return
        }

        const amountsMin = {
            [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : 100)[0],
            [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : 100)[0],
        }

        let estimate
        let method: (...args: any) => Promise<TransactionResponse>
        let args: Array<string | string[] | number>
        let value: BigNumber | null
        if (currencyA?.isNative || currencyB?.isNative) {
            const tokenBIsNative = currencyB?.isNative
            estimate = routerContract.estimateGas.addLiquidityETH
            method = routerContract.addLiquidityETH
            args = [
                (tokenBIsNative ? currencyA : currencyB)?.wrapped?.address ?? '', // token
                (tokenBIsNative ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
                amountsMin[tokenBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
                amountsMin[tokenBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
                account,
                DEFAULT_TRANSACTION_DEADLINE,
            ]
            value = BigNumber.from((tokenBIsNative ? parsedAmountB : parsedAmountA).quotient.toString())
        } else {
            estimate = routerContract.estimateGas.addLiquidity
            method = routerContract.addLiquidity
            args = [
                currencyA?.wrapped?.address ?? '',
                currencyB?.wrapped?.address ?? '',
                parsedAmountA.quotient.toString(),
                parsedAmountB.quotient.toString(),
                amountsMin[Field.CURRENCY_A].toString(),
                amountsMin[Field.CURRENCY_B].toString(),
                account,
                DEFAULT_TRANSACTION_DEADLINE,
            ]
            value = null
        }

        setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
        await estimate(...args, value ? { value } : {})
            .then((estimatedGasLimit) =>
                method(...args, {
                    ...(value ? { value } : {}),
                    gasLimit: calculateGasMargin(estimatedGasLimit),
                    gasPrice: GAS_PRICE_GWEI.fast,
                }).then((response) => {
                    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: response.hash })

                    const symbolA = currencies[Field.CURRENCY_A]?.symbol
                    const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
                    const symbolB = currencies[Field.CURRENCY_B]?.symbol
                    const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
                    addTransaction(response, {
                        summary: `Add ${amountA} ${symbolA} and ${amountB} ${symbolB}`,
                        translatableSummary: {
                            text: 'Add %amountA% %symbolA% and %amountB% %symbolB%',
                            data: { amountA, symbolA, amountB, symbolB },
                        },
                        type: 'add-liquidity',
                    })


                    if (pair) {
                        addPair(pair)
                    }
                }),
            )
            .catch((err) => {
                if (err && err.code !== 4001) {
                    console.error(`Add Liquidity failed`, err, args, value)
                }
                setLiquidityState({
                    attemptingTxn: false,
                    liquidityErrorMessage:
                        err && err.code !== 4001
                            ? 'Add liquidity failed'
                            : undefined,
                    txHash: undefined,
                })
            })
    }

    useEffect(() => {
        if (txHash) {
            const swapTx = allTransactions[chainId][txHash]
            if (swapTx.confirmedTime)
                setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: undefined })
        }
    }, [txHash, allTransactions])

    const supplyText = Number(maxAmounts[Field.CURRENCY_A]?.toExact()) < Number(formattedAmounts[Field.CURRENCY_A]) ||
        Number(maxAmounts[Field.CURRENCY_B]?.toExact()) < Number(formattedAmounts[Field.CURRENCY_B]) ?
        'Insufficient Balance' :
        formattedAmounts[Field.CURRENCY_A] === '' || formattedAmounts[Field.CURRENCY_B] === '' ?
            'Input Amounts' :
            attemptingTxn ? 'Suppling Assets' : 'Supply'


    const supplyDisable = !chainId || !account || !routerContract ||
        (Number(maxAmounts[Field.CURRENCY_A]?.toExact()) < Number(formattedAmounts[Field.CURRENCY_A])) ||
        (Number(maxAmounts[Field.CURRENCY_B]?.toExact()) < Number(formattedAmounts[Field.CURRENCY_B])) ||
        formattedAmounts[Field.CURRENCY_A] === '' ||
        formattedAmounts[Field.CURRENCY_B] === '' ||
        attemptingTxn

    return (
        <Box sx={{ width: '100%' }}>
            <Box p={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box onClick={onBack} sx={{ cursor: 'pointer' }}>
                    <KeyboardBackspaceIcon />
                </Box>
                <Box ml={3}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography sx={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#444 !important'
                        }}>
                            Add Liquidity
                        </Typography>
                        <Tooltip
                            title='By adding liquidity you will earn 0.17% of all trades on this pair proportional to your share in the trading pair. 
                        Fees are added to the pair, accrue in real time and can be claimed by withdrawing your liquidity.'
                            disableInteractive
                        >
                            <Button sx={{ display: 'flex', ml: -1.5, mt: -1 }}>
                                <IconInfoCircle color='#666' />
                            </Button>
                        </Tooltip>
                    </Box>
                    <Typography mt={1}>
                        Receive LP tokens and earn 0.17% trading fees
                    </Typography>
                </Box>
            </Box>
            <Divider />
            {
                noLiquidity &&
                <Box sx={{ p: 3, pb: 0 }}>
                    <Typography>You are the first liquidity provider.</Typography>
                    <Typography>The ratio of tokens you add will set the price of this pair.</Typography>
                </Box>
            }
            <Box
                //  supply amount fields
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    '& img': { width: '24px', height: '24px' }
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                borderRadius: '20px',
                                bgcolor: 'rgb(255, 231, 172,0.3)',
                                width: 'fit-content'
                            }}>
                                <img src={currencyA?.logoURI} alt='tokenA' />
                                <Typography >{currencyA?.symbol}</Typography>
                            </Box>
                            <Typography sx={{ mr: 2, color: '#666 !important' }}>Balance: {currencyABalance?.toSignificant(6) ?? 0}</Typography>
                        </Box>
                        <TextField
                            variant="standard"
                            autoComplete='off'
                            onChange={(e) => {
                                onFieldAInput(e.target.value)
                            }}
                            value={formattedAmounts[Field.CURRENCY_A]}
                            InputProps={{
                                disableUnderline: true,
                                placeholder: '0.0',
                                type: 'number',
                                inputProps: { min: 0, inputMode: 'numeric', pattern: '[0-9]*' },

                            }}
                            sx={{
                                width: '100%',
                                p: 2,
                                borderRadius: '20px',
                                bgcolor: 'rgb(255, 231, 172,0.3)',
                                input: { fontSize: '18px', fontWeight: 'bold', color: '#444', textAlign: 'right' }
                            }}
                            onWheel={numberInputOnWheelPreventChange}
                        />
                    </Box>
                </Box>
                <AddIcon sx={{ mt: 2, mb: 0 }} />
                <Box sx={{ width: '100%' }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                borderRadius: '20px',
                                bgcolor: 'rgb(255, 231, 172,0.3)',
                                width: 'fit-content'
                            }}>
                                <img src={currencyB?.logoURI} alt='tokenA' />
                                <Typography >{currencyB?.symbol}</Typography>
                            </Box>
                            <Typography sx={{ mr: 2, color: '#666 !important' }}>Balance: {currencyBBalance?.toSignificant(6) ?? 0}</Typography>
                        </Box>
                        <TextField
                            variant="standard"
                            autoComplete='off'
                            onChange={(e) => {
                                onFieldBInput(e.target.value)
                            }}
                            value={formattedAmounts[Field.CURRENCY_B]}
                            InputProps={{
                                disableUnderline: true,
                                placeholder: '0.0',
                                type: 'number',
                                inputProps: { min: 0, inputMode: 'numeric', pattern: '[0-9]*' },

                            }}
                            sx={{
                                width: '100%',
                                p: 2,
                                borderRadius: '20px',
                                bgcolor: 'rgb(255, 231, 172,0.3)',
                                input: { fontSize: '18px', fontWeight: 'bold', color: '#444', textAlign: 'right' }
                            }}
                            onWheel={numberInputOnWheelPreventChange}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    p: 2,
                    mt: 2,
                    width: '100%',
                    border: '1px solid #eee',
                    borderRadius: '32px'
                }}>
                    <Typography ml={2}>Prices and Shares</Typography>
                    <Box sx={{
                        p: 2,
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-around',
                        gap: 1.5,
                        width: '100%',
                        border: '1px solid #eee',
                        borderRadius: '32px',
                        '& .MuiBox-root': {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5,
                            '& .MuiTypography-root': {
                                fontSize: '14px !important',
                                textAlign: 'center'
                            }
                        },
                    }}>
                        <Box>
                            <Typography>{price?.toSignificant(6) ?? '-'}</Typography>
                            <Typography>{currencyA?.symbol} per {currencyB?.symbol}</Typography>
                        </Box>
                        <Box>
                            <Typography>{price?.invert()?.toSignificant(6) ?? '-'}</Typography>
                            <Typography>{currencyB?.symbol} per {currencyA?.symbol}</Typography>
                        </Box>
                        <Box>
                            <Typography> {noLiquidity && price
                                ? '100'
                                : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
                                %
                            </Typography>
                            <Typography>Share in Trading Pair</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider />
            <Box p={3} display='flex' alignItems='center' flexDirection='column'>
                {
                    shouldShowApprovalGroup ?
                        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                            {showFieldAApproval && (
                                <StyledButton
                                    onClick={approveACallback}
                                    disabled={approvalA === ApprovalState.PENDING}
                                >
                                    {approvalA === ApprovalState.PENDING ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                            {t('Approving %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })} <CircularProgress sx={{ color: 'white' }} />
                                        </Box>
                                    ) : (
                                        `Approve  ${currencies[Field.CURRENCY_A]?.symbol}`
                                    )}
                                </StyledButton>
                            )}
                            {showFieldBApproval && (
                                <StyledButton
                                    onClick={approveBCallback}
                                    disabled={approvalB === ApprovalState.PENDING}
                                >
                                    {approvalB === ApprovalState.PENDING ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                            {t('Approving %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })} <CircularProgress sx={{ color: 'white' }} />
                                        </Box>
                                    ) : (
                                        `Approve  ${currencies[Field.CURRENCY_B]?.symbol}`
                                    )}
                                </StyledButton>
                            )}
                        </Box> :
                        <StyledButton
                            disabled={supplyDisable}
                            onClick={() => {
                                setLiquidityState({
                                    attemptingTxn: false,
                                    liquidityErrorMessage: undefined,
                                    txHash: undefined,
                                })
                                onAdd()
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                {supplyText}
                                {attemptingTxn && <CircularProgress sx={{ color: 'white' }} />}
                            </Box>
                        </StyledButton>
                }
            </Box>
        </Box >
    )
}

export default SupplyTokens