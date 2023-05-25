import useActiveWeb3React from './useActiveWeb3React'
import { useMemo } from 'react'

import { Erc20, Erc20Bytes32, Multicall, Weth } from '@/config/abi/types'

import { useProviderOrSigner } from './useProviderOrSigner'
import { getMulticallAddress } from '@/utils/addressHelper'
import { getErc20Contract } from '@/utils/contractHelper'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { WNATIVE } from '@/utils/token'
import { ERC20_BYTES32_ABI } from '@/config/abi/erc20'
import ERC20_ABI from '@/config/abi/erc20.json'
import IPairABI from '@/config/abi/IPair.json'
import multiCallAbi from '@/config/abi/multicall.json'
import WETH_ABI from '@/config/abi/weth.json'
import { getContract } from '@/utils'
import BridgeABI from '@/config/abi/bridge.json'

import { IPair } from '@/config/abi/types'
import { useActiveChainId } from './useActiveChainId'
import { BridgeAddress } from '@/config/constants/bridge'

export const useERC20 = (address: string, withSignerIfPossible = true) => {
    const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
    return useMemo(() => getErc20Contract(address, providerOrSigner), [address, providerOrSigner])
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract<T extends Contract = Contract>(
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true
): T | null {
    const { provider } = useActiveWeb3React()

    const providerOrSigner = useProviderOrSigner(withSignerIfPossible) ?? provider

    const canReturnContract = useMemo(() => address && ABI && providerOrSigner, [address, ABI, providerOrSigner])

    return useMemo(() => {
        if (!canReturnContract) return null
        try {
            return getContract(address, ABI, providerOrSigner)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, providerOrSigner, canReturnContract]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
    return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWNativeContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveChainId()
    return useContract<Weth>(chainId ? WNATIVE[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract<Erc20Bytes32>(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): IPair | null {
    return useContract(pairAddress, IPairABI, withSignerIfPossible)
}

export function useMulticallContract() {
    const { chainId } = useActiveChainId()
    return useContract<Multicall>(getMulticallAddress(chainId), multiCallAbi, false)
}

export function useBridgeContract() {
    const { chainId } = useActiveChainId()
    return useContract(BridgeAddress[chainId], BridgeABI, true)
}
