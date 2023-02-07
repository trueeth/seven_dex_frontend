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

export const DEFAULT_CHAIN_ID = 97
export const DEFAULT_PROVIDER = 'https://data-seed-prebsc-1-s3.binance.org:8545'

const bscExplorer = { name: 'BscScan', url: 'https://bscscan.com' }

export const bsc: Chain = {
    id: 56,
    name: 'BNB Smart Chain',
    network: 'bsc',
    rpcUrls: {
        public: 'https://bsc-dataseed1.binance.org',
        default: 'https://bsc-dataseed1.binance.org',
    },
    blockExplorers: {
        default: bscExplorer,
        etherscan: bscExplorer,
    },
    nativeCurrency: {
        name: 'Binance Chain Native Token',
        symbol: 'BNB',
        decimals: 18,
    }
}

export const bscTest: Chain = {
    id: 97,
    name: 'BNB Smart Chain Testnet',
    network: 'bsc-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Binance Chain Native Token',
        symbol: 'tBNB',
    },
    rpcUrls: {
        public: 'https://data-seed-prebsc-1-s2.binance.org:8545/',
        default: 'https://data-seed-prebsc-1-s2.binance.org:8545/',
    },
    blockExplorers: {
        default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
    },
    testnet: true,
}

