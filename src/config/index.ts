export enum ConnectorNames {
    MetaMask = 'metaMask',
    Injected = 'injected',
    WalletConnect = 'walletConnect',
    WalletLink = 'coinbaseWallet'
}

export const CELER_API = 'https://api.celerscan.com/scan'

export const TokenImage: Record<string, string> = {
    weth: 'https://tokens.pancakeswap.finance/images/symbol/weth.png',
    wbtc: 'https://tokens.pancakeswap.finance/images/symbol/wbtc.png',
    matic: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
    svc: './assets/images/svc.png',
    b2z: './assets/images/b2z.png'
}
