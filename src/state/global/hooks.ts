import { useSelector } from 'react-redux'
import { AppState } from '../index'

// Get Farm Harvest
export function useFarmHarvestTransaction() {
    const state = useSelector<AppState, AppState['global']>((s) => s.global)
    return {
        showModal: state.showFarmTransactionModal,
        pickedTx: state.pickedFarmTransactionModalTx,
    }
}

export function useSwapSetting() {
    const state = useSelector<AppState, AppState['global']>((s) => s.global)
    return {
        slippage: state.swapSlippage,
        deadline: state.txDeadline,
        safemode: state.safeMode
    }
}
