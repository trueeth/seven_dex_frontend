import { useCallback } from 'react'
import { ConnectorNames } from 'src/config'
import { DEFAULT_CHAIN_ID } from 'src/config/chains'
import {
    ConnectorNotFoundError,
    SwitchChainError,
    SwitchChainNotSupportedError,
    useConnect,
    useDisconnect,
    useNetwork,
} from 'wagmi'


const useAuth = () => {

    const { connectAsync, connectors, isLoading } = useConnect()
    const { chain } = useNetwork()
    const { disconnectAsync } = useDisconnect()
    const chainId = DEFAULT_CHAIN_ID;

    const login = useCallback(
        async (connectorId: ConnectorNames) => {
            const findConnector = connectors.find((item) => item.id === connectorId)
            try {
                const connected = await connectAsync({ connector: findConnector, chainId })
                return connected
            } catch (error) {
                if (error instanceof ConnectorNotFoundError) {
                    console.log('wallet connector not found')
                }
                if (error instanceof SwitchChainError || error instanceof SwitchChainNotSupportedError) {
                    console.log('Unable to switch network, please try it on your wallet')
                }
            }
            return undefined
        },
        [connectors, connectAsync, chainId]
    )

    const logout = useCallback(
        async () => {
            try {
                await disconnectAsync()
            } catch (error) {
                console.log(error)
            }
        }, [disconnectAsync, chain?.id]
    )
    return { login, logout, loading: isLoading }
}

export default useAuth