import { useCallback } from 'react'
import { ConnectorNames } from 'src/config'
import { DEFAULT_CHAIN_ID } from 'src/config/constants/chains'
import { useTranslation } from 'src/context/Localization'
import {
    ConnectorNotFoundError,
    SwitchChainError,
    SwitchChainNotSupportedError,
    useConnect,
    useDisconnect,
    useNetwork,
} from 'wagmi'
import useToast from './useToast'

const useAuth = () => {

    const { connectAsync, connectors, isLoading } = useConnect()
    const { chain } = useNetwork()
    const { disconnectAsync } = useDisconnect()
    const chainId = DEFAULT_CHAIN_ID

    const { t } = useTranslation()
    const { toastError } = useToast()

    const login = useCallback(
        async (connectorId: ConnectorNames) => {
            const findConnector = connectors.find((item) => item.id === connectorId)
            try {
                const connected = await connectAsync({ connector: findConnector, chainId })
                return connected
            } catch (error) {
                if (error instanceof ConnectorNotFoundError) {
                    toastError(t('Provider Error'), t('No provider was found'))
                    console.log('wallet connector not found')
                }
                if (error instanceof SwitchChainError || error instanceof SwitchChainNotSupportedError) {
                    toastError(t('Switch Network Error'), t('Unable to switch network, please try it on your wallet'))
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