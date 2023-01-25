import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateBlockNumber } from './actions'
import { useNetwork, useProvider } from 'wagmi'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { getDefaultProvider } from 'src/helper/provider'


export default function Updater(): null {

    const { chain } = useNetwork();
    const dispatch = useDispatch();
    const windowVisible = useIsWindowVisible();
    const [state, setState] = useState<{
        chainId: number | undefined;
        blockNumber: number | null;
    }>({
        chainId: chain?.id,
        blockNumber: null,
    });

    const blockNumberCallback = useCallback(
        (blockNumber: number) => {
            setState((state) => {
                if (chain?.id === state.chainId) {
                    if (typeof state.blockNumber !== 'number') return { chainId: chain?.id, blockNumber };
                    return { chainId: chain?.id, blockNumber: Math.max(blockNumber, state.blockNumber) };
                }
                return state;
            });
        },
        [chain, setState],
    );

    // attach/detach listeners
    // @ts-ignore
    useEffect(() => {
        if (!chain || !windowVisible) return undefined;
        setState({ chainId: chain.id, blockNumber: null });

        // const provider = useProvider({ chainId: chain.id });
        const provider = getDefaultProvider()
        provider
            .getBlockNumber()
            .then(blockNumberCallback)
            .catch((error) => console.error(`Failed to get block number for chainId: ${chain?.id}`, error));

        provider.on('block', blockNumberCallback);
        return () => provider.removeListener('block', blockNumberCallback);
    }, [dispatch, chain, blockNumberCallback, windowVisible]);

    const debouncedState = useDebounce(state, 100);

    useEffect(() => {
        if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return;
        dispatch(
            updateBlockNumber({
                chainId: debouncedState.chainId,
                blockNumber: debouncedState.blockNumber,
            }),
        );
    }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId]);

    return null;
}
