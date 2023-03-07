import JSBI from 'jsbi'
import { Percent } from 'src/utils/percent'
import { Token } from 'src/utils/token'
import { ChainId } from './chains'
import { ChainMap, ChainTokenList } from './types'


export const EXCHANGE_PAGE_PATHS = ['/swap', '/limit-orders', 'liquidity', '/add', '/find', '/remove']

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_TEN = JSBI.BigInt(10)
export const MIN_BNB: JSBI = JSBI.exponentiate(BIG_INT_TEN, JSBI.BigInt(16)) // .01 BNB

// one basis point
export const BIPS_BASE = JSBI.BigInt(10000)
export const ONE_BIPS = new Percent(JSBI.BigInt(1), BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(JSBI.BigInt(25), BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)


export const ROUTER_ADDRESS: ChainMap<string> = {
    [ChainId.ETHEREUM]: '',
    [ChainId.GOERLI]: '',
    [ChainId.POLYGON]: '',
    [ChainId.MUMBAI]: '0xd85224F57D97C222782D0a86D9EFd2bb3D4d8740',
    [ChainId.SVC]: '',
}

export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
    [ChainId.ETHEREUM]: [],
    [ChainId.GOERLI]: [],
    [ChainId.POLYGON]: [],
    [ChainId.MUMBAI]: [],
    [ChainId.SVC]: [],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
    [ChainId.ETHEREUM]: {},
    [ChainId.GOERLI]: {},
    [ChainId.POLYGON]: {},
    [ChainId.MUMBAI]: {},
    [ChainId.SVC]: {},
}

export const INIT_CODE_HASH = '0x779199715a163c6128f5f983f1cf0968e90196e270a1a858669fd96994117c39'
export const INIT_CODE_HASH_MAP: Record<number, string> = {
    [ChainId.ETHEREUM]: INIT_CODE_HASH,
    [ChainId.GOERLI]: INIT_CODE_HASH,
    [ChainId.POLYGON]: INIT_CODE_HASH,
    [ChainId.MUMBAI]: INIT_CODE_HASH,
    [ChainId.SVC]: INIT_CODE_HASH,
}


export const FACTORY_ADDRESS_MAP: Record<number, string> = {
    [ChainId.ETHEREUM]: '',
    [ChainId.GOERLI]: '',
    [ChainId.POLYGON]: '',
    [ChainId.MUMBAI]: '0x6725f303b657a9451d8ba641348b6761a6cc7a17',
    [ChainId.POLYGON]: ''
}



