import { Token } from "src/utils/token"
import { ChainId } from "./chains"

export enum FetchStatus {
    Idle = 'IDLE',
    Fetching = 'FETCHING',
    Fetched = 'FETCHED',
    Failed = 'FAILED',
}


export type ChainMap<T> = {
    readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>