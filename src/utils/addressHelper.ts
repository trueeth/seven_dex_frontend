import { ChainId } from '@/config/constants/chains'
import addresses from '@/config/constants/contracts'

export const getAddress = (address: any, chainId?: number): string => {
    return address[chainId] ? address[chainId] : address[ChainId.MUMBAI]
}


export const getMulticallAddress = (chainId?: number) => {
    return getAddress(addresses.multiCall, chainId)
}