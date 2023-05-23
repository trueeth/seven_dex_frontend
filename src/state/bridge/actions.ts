import { createAction } from '@reduxjs/toolkit'

export enum Field {
    FROM = 'FROM',
    TO = 'TO'
}

export const switchNetwork = createAction<void>('bridge/switchNetwork')
export const typeInput = createAction<{ typedValue: string }>('bridge/typeInput')
