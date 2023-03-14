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
    svc: 'https://dex-svc.ceewen.xyz/static/media/seven_chain_logo.5ec2cfe0.png'
}
