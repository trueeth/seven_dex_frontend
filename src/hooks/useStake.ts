import { parseUnits } from "@ethersproject/units"
import { Contract } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { useAllTransactions } from "src/state/transactions/hooks"
import { useAccount } from "wagmi"
import { useStakingContract } from "./useContract"
import useHandleTransactionReceipt from "./useHandleTransactionReceipt"


function useStake() {

    const [amount, setAmount] = useState<number>(0)
    const [pending, setPendingRewards] = useState<number>(0)
    const [totalDeposit, setTVL] = useState<number>(0)

    const { address: account } = useAccount()

    const handleTransactionReceipt = useHandleTransactionReceipt()
    const allTransactions = useAllTransactions()
    const staking = useStakingContract() as Contract


    const fetchStakingInfo = useCallback(
        async () => {
            if (account) {
                const amtStake = await staking.balanceOf(account)
                const rewardsPending = await staking.getPendingFurFiRewards(account)
                const tvl = await staking.totalStaked()
                setAmount(amtStake / Math.pow(10, 18))
                setPendingRewards(rewardsPending / Math.pow(10, 18))
                setTVL(tvl / Math.pow(10, 18))
            }
        }, [staking, account]
    )

    const stake = useCallback(
        (amount: number) => {
            const amountBn = parseUnits(String(amount), 18)
            handleTransactionReceipt(
                staking.stake(amountBn),
                'Stake Furfi token'
            )
        },
        [handleTransactionReceipt, staking]
    )

    const unstake = useCallback(
        (amount: number) => {
            const amountBn = parseUnits(String(amount), 18)
            handleTransactionReceipt(
                staking.unstake(amountBn),
                'Unstake Furfi token'
            )
        },
        [handleTransactionReceipt, staking]
    )

    const claimRewards = useCallback(
        async () => {
            const lpAmt = await staking.lpBalanceOf(account)
            const furfiAmt = await staking.getPendingFurFiRewards(account)
            handleTransactionReceipt(
                staking.claimLpTokens(lpAmt, furfiAmt, account),
                'Claim LP & Furfi token'
            )
        },
        [handleTransactionReceipt, staking]
    )

    useEffect(() => {
        if (account)
            fetchStakingInfo().catch(err => console.log('Failed to fetch Staking Info'))
    }, [account, fetchStakingInfo, allTransactions])

    return { stakeAmount: amount, pendingRewards: pending, tvl: totalDeposit, stake, unstake, claimRewards }
}

export default useStake