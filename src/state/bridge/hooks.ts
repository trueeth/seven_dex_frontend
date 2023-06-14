import { useSelector } from 'react-redux'
import { AppState } from '..'

export function useBridgeState(): AppState['bridge'] {
    return useSelector<AppState, AppState['bridge']>((state) => state.bridge)
}
