import { Contract } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { useAllTransactions } from "src/state/transactions/hooks"
import { useAccount } from "wagmi"
import { useReferralContract } from "./useContract"
import addresses from "src/config/address"
import { Strategies } from "src/config"
import useHandleTransactionReceipt from "./useHandleTransactionReceipt"
import { DEFAULT_CHAIN_ID } from "src/config/chains"
function useReferral() {

    const [friends, setFriends] = useState<number>(0)
    const [totalEarning, setEarning] = useState<number>(0)
    const [pendingRewards, setPendingRewards] = useState<number>(0)
    const { address: account } = useAccount()
    const allTransactions = useAllTransactions()
    const handleTransactionReceipt = useHandleTransactionReceipt()

    const poolAddrs: string[] = []

    useEffect(() => {
        Strategies.map(strategy => {
            const pairs = Object.keys(addresses[strategy])
            pairs.forEach((pair) => {
                poolAddrs.push(addresses[strategy][pair][DEFAULT_CHAIN_ID])
            })
        })
    }, [addresses])

    const referral = useReferralContract() as Contract

    const fetchReferral = useCallback(
        async () => {
            if (poolAddrs) {
                const activeFriends = await referral.activeFriends(account)
                const totalEarning = await referral.getAllTotalEarnedAmount(poolAddrs, account)
                const pendingRewards = await referral.getAllReferralRewards(poolAddrs, account)
                setFriends(activeFriends.toString())
                setEarning(totalEarning / Math.pow(10, 18))
                setPendingRewards(pendingRewards / Math.pow(10, 18))
            }
        },
        [referral, account, poolAddrs]
    )

    const claim = useCallback(
        () => {
            handleTransactionReceipt(
                referral.withdrawAllReferralRewards(poolAddrs),
                'Withdraw referral rewards'
            )
        }, [handleTransactionReceipt, referral])

    useEffect(() => {
        if (account) {
            fetchReferral().catch(err => console.log('Failed to fetch referral info', err))
        }
    }, [referral, fetchReferral, allTransactions])

    return { friends, totalEarning, pendingRewards, claim }
}

export default useReferral

