import { Box, Button, Divider, TextField, Tooltip, Typography } from "@mui/material"
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
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useRouterContract } from 'src/utils/exchange'

import { CurrencyAmount, Token } from 'src/utils/token'
import { useMemo, useState } from "react"
import { useActiveChainId } from "src/hooks/useActiveChainId"
import { ST } from "next/dist/shared/lib/utils"

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

    const addPair = usePairAdder()

    const { independentField, typedValue, otherTypedValue } = useMintState()
    const {
        dependentField,
        currencies,
        pair,
        pairState,
        currencyBalances,
        parsedAmounts: mintParsedAmounts,
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
            [dependentField]: noLiquidity ? otherTypedValue : mintParsedAmounts[dependentField]?.toSignificant(6) ?? '',
        }),
        [
            dependentField,
            independentField,
            noLiquidity,
            otherTypedValue,
            mintParsedAmounts,
            typedValue
        ],
    )


    // check whether the user has approved the router on the tokens
    const [approvalA, approveACallback] = useApproveCallback(
        mintParsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[chainId],
    )
    const [approvalB, approveBCallback] = useApproveCallback(
        mintParsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[chainId],
    )
    const showFieldAApproval =
        (approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING)
    const showFieldBApproval =
        (approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING)

    const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval)

    const addTransaction = useTransactionAdder()

    const routerContract = useRouterContract()

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
                            onChange={(e) => onFieldAInput(e.target.value)}
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
                            onChange={(e) => onFieldBInput(e.target.value)}
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
            <Box p={3}>
                {
                    shouldShowApprovalGroup ?
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {showFieldAApproval && (
                                <StyledButton
                                    onClick={approveACallback}
                                    disabled={approvalA === ApprovalState.PENDING}
                                >
                                    {approvalA === ApprovalState.PENDING ? (
                                        `Enabling  ${currencies[Field.CURRENCY_A]?.symbol}`
                                    ) : (
                                        `Enable  ${currencies[Field.CURRENCY_A]?.symbol}`
                                    )}
                                </StyledButton>
                            )}
                            {showFieldBApproval && (
                                <StyledButton
                                    onClick={approveBCallback}
                                    disabled={approvalB === ApprovalState.PENDING}
                                >
                                    {approvalB === ApprovalState.PENDING ? (
                                        `Enabling  ${currencies[Field.CURRENCY_B]?.symbol}`
                                    ) : (
                                        `Enable  ${currencies[Field.CURRENCY_B]?.symbol}`
                                    )}
                                </StyledButton>
                            )}
                        </Box> :
                        <StyledButton onClick={() => { }}>Supply</StyledButton>
                }
            </Box>
        </Box >
    )
}

export default SupplyTokens