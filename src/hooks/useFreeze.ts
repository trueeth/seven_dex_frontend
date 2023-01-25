import { parseUnits } from "@ethersproject/units";
import { Contract } from "ethers";
import { useCallback, useEffect, useState } from "react"
import { useAllTransactions } from "src/state/transactions/hooks";
import { useAccount } from "wagmi";
import { useFreezeContract } from "./useContract"
import useHandleTransactionReceipt from "./useHandleTransactionReceipt";

export interface IFreezeInfo {
    amount: number
    periodIndex: number
    freezingStartTime: number
    furFiRewardMask: number
    bnbRewardMask: number
    claimedBnbRewards: number
    claimedFurFiRewards: number
    pendingFurFiRewards: number
    pendingBnbRewards: number
}

function useFreeze() {

    const [freezing, setFreezing] = useState<Array<IFreezeInfo> | null>(null)
    const freezer = useFreezeContract() as Contract;
    const { address: account } = useAccount()
    const handleTransactionReceipt = useHandleTransactionReceipt()
    const allTransactions = useAllTransactions()

    const freeze = useCallback(
        (amount: string, period: number) => {
            const amountBn = parseUnits(amount, 18)
            handleTransactionReceipt(
                freezer.freeze(
                    amountBn,
                    period
                ),
                'Freeze furfi'
            )
        }, [handleTransactionReceipt, freezer])

    const claimRewards = useCallback(
        (round: number) => {
            handleTransactionReceipt(
                freezer.claimPendingRewards(round),
                'Claim Rewards from Freezing'
            )
        }, [handleTransactionReceipt, freezer])

    const fetchFreezing = useCallback(async () => {
        const freezing = await freezer.getAllParticipant(account)
        setFreezing(freezing)
    }, [freezer, account])

    useEffect(() => {
        if (account) {
            fetchFreezing().catch(err => console.log('Failed to fetch user freezing info'))
        }
    }, [allTransactions, fetchFreezing, account])

    return { freezing, freeze, claimRewards }
}

export default useFreeze

