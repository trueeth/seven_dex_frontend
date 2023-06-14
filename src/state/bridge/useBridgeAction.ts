import { useCallback } from 'react'
import { useAppDispatch } from '../index'
import { switchNetwork, typeInput } from './actions'

export function useBridgeActionHandlers(): {
    onSwitchNetwork: () => void
    onUserInput: (typedValue: string) => void
} {
    const dispatch = useAppDispatch()

    const onSwitchNetwork = useCallback(() => {
        dispatch(switchNetwork())
    }, [dispatch])

    const onUserInput = useCallback(
        (typedValue: string) => {
            dispatch(typeInput({ typedValue }))
        },
        [dispatch]
    )

    return {
        onUserInput,
        onSwitchNetwork
    }
}
