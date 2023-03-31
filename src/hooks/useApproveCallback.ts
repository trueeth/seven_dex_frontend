import { TransactionResponse } from "@ethersproject/providers"
import { useCallback, useMemo } from "react"
import { MaxUint256, TradeType } from "src/config/constants"
import { useHasPendingApproval, useTransactionAdder } from "src/state/transactions/hooks"
import { Currency, CurrencyAmount } from "src/utils/token"
import { useAccount } from "wagmi"
import { useTokenContract } from "./useContract"
import useTokenAllowance from "./useTokenAllowance"
import { useCallWithGasPrice } from "./useCallWithGasPrice"
import { calculateGasMargin } from "src/utils"
import { computeSlippageAdjustedAmounts } from "src/utils/exchange"
import { Field } from "src/state/swap/actions"
import { Trade } from "src/utils/trade"
import { ROUTER_ADDRESS } from "src/config/constants/exchange"
import { ChainId } from "src/config/constants/chains"
import JSBI from "jsbi"


export enum ApprovalState {
    UNKNOWN,
    NOT_APPROVED,
    PENDING,
    APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
    amountToApprove?: CurrencyAmount<Currency>,
    spender?: string,
): [ApprovalState, () => Promise<void>] {
    const { address: account } = useAccount()
    const { callWithGasPrice } = useCallWithGasPrice()

    const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
    const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)


    const pendingApproval = useHasPendingApproval(token?.address, spender)

    // check the current approval status
    const approvalState: ApprovalState = useMemo(() => {
        if (!amountToApprove || !spender) return ApprovalState.UNKNOWN

        if (amountToApprove.currency?.isNative) return ApprovalState.APPROVED
        // we might not have enough data to know whether or not we need to approve
        if (!currentAllowance) return ApprovalState.UNKNOWN

        // amountToApprove will be defined if currentAllowance is
        // return currentAllowance.lessThan(amountToApprove)
        return JSBI.lessThan(currentAllowance.quotient, amountToApprove.quotient)
            ? pendingApproval
                ? ApprovalState.PENDING
                : ApprovalState.NOT_APPROVED
            : ApprovalState.APPROVED
    }, [amountToApprove, currentAllowance, pendingApproval, spender])

    const tokenContract = useTokenContract(token?.address)
    const addTransaction = useTransactionAdder()

    const approve = useCallback(async (): Promise<void> => {
        if (approvalState !== ApprovalState.NOT_APPROVED) {
            console.error('approve was called unnecessarily')
            return undefined
        }
        if (!token) {
            console.error('no token')
            return undefined
        }

        if (!tokenContract) {
            console.error('tokenContract is null')
            return undefined
        }

        if (!amountToApprove) {
            console.error('missing amount to approve')
            return undefined
        }

        if (!spender) {
            console.error('no spender')
            return undefined
        }

        let useExact = false

        const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
            // general fallback for tokens who restrict approval amounts
            useExact = true
            return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString()).catch(() => {
                console.error('estimate gas failure')
                return null
            })
        })

        if (!estimatedGas) return undefined

        return callWithGasPrice(
            tokenContract,
            'approve',
            [spender, useExact ? amountToApprove.quotient.toString() : MaxUint256],
            {
                gasLimit: calculateGasMargin(estimatedGas),
            },
        )
            .then((response: TransactionResponse) => {
                addTransaction(response, {
                    summary: `Approve ${amountToApprove.currency.symbol}`,
                    translatableSummary: { text: 'Approve %symbol%', data: { symbol: amountToApprove.currency.symbol } },
                    approval: { tokenAddress: token.address, spender },
                    type: 'approve',
                })
            })
            .catch((error: any) => {
                console.error('Failed to approve token', error)
                if (error?.code !== 4001) {
                    console.log('transaction error')
                }
                throw error
            })
    }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction, callWithGasPrice])

    return [approvalState, approve]
}


// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade<Currency, Currency, TradeType>, allowedSlippage = 0) {
    const amountToApprove = useMemo(
        () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
        [trade, allowedSlippage],
    )
    return useApproveCallback(amountToApprove, ROUTER_ADDRESS[ChainId.MUMBAI])
}

