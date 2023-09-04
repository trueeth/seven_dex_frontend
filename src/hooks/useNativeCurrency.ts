import { ChainId } from '@/config/constants/chains'
import { Native, NativeCurrency } from '@/utils/token'
import { useMemo } from 'react'
import { useActiveChainId } from './useActiveChainId'

export default function useNativeCurrency(): NativeCurrency {
    const { chainId } = useActiveChainId()
    return useMemo(() => {
        try {
            return Native.onChain(chainId)
        } catch (e) {
            return Native.onChain(ChainId.POLYGON)
        }
    }, [chainId])
}
