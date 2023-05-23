import { createReducer } from '@reduxjs/toolkit'

import { switchNetwork, typeInput, Field } from './actions'

export interface BridgeState {
    readonly typedValue: string
    readonly [Field.FROM]: {
        readonly networkName: string
    }
    readonly [Field.TO]: {
        readonly networkName: string
    }
}

const initialState: BridgeState = {
    typedValue: '0.0',
    [Field.FROM]: {
        networkName: 'ethereum'
    },
    [Field.TO]: {
        networkName: 'polygon'
    }
}

export default createReducer<BridgeState>(initialState, (builder) =>
    builder
        .addCase(switchNetwork, (state) => {
            return {
                ...state,
                [Field.FROM]: {
                    networkName: state[Field.TO].networkName
                },
                [Field.TO]: {
                    networkName: state[Field.FROM].networkName
                }
            }
        })
        .addCase(typeInput, (state, { payload: { typedValue } }) => {
            return {
                ...state,
                typedValue
            }
        })
)
