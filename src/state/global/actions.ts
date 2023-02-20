import { createAction } from '@reduxjs/toolkit'
import { ChainId } from 'src/config/constants/chains';

// fired once when the app reloads but before the app renders
// allows any updates to be applied to store data loaded from localStorage
export const updateVersion = createAction<void>('global/updateVersion')

export const resetUserState = createAction<{ chainId: ChainId; newChainId?: ChainId }>('global/resetUserState')

export const toggleFarmTransactionModal = createAction<{
    showModal: boolean
}>('transactions/toggleFarmTransactionModal')

export const pickFarmTransactionTx = createAction<{
    tx: string
    chainId: ChainId
}>('transactions/pickFarmTransactionTx')

export const setSwapSlippage = createAction<{
    slippage: number
}>('global/setSwapSlippage')

export const setTxDeadline = createAction<{
    deadline: number
}>('global/setTxDeadline')

export const setTxSafeMode = createAction<{
    mode: boolean
}>('global/setTxSafeMode')
