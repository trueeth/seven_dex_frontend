import { Chain } from 'wagmi'
import memoize from 'lodash/memoize'
import invert from 'lodash/invert'

export enum ChainId {
    ETHEREUM = 1,
    GOERLI = 5,
    POLYGON = 137,
    MUMBAI = 80001,
    SVC = 36
}

export const CHAIN_QUERY_NAME = {
    [ChainId.ETHEREUM]: 'eth',
    [ChainId.GOERLI]: 'goerli',
    [ChainId.POLYGON]: 'polygon',
    [ChainId.MUMBAI]: 'mumbai',
    [ChainId.SVC]: 'svc'
} as Record<ChainId, string>

const CHAIN_QUERY_NAME_TO_ID = invert(CHAIN_QUERY_NAME)

export const getChainId = memoize((chainName: string) => {
    if (!chainName) return undefined
    return CHAIN_QUERY_NAME_TO_ID[chainName] ? +CHAIN_QUERY_NAME_TO_ID[chainName] : undefined
})

export const DEFAULT_CHAIN_ID = 80001
export const DEFAULT_PROVIDER = 'https://matic-mumbai.chainstacklabs.com'

const explorer = { name: 'PolygonScan', url: 'https://polygonscan.com/' }

export const polygon: Chain = {
    id: 137,
    name: 'Polygon Chain',
    network: 'polygon',
    rpcUrls: {
        public: 'https://matic-mumbai.chainstacklabs.com',
        default: 'https://matic-mumbai.chainstacklabs.com',
    },
    blockExplorers: {
        default: explorer,
        etherscan: explorer,
    },
    nativeCurrency: {
        name: 'Polygon Chain Native Token',
        symbol: 'MATIC',
        decimals: 18,
    }
}

export const mumbai: Chain = {
    id: 80001,
    name: 'Polygon Chain Testnet',
    network: 'mumbai',
    nativeCurrency: {
        decimals: 18,
        name: 'Polygon Chain Native Token',
        symbol: 'MATIC',
    },
    rpcUrls: {
        public: 'https://matic-mumbai.chainstacklabs.com',
        default: 'https://matic-mumbai.chainstacklabs.com',
    },
    blockExplorers: {
        default: { name: 'PolygonScan', url: 'https://mumbai.polygonscan.com/' },
    },
    testnet: true,
}

