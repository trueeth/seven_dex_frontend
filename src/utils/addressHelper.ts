import { ChainId } from 'src/config/constants/chains'
import addresses from 'src/config/constants/contracts'

export const getAddress = (address: any, chainId?: number): string => {
    return address[chainId] ? address[chainId] : address[ChainId.POLYGON]
}


export const getMulticallAddress = (chainId?: number) => {
    return getAddress(addresses.multiCall, chainId)
}