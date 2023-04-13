import { Currency, CurrencyAmount } from './token'
import JSBI from 'jsbi'
import { Trade } from './trade'
import { Percent } from './percent'
import { Fraction } from './fraction'
import { TradeType } from 'src/config/constants'
import IRouterABI from 'src/config/abi/IRouter.json'
import { IRouter } from 'src/config/abi/types/IRouter'
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BIPS_BASE,
<<<<<<< HEAD
=======
  BLOCKED_PRICE_IMPACT,
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  INPUT_FRACTION_AFTER_FEE,
  ONE_HUNDRED_PERCENT,
  ROUTER_ADDRESS,
} from 'src/config/constants/exchange'

<<<<<<< HEAD
import { useActiveChainId } from 'src/hooks/useActiveChainId' 
=======
import { useActiveChainId } from 'src/hooks/useActiveChainId'
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
import { useContract } from 'src/hooks/useContract'

import { Field } from '../state/swap/actions'

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), BIPS_BASE)
}

export function calculateSlippageAmount(value: CurrencyAmount<Currency>, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.quotient, JSBI.BigInt(10000 - slippage)), BIPS_BASE),
    JSBI.divide(JSBI.multiply(value.quotient, JSBI.BigInt(10000 + slippage)), BIPS_BASE),
  ]
}

export function useRouterContract() {
  const { chainId } = useActiveChainId()
  return useContract<IRouter>(ROUTER_ADDRESS[chainId], IRouterABI, true)
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade: Trade<Currency, Currency, TradeType> | null): {
  priceImpactWithoutFee: Percent | undefined
  realizedLPFee: CurrencyAmount<Currency> | undefined | null
} {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
<<<<<<< HEAD
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction): Fraction => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          ONE_HUNDRED_PERCENT,
        ),
      )
=======
      trade.route.pairs.reduce<Fraction>(
        (currentFee: Fraction): Fraction => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
        ONE_HUNDRED_PERCENT,
      ),
    )
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade?.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    CurrencyAmount.fromRawAmount(
      trade.inputAmount.currency,
      realizedLPFee.multiply(trade.inputAmount.quotient).quotient,
    )

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips

export function computeSlippageAdjustedAmounts(
  trade: Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: number,
): { [field in Field]?: CurrencyAmount<Currency> } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  }
}

<<<<<<< HEAD
export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
=======
export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 | 5 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT)) return 5
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1
  return 0
}

export function formatExecutionPrice(
<<<<<<< HEAD
  trade?: Trade<Currency, Currency, TradeType> ,
=======
  trade?: Trade<Currency, Currency, TradeType>,
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
  inverted?: boolean,
): string {
  if (!trade) {
    return ''
  }
  return inverted
<<<<<<< HEAD
    ? `${trade.executionPrice.invert().toSignificant(6)} ${trade.inputAmount.currency.symbol} / ${
        trade.outputAmount.currency.symbol
      }`
    : `${trade.executionPrice.toSignificant(6)} ${trade.outputAmount.currency.symbol} / ${
        trade.inputAmount.currency.symbol
      }`
=======
    ? `${trade.executionPrice.invert().toSignificant(6)} ${trade.inputAmount.currency.symbol} / ${trade.outputAmount.currency.symbol
    }`
    : `${trade.executionPrice.toSignificant(6)} ${trade.outputAmount.currency.symbol} / ${trade.inputAmount.currency.symbol
    }`
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
}
