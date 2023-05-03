import { ChainId } from "@/config/constants/chains"
import { ERC20Token } from "@/utils/token"

import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState, useAppDispatch } from "@/state"
import { addSerializedPair, addSerializedToken, removeSerializedToken, SerializedPair, updateGasPrice, updateUserDeadline, updateUserSlippageTolerance, addWatchlistToken, updateUserSingleHopOnly } from "../actions"
import useActiveWeb3React from "@/hooks/useActiveWeb3React"
import { useWeb3LibraryContext } from "@/utils/wagmi"
import { GAS_PRICE_GWEI } from "@/state/types"
import useSWR from 'swr'
import { useFeeData } from "wagmi"
import { Pair } from "@/utils/pair"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { deserializeToken } from "@/utils/wrappedTokenInfo"
import { isAddress } from "@/utils"
import { useOfficialsAndUserAddedTokens } from "@/hooks/Tokens"
import flatMap from 'lodash/flatMap'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from "@/config/constants/exchange"


export function useUserTransactionTTL(): [number, (slippage: number) => void] {
    const dispatch = useAppDispatch()
    const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>((state) => {
        return state.user.userDeadline
    })

    const setUserDeadline = useCallback(
        (deadline: number) => {
            dispatch(updateUserDeadline({ userDeadline: deadline }))
        },
        [dispatch],
    )

    return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: ERC20Token) => void {
    const dispatch = useAppDispatch()
    return useCallback(
        (token: ERC20Token) => {
            dispatch(addSerializedToken({ serializedToken: token.serialize }))
        },
        [dispatch],
    )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
    const dispatch = useAppDispatch()
    return useCallback(
        (chainId: number, address: string) => {
            dispatch(removeSerializedToken({ chainId, address }))
        },
        [dispatch],
    )
}

export function useGasPrice(chainIdOverride?: number): string {
    const { chainId: chainId_, chain } = useActiveWeb3React()
    const library = useWeb3LibraryContext()
    const chainId = chainIdOverride ?? chainId_
    const userGas = useSelector<AppState, AppState['user']['gasPrice']>((state) => state.user.gasPrice)
    const { data: bscProviderGasPrice = GAS_PRICE_GWEI.default } = useSWR(
        library &&
        library.provider &&
        chainId === ChainId.POLYGON &&
        userGas === GAS_PRICE_GWEI.rpcDefault && ['bscProviderGasPrice', library.provider],
        async () => {
            const gasPrice = await library.getGasPrice()
            return gasPrice.toString()
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )
    const { data } = useFeeData({
        chainId,
        enabled: chainId !== ChainId.POLYGON && chainId !== ChainId.MUMBAI,
        watch: true,
    })
    if (chainId === ChainId.POLYGON) {
        return userGas === GAS_PRICE_GWEI.rpcDefault ? bscProviderGasPrice : userGas
    }
    if (chainId === ChainId.MUMBAI) {
        return GAS_PRICE_GWEI.testnet
    }
    if (chain?.testnet) {
        return data?.formatted?.maxPriorityFeePerGas
    }
    return data?.formatted?.gasPrice
}

export function useGasPriceManager(): [string, (userGasPrice: string) => void] {
    const dispatch = useAppDispatch()
    const userGasPrice = useSelector<AppState, AppState['user']['gasPrice']>((state) => state.user.gasPrice)

    const setGasPrice = useCallback(
        (gasPrice: string) => {
            dispatch(updateGasPrice({ gasPrice }))
        },
        [dispatch],
    )

    return [userGasPrice, setGasPrice]
}

function serializePair(pair: Pair): SerializedPair {
    return {
        token0: pair.token0.serialize,
        token1: pair.token1.serialize,
    }
}

export function usePairAdder(): (pair: Pair) => void {
    const dispatch = useAppDispatch()

    return useCallback(
        (pair: Pair) => {
            dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
        },
        [dispatch],
    )
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toLiquidityToken([tokenA, tokenB]: [ERC20Token, ERC20Token]): ERC20Token {
    return new ERC20Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'SVCD-LP', 'SvcDex LPs')
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [ERC20Token, ERC20Token][] {
    const { chainId } = useActiveChainId()
    const tokens = useOfficialsAndUserAddedTokens()

    // pinned pairs
    const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

    // pairs for every token against every base
    const generatedPairs: [ERC20Token, ERC20Token][] = useMemo(
        () =>
            chainId
                ? flatMap(Object.keys(tokens), (tokenAddress) => {
                    const token = tokens[tokenAddress]
                    // for each token on the current chain,
                    return (
                        // loop through all bases on the current chain
                        (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                            // to construct pairs of the given token with each base
                            .map((base) => {
                                const baseAddress = isAddress(base.address)

                                if (baseAddress && baseAddress === tokenAddress) {
                                    return null
                                }
                                return [base, token]
                            })
                            .filter((p): p is [ERC20Token, ERC20Token] => p !== null)
                    )
                })
                : [],
        [tokens, chainId],
    )

    // pairs saved by users
    const savedSerializedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)

    const userPairs: [ERC20Token, ERC20Token][] = useMemo(() => {
        if (!chainId || !savedSerializedPairs) return []
        const forChain = savedSerializedPairs[chainId]
        if (!forChain) return []

        return Object.keys(forChain).map((pairId) => {
            return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
        })
    }, [savedSerializedPairs, chainId])

    const combinedList = useMemo(
        () => userPairs.concat(generatedPairs).concat(pinnedPairs),
        [generatedPairs, pinnedPairs, userPairs],
    )

    return useMemo(() => {
        // dedupes pairs of tokens in the combined list
        const keyed = combinedList.reduce<{ [key: string]: [ERC20Token, ERC20Token] }>((memo, [tokenA, tokenB]) => {
            const sorted = tokenA.sortsBefore(tokenB)
            const key = sorted
                ? `${isAddress(tokenA.address)}:${isAddress(tokenB.address)}`
                : `${isAddress(tokenB.address)}:${isAddress(tokenA.address)}`
            if (memo[key]) return memo
            memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
            return memo
        }, {})

        return Object.keys(keyed).map((key) => keyed[key])
    }, [combinedList])
}

export const useWatchlistTokens = (): [string[], (address: string) => void] => {
    const dispatch = useAppDispatch()
    const savedTokens = useSelector((state: AppState) => state.user.watchlistTokens) ?? []
    const updatedSavedTokens = useCallback(
        (address: string) => {
            dispatch(addWatchlistToken({ address }))
        },
        [dispatch],
    )
    return [savedTokens, updatedSavedTokens]
}


export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
    const dispatch = useAppDispatch()
    const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>((state) => {
        return state.user.userSlippageTolerance
    })

    const setUserSlippageTolerance = useCallback(
        (slippage: number) => {
            dispatch(updateUserSlippageTolerance({ userSlippageTolerance: slippage }))
        },
        [dispatch],
    )

    return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
    const dispatch = useAppDispatch()

    const singleHopOnly = useSelector<AppState, AppState['user']['userSingleHopOnly']>(
        (state) => state.user.userSingleHopOnly,
    )

    const setSingleHopOnly = useCallback(
        (newSingleHopOnly: boolean) => {
            dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
        },
        [dispatch],
    )

    return [singleHopOnly, setSingleHopOnly]
}

