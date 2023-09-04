import { parseUnits } from '@ethersproject/units'

export enum GAS_PRICE {
    default = '200',
    fast = '400',
    instant = '400',
    testnet = '400'
}

export const GAS_PRICE_GWEI = {
    rpcDefault: 'rpcDefault',
    default: parseUnits(GAS_PRICE.default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE.fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE.instant, 'gwei').toString(),
    testnet: parseUnits(GAS_PRICE.testnet, 'gwei').toString()
}
