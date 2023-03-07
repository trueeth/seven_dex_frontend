import { useWeb3React } from './useWeb3React'
import { useProvider } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'



/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
    const web3React = useWeb3React()
    const { chainId, isWrongNetwork } = useActiveChainId()
    const provider = useProvider({ chainId })

    return {
        provider,
        ...web3React,
        chainId,
        isWrongNetwork,
    }
}

export default useActiveWeb3React
