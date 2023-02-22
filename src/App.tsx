
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ViewBase from './components/viewbase'
import Swap from './views/swap'
import { WagmiProvider, client } from './utils/wagmi'
import { Provider } from 'react-redux'
import store from './state'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

import { SWRConfig } from 'swr'
import { LanguageProvider } from './context/Localization'
import { fetchStatusMiddleware } from './hooks/useSWRContract'
import Docs from './views/docs'
import Farm from './views/farm'
import Liquidity from './views/liquidity'
import { Updaters } from './Updater'
import Bridge from './views/farm'
import { usePollBlockNumber } from './state/block/hooks'
import Home from './views/home'


function GlobalHooks() {
    usePollBlockNumber()
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
            <WagmiProvider client={client}>
                <Provider store={store}>
                    <ToastContainer autoClose={3000} limit={3} pauseOnFocusLoss={false} />
                    <LanguageProvider>

                        <SWRConfig
                            value={{
                                use: [fetchStatusMiddleware]
                            }}
                        >
                            <GlobalHooks />
                            <Updaters />
                            <ThemeProvider theme={theme}>
                                <ViewBase>
                                    <Routes>
                                        <Route path={'/'} element={<Home />} />
                                        <Route path={'/home'} element={<Home />} />
                                        <Route path={'/swap'} element={<Swap />} />
                                        <Route path={'/docs'} element={<Docs />} />
                                        <Route path={'/farm'} element={<Farm />} />
                                        <Route path={'/liquidity'} element={<Liquidity />} />
                                        <Route path={'/bridge'} element={<Bridge />} />
                                    </Routes>
                                </ViewBase>
                            </ThemeProvider>
                        </SWRConfig>
                    </LanguageProvider>
                </Provider>
            </WagmiProvider>
        </BrowserRouter>
    )
}
