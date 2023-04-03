import { useAccount, useNetwork, useProvider } from "wagmi"

export function useWeb3React() {
    const { chain } = useNetwork()
    const { address, connector, isConnected, isConnecting } = useAccount()
    const provider = useProvider({ chainId: chain?.id })

    return {
        chainId: chain?.id,
        account: isConnected ? address : null,
        isConnected,
        isConnecting,
        chain,
        connector,
        provider
    }
}