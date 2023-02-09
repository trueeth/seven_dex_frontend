import useActiveWeb3React from "./useActiveWeb3React"
import { useMemo } from 'react'

import {
    Erc20,
    Erc20Bytes32,
    Multicall,
    Weth,
} from 'src/config/abi/types'

import { useProviderOrSigner } from './useProviderOrSigner'
import { getMulticallAddress } from 'src/utils/addressHelper'
import {
    getErc20Contract,
} from 'src/utils/contractHelper'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { WNATIVE } from "src/utils/token"
import { ERC20_BYTES32_ABI } from 'src/config/abi/erc20'
import ERC20_ABI from 'src/config/abi/erc20.json'
import IPairABI from 'src/config/abi/IPair.json'
import multiCallAbi from 'src/config/abi/multicall.json'
import WETH_ABI from 'src/config/abi/weth.json'
import { getContract } from 'src/utils'

import { IPair } from 'src/config/abi/types'
import { useActiveChainId } from './useActiveChainId'


export const useERC20 = (address: string, withSignerIfPossible = true) => {
    const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
    return useMemo(() => getErc20Contract(address, providerOrSigner), [address, providerOrSigner])
}


// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract<T extends Contract = Contract>(
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true,
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


