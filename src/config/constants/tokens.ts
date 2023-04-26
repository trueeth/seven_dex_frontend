import { ERC20Token, SVC_TESTNET, WMATIC } from "@/utils/token";
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