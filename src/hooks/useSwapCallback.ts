import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Router, SwapParameters } from '@/utils/router'
import JSBI from 'jsbi'
import { Percent } from '@/utils/percent'
import { Trade } from '@/utils/trade'
import { TradeType } from '../config/constants'
import { useMemo } from 'react'
import useActiveWeb3React from './useActiveWeb3React'
import { INITIAL_ALLOWED_SLIPPAGE } from '../config/constants'
import { BIPS_BASE } from '@/config/constants/exchange'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, isAddress, shortenAddress } from '../utils'

import isZero from '../utils/isZero'
import useTransactionDeadline from './useTransactionDeadline'
import { Currency } from '@/utils/token'
import { useRouterContract } from '@/utils/exchange'
import { useWeb3LibraryContext } from '@/utils/wagmi'
import useToast from './useToast'
import { useTranslation } from '@/context/Localization'


export enum SwapCallbackState {
    INVALID,
    LOADING,
    VALID,
}

interface SwapCall {
    contract: Contract
    parameters: SwapParameters
}

interface SuccessfulCall {
    call: SwapCall
    gasEstimate: BigNumber
}

interface FailedCall {
    call: SwapCall
    error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddress
 */
export function useSwapCallArguments(
    trade: Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
    allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
    recipientAddress: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
    const { account, chainId } = useActiveWeb3React()
    const library = useWeb3LibraryContext()


    const recipient = recipientAddress === null ? account : recipientAddress
    const deadline = useTransactionDeadline()
    const contract: Contract | null = useRouterContract()

    return useMemo(() => {
        if (!trade || !recipient || !library || !account || !chainId || !deadline) return []


        if (!contract) {
            return []
        }

        const swapMethods = []

        swapMethods.push(
            Router.swapCallParameters(trade, {
                feeOnTransfer: false,
                allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
                recipient,
                deadline: deadline.toNumber(),
            }),
        )

        if (trade.tradeType === TradeType.EXACT_INPUT) {
            swapMethods.push(
                Router.swapCallParameters(trade, {
                    feeOnTransfer: true,
                    allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
                    recipient,
                    deadline: deadline.toNumber(),
                }),
            )
        }

        return swapMethods.map((parameters) => ({ parameters, contract }))
    }, [account, allowedSlippage, chainId, deadline, library, recipient, trade])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
    trade: Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
    allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
    recipientAddress: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
    const { account, chainId } = useActiveWeb3React()
    const library = useWeb3LibraryContext()

    const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddress)

    const addTransaction = useTransactionAdder()
    const { toastError } = useToast()
    const { t } = useTranslation()

    const recipient = recipientAddress === null ? account : recipientAddress


    return useMemo(() => {
        if (!trade || !library || !account || !chainId) {
            return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
        }
        if (!recipient) {
            if (recipientAddress !== null) {
                return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
            }
            return { state: SwapCallbackState.LOADING, callback: null, error: null }
        }

        return {
            state: SwapCallbackState.VALID,
            callback: async function onSwap(): Promise<string> {
                const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
                    swapCalls.map((call) => {
                        const {
                            parameters: { methodName, args, value },
                            contract,
                        } = call
                        const options = !value || isZero(value) ? {} : { value }
                        return contract.estimateGas[methodName](...args, options)
                            .then((gasEstimate) => {
                                return {
                                    call,
                                    gasEstimate,
                                }
                            })
                            .catch((gasError) => {
                                console.error('Gas estimate failed, trying eth_call to extract error', call)

                                return contract.callStatic[methodName](...args, options)
                                    .then((result) => {
                                        console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                                        return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                                    })
                                    .catch((callError) => {
                                        console.error('Call threw error', call, callError)
                                        const reason: string = callError.reason || callError.data?.message || callError.message
                                        const errorMessage = `The transaction cannot succeed due to error: ${reason ?? 'Unknown error, check the logs'
                                            }.`

                                        return { call, error: new Error(errorMessage) }
                                    })
                            })
                    }),
                )

                // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
                const successfulEstimation = estimatedCalls.find(
                    (el, ix, list): el is SuccessfulCall =>
                        'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
                )

                if (!successfulEstimation) {
                    const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
                    if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
                    throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
                }

                const {
                    call: {
                        contract,
                        parameters: { methodName, args, value },
                    },
                    gasEstimate,
                } = successfulEstimation

                return contract[methodName](...args, {
                    gasLimit: calculateGasMargin(gasEstimate),
                    ...(value && !isZero(value) ? { value, from: account } : { from: account }),
                })
                    .then((response: any) => {
                        const inputSymbol = trade.inputAmount.currency.symbol
                        const outputSymbol = trade.outputAmount.currency.symbol
                        const inputAmount = trade.inputAmount.toSignificant(3)
                        const outputAmount = trade.outputAmount.toSignificant(3)

                        const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
                        const withRecipient =
                            recipient === account
                                ? base
                                : `${base} to ${recipientAddress && isAddress(recipientAddress)
                                    ? shortenAddress(recipientAddress)
                                    : recipientAddress
                                }`

                        addTransaction(response, {
                            summary: withRecipient,
                        })

                        return response.hash
                    })
                    .catch((error: any) => {
                        // if the user rejected the tx, pass this along
                        toastError(t('User rejected transaction.'))
                        if (error?.code === 4001) {
                            throw new Error('Transaction rejected.')
                        } else {
                            // otherwise, the error was unexpected and we need to convey that
                            console.error(`Swap failed`, error, methodName, args, value)
                            throw new Error(`Swap failed: ${error.message}`)
                        }
                    })
            },
            error: null,
        }
    }, [trade, library, account, chainId, recipient, recipientAddress, swapCalls, addTransaction])
}
