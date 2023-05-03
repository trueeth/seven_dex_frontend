import React from 'react'
import { configureChains, createClient } from 'wagmi'
import memoize from 'lodash/memoize'
import { polygonMumbai } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { Web3Provider } from '@ethersproject/providers'
import useSWRImmutable from 'swr/immutable'
import { useAccount, WagmiConfig, useNetwork } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'

const CHAINS = [polygonMumbai]

export const { provider, chains } = configureChains(CHAINS, [
    jsonRpcProvider({
        rpc: (chain) => {
            return { http: chain.rpcUrls.default.http[0] }
        }
    }),
    publicProvider()
])

// const client = createClient(
//     getDefaultClient({
//         appName: 'Seven Dex',
//         chains: [polygonMumbai]
//     })
// )

const { connectors } = getDefaultWallets({
    appName: 'Seven Dex',
    projectId: '0x01',
    chains
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId) => CHAIN_IDS.includes(chainId))
export const isChainTestnet = memoize((chainId: number) => chains.find((c) => c.id === chainId)?.testnet)

export function WagmiProvider(props: React.PropsWithChildren) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <Web3LibraryProvider>{props.children}</Web3LibraryProvider>
            </RainbowKitProvider>
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
