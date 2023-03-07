import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import user from './user/reducer'
import global from './global/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

const persistConfig = {
    key: 'primary',
    whitelist: PERSISTED_KEYS,
    blacklist: ['profile'],
    storage,
    version: 1,
}

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        transactions,
        swap,
        user,
        global,
        mint,
        multicall
    }),
)

let store: ReturnType<typeof makeStore>

export function makeStore(preloadedState = undefined) {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: true,
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
        devTools: process.env.NODE_ENV === 'development',
        preloadedState,
    })
}



export const initializeStore = (preloadedState = undefined) => {
    let _store = store ?? makeStore(preloadedState)

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = makeStore({
            ...store.getState(),
            ...preloadedState,
        })
        // Reset the current store
        store = undefined
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store

    // Create the store once in the client
    if (!store) {
        store = _store
    }

    return _store
}

store = initializeStore()

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store



export function useStore(initialState) {
    return useMemo(() => initializeStore(initialState), [initialState])
}

