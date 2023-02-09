import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { provider } from './wagmi'
import { Contract } from '@ethersproject/contracts'

import { getMulticallAddress } from './addressHelper'

import erc20Abi from 'src/config/abi/erc20.json'
import multicallAbi from 'src/config/abi/multicall.json'
import { ChainId } from 'src/config/constants/chains'

import type { Erc20, Multicall } from 'src/config/abi/types'


export const getContract = ({
    abi,
    address,
    chainId = ChainId.MUMBAI,
    signer,
}: {
    abi: any
    address: string
    chainId?: ChainId
    signer?: Signer | Provider
}) => {
    const signerOrProvider = signer ?? provider({ chainId })
    return new Contract(address, abi, signerOrProvider)
}

export const getErc20Contract = (address: string, signer?: Signer | Provider) => {
    return getContract({ abi: erc20Abi, address, signer }) as Erc20
}

export const getMulticallContract = (chainId: ChainId) => {
    return getContract({ abi: multicallAbi, address: getMulticallAddress(chainId), chainId }) as Multicall
}