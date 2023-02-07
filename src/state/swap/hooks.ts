import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../index'

export function useSwapState(): AppState['swap'] {
    return useSelector<AppState, AppState['swap']>((state) => state.swap)
}
