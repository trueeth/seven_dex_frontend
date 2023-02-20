/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { ChainId } from 'src/config/constants/chains'
import { toggleFarmTransactionModal, pickFarmTransactionTx, setSwapSlippage, setTxDeadline, setTxSafeMode } from './actions'

export interface GlobalState {
    showFarmTransactionModal: boolean
    pickedFarmTransactionModalTx: {
        tx: string
        chainId: ChainId
    },
    swapSlippage: number,
    safeMode: boolean,
    txDeadline: number
}

export const initialState: GlobalState = {
    showFarmTransactionModal: false,
    pickedFarmTransactionModalTx: {
        tx: '',
        chainId: ChainId.MUMBAI,
    },
    swapSlippage: 0.5,
    safeMode: false,
    txDeadline: 1800
}

export default createReducer(initialState, (builder) =>
    builder
        .addCase(toggleFarmTransactionModal, (state, { payload: { showModal } }) => {
            state.showFarmTransactionModal = showModal
        })
        .addCase(pickFarmTransactionTx, (state, { payload: { tx, chainId } }) => {
            state.pickedFarmTransactionModalTx = { tx, chainId }
            state.showFarmTransactionModal = true
        })
        .addCase(setSwapSlippage, (state, { payload: { slippage } }) => {
            state.swapSlippage = slippage
        })
        .addCase(setTxDeadline, (state, { payload: { deadline } }) => {
            state.txDeadline = deadline
        })
        .addCase(setTxSafeMode, (state, { payload: { mode } }) => {
            state.safeMode = mode
        }),
)
