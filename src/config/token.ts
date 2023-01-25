import UsdtLogo from '../asset/images/crypto-usdt.png'
import UsdcLogo from '../asset/images/crypto-usdc.png'
import DaiLogo from '../asset/images/crypto-dai.svg'
import EthereumLogo from '../asset/images/crypto-ethereum.png'
import BtcLogo from '../asset/images/crypto-btc.svg'
import BusdLogo from '../asset/images/crypto-busd.svg'
import BnbLogo from '../asset/images/crypto-bnb.svg'

export interface IToken {
    name: string,
    symbol: string,
    decimal: number,
    logo: string
}

export const tokens: Record<string, IToken> = {
    'BNB': {
        name: 'BNB',
        symbol: 'BNB',
        decimal: 18,
        logo: BnbLogo
    },
    'BUSD': {
        name: 'BUSD',
        symbol: 'BUSD',
        decimal: 18,
        logo: BusdLogo
    },
    'USDC': {
        name: 'USDC',
        symbol: 'USDC',
        decimal: 18,
        logo: UsdcLogo
    },
    'USDT': {
        name: 'USDT',
        symbol: 'USDT',
        decimal: 18,
        logo: UsdtLogo
    },
    'DAI': {
        name: 'DAI',
        symbol: 'DAI',
        decimal: 18,
        logo: DaiLogo
    },
    'WETH': {
        name: 'WETH',
        symbol: 'WETH',
        decimal: 18,
        logo: EthereumLogo
    },
    'WBTC': {
        name: 'WBTC',
        symbol: 'WBTC',
        decimal: 18,
        logo: BtcLogo
    },

}