import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ViewBase from './components/viewbase'
import { WagmiProvider } from './utils/wagmi'
import { Provider } from 'react-redux'
import store from './state'
import { SWRConfig } from 'swr'
import { LanguageProvider } from './context/Localization'
import { fetchStatusMiddleware } from './hooks/useSWRContract'
import { Updaters } from './Updater'
import { usePollBlockNumber } from './state/block/hooks'
import Home from '@/views/home'
import Bridge from '@/views/bridge'
import Docs from '@/views/docs'
import Farm from '@/views/farm'
import Liquidity from './views/liquidity'
import Swap from './views/swap'
import useEagerConnect from './hooks/useEagerConnect'
import { ToastListener, ToastsProvider } from './context/ToastsContext'
import { DataProvider } from './context/DataContext'
import { ConnectKitProvider } from 'connectkit'
import { Buffer } from 'buffer'

// eslint-disable-next-line @typescript-eslint/no-var-requires
window.Buffer = window.Buffer || Buffer

function GlobalHooks() {
    usePollBlockNumber()
    useEagerConnect()
    return null
}

export default function App() {
    const theme = createTheme({
        typography: {
            fontFamily: 'Square'
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none'
                    }
                }
            }
        }
    })

    return (
        <BrowserRouter>
            <WagmiProvider>
                <Provider store={store}>
                    <LanguageProvider>
                        <ConnectKitProvider
                            mode="light"
                            options={{
                                overlayBlur: 9
                            }}
                        >
                            <SWRConfig
                                value={{
                                    use: [fetchStatusMiddleware]
                                }}
                            >
                                <DataProvider>
                                    <ToastsProvider>
                                        <GlobalHooks />
                                        <Updaters />
                                        <ThemeProvider theme={theme}>
                                            <ViewBase>
                                                <Routes>
                                                    <Route path="/" element={<Home />} />
                                                    <Route path="/home" element={<Home />} />
                                                    <Route path="/swap" element={<Swap />} />
                                                    <Route path="/docs" element={<Docs />} />
                                                    <Route path="/farm" element={<Farm />} />
                                                    <Route path="/liquidity" element={<Liquidity />} />
                                                    <Route path="/add" element={<Liquidity />} />
                                                    <Route path="/remove" element={<Liquidity />} />
                                                    <Route path="/bridge" element={<Bridge />} />
                                                </Routes>
                                            </ViewBase>
                                            <ToastListener />
                                        </ThemeProvider>
                                    </ToastsProvider>
                                </DataProvider>
                            </SWRConfig>
                        </ConnectKitProvider>
                    </LanguageProvider>
                </Provider>
            </WagmiProvider>
        </BrowserRouter>
    )
}
