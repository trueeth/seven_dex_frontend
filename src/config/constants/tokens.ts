import { ERC20Token, SVC_MAINNET, SVC_TESTNET, WMATIC } from "src/utils/token";
import { ChainId } from "./chains";

export const PINNED_TOKENS_MUMBAI = {
    wmatic: WMATIC[ChainId.MUMBAI],
    svc: SVC_TESTNET,
    weth: new ERC20Token(
        ChainId.MUMBAI,
        '0x46D7484dd2E05F4108192Fd0c6431c8e24511C23',
        18,
        'WETH',
        'Wrapped Ether',
        'https://tokens.pancakeswap.finance/images/symbol/weth.png'
    ),
    wbtc: new ERC20Token(
        ChainId.MUMBAI,
        '0xd3FCc4593470257Ab924950B5d83aeE611708533',
        18,
        'WBTC',
        'Wrapped BTC',
        'https://tokens.pancakeswap.finance/images/symbol/wbtc.png'
    )
}

export const PINNED_TOKENS_POLYGON = {
    wmatic: WMATIC[ChainId.POLYGON],
    svc: SVC_MAINNET,
    weth: new ERC20Token(
        ChainId.POLYGON,
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        18,
        'WETH',
        'Wrapped Ether',
        'https://tokens.pancakeswap.finance/images/symbol/weth.png'
    ),
    wbtc: new ERC20Token(
        ChainId.POLYGON,
        '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        18,
        'WBTC',
        'Wrapped BTC',
        'https://tokens.pancakeswap.finance/images/symbol/wbtc.png'
    ),
    b2z: new ERC20Token(
        ChainId.POLYGON,
        '0xbec158cd8dF7E48322485816Eab3a984f69458d8',
        18,
        'B2Z',
        'B2Z Exchange',
        './assets/images/b2z.png'
    )
}