import React from 'react'
import { configureChains, createClient, Chain } from 'wagmi'
import memoize from 'lodash/memoize'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { Web3Provider } from '@ethersproject/providers'
import useSWRImmutable from 'swr/immutable'
import { useAccount, WagmiConfig, useNetwork } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultClient } from 'connectkit'

const mumbai = {
    id: 80001,
    name: 'Polygon Mumbai',
    network: 'maticmum',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: {
        alchemy: {
            http: ['https://polygon-mumbai.g.alchemy.com/v2'],
            webSocket: ['wss://polygon-mumbai.g.alchemy.com/v2']
        },
        infura: {
            http: ['https://polygon-mumbai.infura.io/v3'],
            webSocket: ['wss://polygon-mumbai.infura.io/ws/v3']
        },
        default: {
            http: ['https://rpc-mumbai.maticvigil.com']
        },
        public: {
            http: ['https://rpc-mumbai.maticvigil.com']
        }
    },
    blockExplorers: {
        etherscan: {
            name: 'PolygonScan',
            url: 'https://mumbai.polygonscan.com'
        },
        default: {
            name: 'PolygonScan',
            url: 'https://mumbai.polygonscan.com'
        }
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 25770160
        }
    },
    testnet: true
} as const satisfies Chain

const CHAINS = [mumbai]

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
        chains: [mumbai]
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
