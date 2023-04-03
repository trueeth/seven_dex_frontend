import { Contract } from '@ethersproject/contracts'
import type { Provider } from '@ethersproject/providers'
import type { Signer } from '@ethersproject/abstract-signer'
import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { AddressZero } from '@ethersproject/constants'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { Currency, CurrencyAmount, Token } from './token'
import { Percent } from './percent'
import { ONE, THREE, TWO, VMType, VM_TYPE_MAXIMA, ZERO } from 'src/config/constants'
import JSBI from 'jsbi'
import { Price } from './price'
import { BigNumber } from 'ethers'
import { ChainId, mumbai } from 'src/config/constants/chains'
import { chains } from './wagmi'

// warns if addresses are not checksummed
// eslint-disable-next-line consistent-return
export function validateAndParseAddress(address: string): string {
    try {
        const checksummedAddress = getAddress(address)
        warning(address === checksummedAddress, `${address} is not checksummed.`)
        return checksummedAddress
    } catch (error) {
        invariant(false, `${address} is not a valid address.`)
    }
}

export const isAddress = memoize((value: any): string | false => {
    try {
        return getAddress(value)
    } catch {
        return false
    }
})

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
    const parsed = isAddress(address)
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function getContract(address: string, ABI: any, signer?: Signer | Provider): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(address, ABI, signer)
}


export function validateVMTypeInstance(value: JSBI, vmType: VMType): void {
    invariant(JSBI.greaterThanOrEqual(value, ZERO), `${value} is not a ${vmType}.`)
    invariant(JSBI.lessThanOrEqual(value, VM_TYPE_MAXIMA[vmType]), `${value} is not a ${vmType}.`)
}

// mock the on-chain sqrt function
export function sqrt(y: JSBI): JSBI {
    validateVMTypeInstance(y, VMType.uint256)
    let z: JSBI = ZERO
    let x: JSBI
    if (JSBI.greaterThan(y, THREE)) {
        z = y
        x = JSBI.add(JSBI.divide(y, TWO), ONE)
        while (JSBI.lessThan(x, z)) {
            z = x
            x = JSBI.divide(JSBI.add(JSBI.divide(y, x), x), TWO)
        }
    } else if (JSBI.notEqual(y, ZERO)) {
        z = ONE
    }
    return z
}

/* eslint-disable */
// given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item
export function sortedInsert<T>(items: T[], add: T, maxSize: number, comparator: (a: T, b: T) => number): T | null {
    invariant(maxSize > 0, 'MAX_SIZE_ZERO')
    // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize
    invariant(items.length <= maxSize, 'ITEMS_SIZE')

    // short circuit first item add
    if (items.length === 0) {
        items.push(add)
        return null
    } else {
        const isFull = items.length === maxSize
        // short circuit if full and the additional item does not come before the last item
        if (isFull && comparator(items[items.length - 1], add) <= 0) {
            return add
        }

        let lo = 0,
            hi = items.length

        while (lo < hi) {
            const mid = (lo + hi) >>> 1
            if (comparator(items[mid], add) <= 0) {
                lo = mid + 1
            } else {
                hi = mid
            }
        }
        items.splice(lo, 0, add)
        return isFull ? items.pop()! : null
    }
}
/* eslint-enable */

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
export function computePriceImpact<TBase extends Currency, TQuote extends Currency>(
    midPrice: Price<TBase, TQuote>,
    inputAmount: CurrencyAmount<TBase>,
    outputAmount: CurrencyAmount<TQuote>
): Percent {
    const quotedOutputAmount = midPrice.quote(inputAmount)
    // calculate price impact := (exactQuote - outputAmount) / exactQuote
    const priceImpact = quotedOutputAmount.subtract(outputAmount).divide(quotedOutputAmount)
    return new Percent(priceImpact.numerator, priceImpact.denominator)
}

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: CurrencyAmount<Token>, balanceB?: CurrencyAmount<Token>) {
    if (balanceA && balanceB) {
        return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1
    }
    if (balanceA && balanceA.greaterThan('0')) {
        return -1
    }
    if (balanceB && balanceB.greaterThan('0')) {
        return 1
    }
    return 0
}

export function getTokenComparator(balances: {
    [tokenAddress: string]: CurrencyAmount<Token> | undefined
}): (tokenA: Token, tokenB: Token) => number {
    return function sortTokens(tokenA: Token, tokenB: Token): number {
        // -1 = a is first
        // 1 = b is first

        // sort by balances
        const balanceA = balances[tokenA.address]
        const balanceB = balances[tokenB.address]

        const balanceComp = balanceComparator(balanceA, balanceB)
        if (balanceComp !== 0) return balanceComp

        if (tokenA.symbol && tokenB.symbol) {
            // sort by symbol
            return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
        }
        return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
    }
}

// add 10%
export function calculateGasMargin(value: BigNumber, margin = 1000): BigNumber {
    return value.mul(BigNumber.from(10000).add(BigNumber.from(margin))).div(BigNumber.from(10000))
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function getBlockExploreLink(
    data: string | number,
    type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
    chainIdOverride?: number,
): string {
    const chainId = chainIdOverride || ChainId.MUMBAI
    const chain = chains.find((c) => c.id === chainId)
    if (!chain) return mumbai.blockExplorers.default.url
    switch (type) {
        case 'transaction': {
            return `${chain.blockExplorers.default.url}/tx/${data}`
        }
        case 'token': {
            return `${chain.blockExplorers.default.url}/token/${data}`
        }
        case 'block': {
            return `${chain.blockExplorers.default.url}/block/${data}`
        }
        case 'countdown': {
            return `${chain.blockExplorers.default.url}/block/countdown/${data}`
        }
        default: {
            return `${chain.blockExplorers.default.url}/address/${data}`
        }
    }
}

export function getBlockExploreName(chainIdOverride?: number) {
    const chainId = chainIdOverride || ChainId.MUMBAI
    const chain = chains.find((c) => c.id === chainId)

    return chain?.blockExplorers?.default.name || mumbai.blockExplorers.default.name
}

export const numberInputOnWheelPreventChange = (e) => {
    // Prevent the input value change
    e.target.blur()

    // Prevent the page/container scrolling
    e.stopPropagation()

    setTimeout(() => {
        e.target.focus()
    }, 0)
}








