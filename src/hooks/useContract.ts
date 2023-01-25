
import { useMemo } from 'react'
import { getContract } from 'src/helper'
import { erc20ABI, useSigner } from 'wagmi'
import { useWeb3 } from './useWeb3'
import StandardStrategyABI from '../config/abi/strategyStandard.json'
import FurfiStrategyABI from '../config/abi/strategyFurfi.json'
import StableStrategyABI from '../config/abi/strategyStable.json'
import FreezeABI from '../config/abi/freezer.json'
import ReferralABI from '../config/abi/referrer.json'
import StakingABI from '../config/abi/staking.json'

import addresses from 'src/config/address'
import { DEFAULT_CHAIN_ID } from 'src/config/chains'

export enum Strategy {
    Standard = 'standardStrategy',
    Stable = 'stableStrategy',
    Furfi = 'furfiStrategy'
}

export function useContract(
    address: string,
    ABI: any,
    withSignerIfPossible = true
) {
    const { provider } = useWeb3()
    const { data: signer } = useSigner()
    const providerOrSigner = withSignerIfPossible ? signer ?? provider : provider

    const canReturnContract = useMemo(() => address && ABI && providerOrSigner, [address, ABI, providerOrSigner])

    return useMemo(() => {
        if (!canReturnContract) return null
        try {
            return getContract(address, ABI, providerOrSigner)
        } catch (err) {
            console.error('Failed to get contract', err)
            return null
        }
    }, [address, ABI, providerOrSigner])
}

export function useTokenContract(tokenAddress: string, withSignerIfPossible?: boolean) {
    return useContract(tokenAddress, erc20ABI, withSignerIfPossible)
}


export function useStrategyContract(pair: string, strategy: Strategy) {
    let addr, abi
    if (strategy === Strategy.Stable) {
        addr = addresses['stableStrategy'][pair][DEFAULT_CHAIN_ID]
        abi = StableStrategyABI
    } else if (strategy === Strategy.Standard) {
        addr = addresses['standardStrategy'][pair][DEFAULT_CHAIN_ID]
        abi = StandardStrategyABI
    } else if (strategy === Strategy.Furfi) {
        addr = addresses['furfiStrategy'][pair][DEFAULT_CHAIN_ID]
        abi = FurfiStrategyABI
    }
    return useContract(addr, abi)
}

export function useFreezeContract() {
    const freezeAddr = addresses.freeze[DEFAULT_CHAIN_ID]
    const abi = FreezeABI
    return useContract(freezeAddr, abi)
}

export function useReferralContract() {
    const referralAddr = addresses.referral[DEFAULT_CHAIN_ID]
    const abi = ReferralABI
    return useContract(referralAddr, abi)
}

export function useStakingContract() {
    const stakingAddr = addresses.stakingPool[DEFAULT_CHAIN_ID]
    const abi = StakingABI
    return useContract(stakingAddr, abi)
}

