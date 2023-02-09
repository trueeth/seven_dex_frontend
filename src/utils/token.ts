import { ChainId } from "../config/constants/chains"
import invariant from 'tiny-invariant'
import { validateAndParseAddress } from "./index"
import { TokenAddressMap } from "./wrappedTokenInfo"
import JSBI from 'jsbi'
import _Big from 'big.js'
import toFormat from 'toformat'
import { BigintIsh, Fraction, Rounding } from "./fraction"

type ExtensionValue = string | number | boolean | null | undefined

const Big = toFormat(_Big)
export const MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

export interface TokenInfo {
    readonly chainId: number
    readonly address: string
    readonly name: string
    readonly decimals: number
    readonly symbol: string
    readonly logoURI?: string
    readonly tags?: string[]
    readonly extensions?: {
        readonly [key: string]:
        | {
            [key: string]:
            | {
                [key: string]: ExtensionValue
            }
            | ExtensionValue
        }
        | ExtensionValue
    }
}

export interface Version {
    readonly major: number
    readonly minor: number
    readonly patch: number
}

export enum VersionUpgrade {
    NONE,
    PATCH,
    MINOR,
    MAJOR,
}

export interface Tags {
    readonly [tagId: string]: {
        readonly name: string
        readonly description: string
    }
}

export interface TokenList {
    readonly name: string
    readonly timestamp: string
    readonly version: Version
    readonly tokens: TokenInfo[]
    readonly keywords?: string[]
    readonly tags?: Tags
    readonly logoURI?: string
}


export interface SerializedToken {
    chainId: number
    address: string
    decimals: number
    symbol: string
    name?: string
    projectLink?: string
}


export abstract class BaseCurrency {
    /**
     * Returns whether the currency is native to the chain and must be wrapped (e.g. Ether)
     */
    public abstract readonly isNative: boolean

    /**
     * Returns whether the currency is a token that is usable in PancakeSwap without wrapping
     */
    public abstract readonly isToken: boolean

    /**
     * The chain ID on which this currency resides
     */
    public readonly chainId: number

    /**
     * The decimals used in representing currency amounts
     */
    public readonly decimals: number

    /**
     * The symbol of the currency, i.e. a short textual non-unique identifier
     */
    public readonly symbol: string

    /**
     * The name of the currency, i.e. a descriptive textual non-unique identifier
     */
    public readonly name?: string

    public readonly logoURI?: string

    /**
     * Constructs an instance of the base class `BaseCurrency`.
     * @param chainId the chain ID on which this currency resides
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     */
    protected constructor(chainId: number, decimals: number, symbol: string, name?: string, logoURI?: string) {
        invariant(Number.isSafeInteger(chainId), 'CHAIN_ID')
        invariant(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), 'DECIMALS')

        this.chainId = chainId
        this.decimals = decimals
        this.symbol = symbol
        this.name = name
        this.logoURI = logoURI
    }

    /**
     * Returns whether this currency is functionally equivalent to the other currency
     * @param other the other currency
     */
    public abstract equals(other: Currency): boolean

    /**
     * Return the wrapped version of this currency that can be used with the PancakeSwap contracts. Currencies must
     * implement this to be used in PancakeSwap
     */
    public abstract get wrapped(): Token
}

export abstract class NativeCurrency extends BaseCurrency {
    public readonly isNative: true = true

    public readonly isToken: false = false
}

export class Native extends NativeCurrency {
    protected constructor({
        chainId,
        decimals,
        name,
        symbol,
        logoURI
    }: {
        chainId: number
        decimals: number
        symbol: string
        name: string
        logoURI: string
    }) {
        super(chainId, decimals, symbol, name, logoURI)
    }

    public get wrapped(): Token {
        const wnative = WNATIVE[this.chainId]
        invariant(!!wnative, 'WRAPPED')
        return wnative
    }

    private static cache: { [chainId: number]: Native } = {}

    public static onChain(chainId: number): Native {
        if (chainId in this.cache) {
            return this.cache[chainId]
        }
        invariant(!!NATIVE[chainId], 'NATIVE_CURRENCY')
        const { decimals, name, symbol, logoURI } = NATIVE[chainId]
        return (this.cache[chainId] = new Native({ chainId, decimals, symbol, name, logoURI }))
    }

    public equals(other: Currency): boolean {
        return other.isNative && other.chainId === this.chainId
    }
}


export class Token extends BaseCurrency {
    public readonly isNative: false = false

    public readonly isToken: true = true

    /**
     * The contract address on the chain on which this token lives
     */
    public readonly address: string

    public readonly projectLink?: string

    public readonly logoURI: string

    public constructor(
        chainId: number,
        address: string,
        decimals: number,
        symbol: string,
        name?: string,
        projectLink?: string
    ) {
        super(chainId, decimals, symbol, name)
        this.address = address
        this.projectLink = projectLink
    }

    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    public equals(other: Currency): boolean {
        return other.isToken && this.chainId === other.chainId && this.address === other.address
    }

    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    public sortsBefore(other: Token): boolean {
        invariant(this.chainId === other.chainId, 'CHAIN_IDS')
        invariant(this.address !== other.address, 'ADDRESSES')
        return this.address.toLowerCase() < other.address.toLowerCase()
    }

    /**
     * Return this token, which does not need to be wrapped
     */
    public get wrapped(): Token {
        return this
    }

    public get serialize(): SerializedToken {
        return {
            address: this.address,
            chainId: this.chainId,
            decimals: this.decimals,
            symbol: this.symbol,
            name: this.name,
            projectLink: this.projectLink,
        }
    }
}


export type Currency = NativeCurrency | Token


// /**
//  * Represents an ERC20 token with a unique address and some metadata.
//  */
export class ERC20Token extends Token {
    public constructor(
        chainId: number,
        address: string,
        decimals: number,
        symbol: string,
        name?: string,
        projectLink?: string
    ) {
        super(chainId, validateAndParseAddress(address), decimals, symbol, name, projectLink)
    }
}

/**
 * Return the upgrade type from the base version to the update version.
 * Note that downgrades and equivalent versions are both treated as `NONE`.
 * @param base base list
 * @param update update to the list
 */
export function getVersionUpgrade(base: Version, update: Version): VersionUpgrade {
    if (update.major > base.major) {
        return VersionUpgrade.MAJOR
    }
    if (update.major < base.major) {
        return VersionUpgrade.NONE
    }
    if (update.minor > base.minor) {
        return VersionUpgrade.MINOR
    }
    if (update.minor < base.minor) {
        return VersionUpgrade.NONE
    }
    return update.patch > base.patch ? VersionUpgrade.PATCH : VersionUpgrade.NONE
}

export class CurrencyAmount<T extends Currency> extends Fraction {
    public readonly currency: T

    public readonly decimalScale: JSBI

    /**
     * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
     * @param currency the currency in the amount
     * @param rawAmount the raw token or ether amount
     */
    public static fromRawAmount<T extends Currency>(currency: T, rawAmount: BigintIsh): CurrencyAmount<T> {
        return new CurrencyAmount(currency, rawAmount)
    }

    /**
     * Construct a currency amount with a denominator that is not equal to 1
     * @param currency the currency
     * @param numerator the numerator of the fractional token amount
     * @param denominator the denominator of the fractional token amount
     */
    public static fromFractionalAmount<T extends Currency>(
        currency: T,
        numerator: BigintIsh,
        denominator: BigintIsh
    ): CurrencyAmount<T> {
        return new CurrencyAmount(currency, numerator, denominator)
    }

    protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh) {
        super(numerator, denominator)
        invariant(JSBI.lessThanOrEqual(this.quotient, MaxUint256), 'AMOUNT')
        this.currency = currency
        this.decimalScale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals))
    }

    public add(other: CurrencyAmount<T>): CurrencyAmount<T> {
        invariant(this.currency.equals(other.currency), 'CURRENCY')
        const added = super.add(other)
        return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator)
    }

    public subtract(other: CurrencyAmount<T>): CurrencyAmount<T> {
        invariant(this.currency.equals(other.currency), 'CURRENCY')
        const subtracted = super.subtract(other)
        return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator)
    }

    public multiply(other: Fraction | BigintIsh): CurrencyAmount<T> {
        const multiplied = super.multiply(other)
        return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator)
    }

    public divide(other: Fraction | BigintIsh): CurrencyAmount<T> {
        const divided = super.divide(other)
        return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator)
    }

    public toSignificant(significantDigits = 6, format?: object, rounding: Rounding = Rounding.ROUND_DOWN): string {
        return super.divide(this.decimalScale).toSignificant(significantDigits, format, rounding)
    }

    public toFixed(
        decimalPlaces: number = this.currency.decimals,
        format?: object,
        rounding: Rounding = Rounding.ROUND_DOWN
    ): string {
        invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
        return super.divide(this.decimalScale).toFixed(decimalPlaces, format, rounding)
    }

    public toExact(format: object = { groupSeparator: '' }): string {
        Big.DP = this.currency.decimals
        return new Big(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format)
    }

    public get wrapped(): CurrencyAmount<Token> {
        if (this.currency.isToken) return this as CurrencyAmount<Token>
        return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator)
    }
}

export const WETH = {
    [ChainId.ETHEREUM]: new ERC20Token(
        ChainId.ETHEREUM,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        18,
        'WETH',
        'Wrapped Ether',
        'https://weth.io'
    ),
    [ChainId.GOERLI]: new ERC20Token(
        ChainId.GOERLI,
        '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        18,
        'WETH',
        'Wrapped Ether',
        'https://weth.io'
    ),
}

export const WMATIC = {
    [ChainId.ETHEREUM]: new ERC20Token(
        ChainId.ETHEREUM,
        '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        18,
        'WMATIC',
        'Wrapped Matic',
        'https://polygon.technology/'
    ),
    [ChainId.POLYGON]: new ERC20Token(
        ChainId.POLYGON,
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        18,
        'WMATIC',
        'Wrapped BNB',
        'https://polygon.technology/'
    ),
    [ChainId.MUMBAI]: new ERC20Token(
        ChainId.MUMBAI,
        '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
        18,
        'WMATIC',
        'Wrapped BNB',
        'https://polygon.technology/'
    )
}

export const WNATIVE: Record<number, ERC20Token> = {
    [ChainId.ETHEREUM]: WETH[ChainId.ETHEREUM],
    [ChainId.GOERLI]: WETH[ChainId.GOERLI],
    [ChainId.POLYGON]: WMATIC[ChainId.POLYGON],
    [ChainId.MUMBAI]: WMATIC[ChainId.MUMBAI],
}


export const NATIVE: Record<
    number,
    {
        name: string
        symbol: string
        decimals: number,
        logoURI?: string
    }
> = {
    [ChainId.ETHEREUM]: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
    },
    [ChainId.GOERLI]: {
        name: 'Goerli Ether',
        symbol: 'GOR',
        decimals: 18
    },
    [ChainId.POLYGON]: {
        name: 'Native Token',
        symbol: 'MATIC',
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
    },
    [ChainId.MUMBAI]: {
        name: 'Native Token',
        symbol: 'MATIC',
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
    },
    [ChainId.SVC]: {
        name: 'SVC Token',
        symbol: 'SVC',
        decimals: 18,
    }
}


export const EMPTY_LIST: TokenAddressMap<ChainId> = {
    [ChainId.ETHEREUM]: {},
    [ChainId.GOERLI]: {},
    [ChainId.POLYGON]: {},
    [ChainId.MUMBAI]: {},
    [ChainId.SVC]: {}
}
