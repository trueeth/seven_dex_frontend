import React from 'react'
import { configureChains, createClient } from 'wagmi'
import memoize from 'lodash/memoize'
import { polygon } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { Web3Provider } from '@ethersproject/providers'
import useSWRImmutable from 'swr/immutable'
import { useAccount, WagmiConfig, useNetwork } from 'wagmi'
import { getDefaultClient } from 'connectkit'

const CHAINS = [polygon]

export const { provider, chains } = configureChains(CHAINS, [
    jsonRpcProvider({
        rpc: (chain) => {
            return { http: chain.rpcUrls.default.http[0] }
        }
    })
])

const client = createClient(
    getDefaultClient({
        appName: 'Your App Name',
        chains: [polygon]
    })
)

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId) => CHAIN_IDS.includes(chainId))

export function WagmiProvider(props: React.PropsWithChildren) {
    return (
        <WagmiConfig client={client}>
            <Web3LibraryProvider>{props.children}</Web3LibraryProvider>
        </WagmiConfig>
    )
}

const Web3LibraryContext = React.createContext<Web3Provider | undefined>(undefined)

export const useWeb3LibraryContext = () => {
    return React.useContext(Web3LibraryContext)
}

const Web3LibraryProvider: React.FC<React.PropsWithChildren> = (props) => {
    const { connector } = useAccount()
    const { chain } = useNetwork()
    const { data: library } = useSWRImmutable(connector && ['web3-library', connector, chain], async () => {
        const provider = await connector?.getProvider()
        return new Web3Provider(provider)
    })
    return <Web3LibraryContext.Provider value={library}>{props.children}</Web3LibraryContext.Provider>
}
