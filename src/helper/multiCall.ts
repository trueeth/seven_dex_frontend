import {
    Multicall,
} from 'ethereum-multicall'
import { getDefaultProvider } from './provider'

export const multicall = new Multicall({ ethersProvider: getDefaultProvider(), tryAggregate: true })
