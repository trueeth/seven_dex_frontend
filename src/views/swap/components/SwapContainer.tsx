import { useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { useDerivedSwapInfo, useSwapState } from 'src/state/swap/hooks'
import { Field } from 'src/state/swap/actions'
import { useCurrency } from 'src/hooks/Tokens'
import { Currency, CurrencyAmount } from 'src/utils/token'
import { useSwapActionHandlers } from 'src/state/swap/useSwapActionHandler'
import CurrencyInputPanel from './CurrencyInputPanel'
import CurrencyOutputPanel from './CurrencyOutputPanel'
import SwitchIOCurrency from './SwitchIOCurrency'
import replaceBrowserHistory from 'src/utils/replaceBrowserHistory'
import currencyId from 'src/utils/currencyId'
import { Box, Button, Skeleton } from '@mui/material'
import useWrapCallback, { WrapType } from 'src/hooks/useWrapCallback'
import { Trade } from 'src/utils/trade'
import JSBI from 'jsbi'
import { ApprovalState, useApproveCallbackFromTrade } from 'src/hooks/useApproveCallback'
import { maxAmountSpend } from 'src/utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'src/utils/exchange'
import { TradeType } from 'src/config/constants'
import { useUserSlippageTolerance } from 'src/state/user/hooks'
import SwapDetail from './AdvancedSwapDetail'
import useRefreshBlockNumber from 'src/hooks/useRefreshBlockNumber'
import TradePrice from './TradePrice'
import { useAccount } from 'wagmi'
import { useTranslation } from 'src/context/Localization'
import confirmPriceImpactWithoutFee from 'src/utils/confirmPriceImpactWithoutFee'
import { useSwapCallback } from 'src/hooks/useSwapCallback'
import CircularProgress from '@mui/material/CircularProgress'
import { useAllTransactions } from 'src/state/transactions/hooks'
import { useActiveChainId } from 'src/hooks/useActiveChainId'


const useStyles = makeStyles((theme) => ({
    cardView: {
        width: '500px',
        padding: '32px',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: '20px',
        borderRadius: '32px',
        background: '#fff',
        '& .MuiTypography-root': {
            color: '#333'

        },
        [theme.breakpoints.down('sm')]: {
            width: '95%',
            marginLeft: 'auto',
            marginRight: 'auto'
        }

    }
}))

function SwapContainer() {

    const classes = useStyles()
    const { address: account } = useAccount()
    const { t } = useTranslation()
    const allTransactions = useAllTransactions()
    const { chainId } = useActiveChainId()
    const {
        independentField,
        typedValue,
        recipient,
        [Field.INPUT]: { currencyId: inputCurrencyId },
        [Field.OUTPUT]: { currencyId: outputCurrencyId },
    } = useSwapState()

    const inputCurrency = useCurrency(inputCurrencyId)
    const outputCurrency = useCurrency(outputCurrencyId)

    const { onCurrencySelection, onUserInput, onSwitchTokens } = useSwapActionHandlers()
    // get custom setting values for user
    const [allowedSlippage] = useUserSlippageTolerance()

    const { isLoading } = useRefreshBlockNumber()

    const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo(
        independentField,
        typedValue,
        inputCurrency,
        outputCurrency,
        recipient,
    )

    const {
        wrapType,
        execute: onWrap,
        inputError: wrapInputError,
    } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
    const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

    const trade = showWrap ? undefined : v2Trade

    const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

    const parsedAmounts = showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
        }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        }

    const isValid = !swapInputError

    // modal and loading
    const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
        tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined
        attemptingTxn: boolean
        swapErrorMessage: string | undefined
        txHash: string | undefined
    }>({
        tradeToConfirm: undefined,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined,
    })

    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: showWrap
            ? parsedAmounts[independentField]?.toExact() ?? ''
            : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }

    const route = trade?.route

    const userHasSpecifiedInputOutput = Boolean(
        currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
    )

    const noRoute = !route

    // check whether the user has approved the router on the input token
    const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

    // check if user has gone through approval process, used to show two step buttons, reset on token change
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

    // mark when a user has submitted an approval, reset onTokenSelection for input field
    useEffect(() => {
        if (approval === ApprovalState.PENDING) {
            setApprovalSubmitted(true)
        } else {
            setApprovalSubmitted(false)
        }
    }, [approval, approvalSubmitted])

    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(Field.INPUT, value)
        },
        [onUserInput],
    )

    const handleTypeOutput = useCallback(
        (value: string) => {
            onUserInput(Field.OUTPUT, value)
        },
        [onUserInput],
    )


    const handleInputSelect = useCallback(
        (newCurrencyInput) => {
            setApprovalSubmitted(false) // reset 2 step UI for approvals
            onCurrencySelection(Field.INPUT, newCurrencyInput)

            const newCurrencyInputId = currencyId(newCurrencyInput)
            if (newCurrencyInputId === outputCurrencyId) {
                replaceBrowserHistory('outputCurrency', inputCurrencyId)
            }
            replaceBrowserHistory('inputCurrency', newCurrencyInputId)
        },
        [inputCurrencyId, outputCurrencyId, onCurrencySelection],
    )


    const handleOutputSelect = useCallback(
        (newCurrencyOutput) => {
            onCurrencySelection(Field.OUTPUT, newCurrencyOutput)

            const newCurrencyOutputId = currencyId(newCurrencyOutput)
            if (newCurrencyOutputId === inputCurrencyId) {
                replaceBrowserHistory('inputCurrency', outputCurrencyId)
            }
            replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
        },

        [inputCurrencyId, outputCurrencyId, onCurrencySelection],
    )

    const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

    const handleMaxInput = useCallback(() => {
        if (maxAmountInput) {
            onUserInput(Field.INPUT, maxAmountInput.toExact())
        }
    }, [maxAmountInput, onUserInput])

    const handleSwitchCurrency = () => {
        setApprovalSubmitted(false) // reset 2 step UI for approvals
        onSwitchTokens()
        replaceBrowserHistory('inputCurrency', outputCurrencyId)
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
    }


    // the callback to execute the swap


    const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

    const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

    const handleSwap = useCallback(() => {
        if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
            return
        }
        if (!swapCallback) {
            return
        }
        setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
        swapCallback()
            .then((hash) => {
                setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
            })
            .catch((error) => {
                setSwapState({
                    attemptingTxn: false,
                    tradeToConfirm,
                    swapErrorMessage: error.message,
                    txHash: undefined,
                })
            })
    }, [priceImpactWithoutFee, swapCallback, tradeToConfirm])

    useEffect(() => {
        if (txHash) {
            const swapTx = allTransactions[chainId][txHash]
            if (swapTx.confirmedTime)
                setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
        }
    }, [txHash, allTransactions])

    // warnings on slippage
    const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

    // show approve flow when: no error on inputs, not approved or pending, or approved in current session
    // never show if price impact is above threshold in non expert mode
    const showApproveFlow =
        !swapInputError &&
        (approval === ApprovalState.NOT_APPROVED ||
            approval === ApprovalState.PENDING) &&
        !(priceImpactSeverity > 3)

    // errors
    const [showInverted, setShowInverted] = useState<boolean>(false)


    return (
        <div className={classes.cardView}>
            <CurrencyInputPanel
                currency={currencies[Field.INPUT]}
                value={formattedAmounts[Field.INPUT]}
                onCurrencySelect={handleInputSelect}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
            />
            <SwitchIOCurrency onSwitch={handleSwitchCurrency} />
            <CurrencyOutputPanel
                currency={currencies[Field.OUTPUT]}
                value={formattedAmounts[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                onUserInput={handleTypeOutput}
            />
            {
                showWrap ? null :
                    Boolean(trade) && (
                        isLoading ?
                            <Skeleton width='30px' /> :
                            <TradePrice
                                price={trade?.executionPrice}
                                showInverted={showInverted}
                                setShowInverted={setShowInverted}
                                slippage={allowedSlippage}
                            />
                    )
            }

            <Box mt={4} sx={{
                '& .MuiButton-root': {
                    padding: '10px 0',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: '#fff',
                    backgroundColor: '#ffae5a',
                    '&:hover': {
                        backgroundColor: '#ffae5a'
                    },
                    '&:disabled': {
                        color: 'white',
                        cursor: 'not-allowed'
                    },
                }
            }}>
                {!account ? (
                    <Button sx={{ width: '100%' }}>Connect Wallet</Button>
                ) : showWrap ? (
                    <Button disabled={Boolean(wrapInputError)} onClick={onWrap} sx={{ width: '100%' }}>
                        {wrapInputError ??
                            (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                    </Button>
                ) : noRoute && userHasSpecifiedInputOutput ? (
                    <Button disabled sx={{ width: '100%' }}>
                        {t('Insufficient liquidity for this trade.')}
                    </Button>
                ) : showApproveFlow ? (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            onClick={approveCallback}
                            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                            sx={{ width: '48%' }}
                        >
                            {approval === ApprovalState.PENDING ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                    {t('Approving')} <CircularProgress sx={{ color: 'white' }} />
                                </Box>
                            ) : (
                                t('Approve %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                            )}
                        </Button>
                        <Button
                            sx={{ width: '48%' }}
                            onClick={() => {
                                setSwapState({
                                    tradeToConfirm: trade,
                                    attemptingTxn: false,
                                    swapErrorMessage: undefined,
                                    txHash: undefined,
                                })
                                handleSwap()
                            }}
                            id="swap-button"
                            disabled={
                                !isValid || (priceImpactSeverity > 3) || !!swapCallbackError || attemptingTxn
                            }
                        >
                            {priceImpactSeverity > 3
                                ? t('Price Impact High')
                                : priceImpactSeverity > 2
                                    ? t('Swap Anyway')
                                    : t('Swap')}
                            {attemptingTxn && <CircularProgress sx={{ color: 'white' }} />}
                        </Button>
                    </Box>
                ) : (
                    <Button
                        sx={{ width: '100%' }}
                        onClick={() => {
                            setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                txHash: undefined,
                            })
                            handleSwap()
                        }}
                        id="swap-button"
                        disabled={!isValid || (priceImpactSeverity > 3) || !!swapCallbackError || attemptingTxn}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                            {swapInputError ||
                                (priceImpactSeverity > 3
                                    ? `Price Impact Too High`
                                    : priceImpactSeverity > 2
                                        ? t('Swap Anyway')
                                        : t('Swap'))}
                            {attemptingTxn && <CircularProgress sx={{ color: 'white' }} />}
                        </Box>
                    </Button>
                )}
            </Box>
            {
                trade && allowedSlippage &&
                <SwapDetail trade={trade} allowedSlippage={allowedSlippage} />
            }
        </div >
    )
}

export default SwapContainer