
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ViewBase from './components/viewbase'
import Dashboard from './views/dashboard'
import Swap from './views/swap'
import Referral from './views/referral'
import Freezer from './views/freezer'
import { WagmiProvider, client } from './config/wagmi'
import { Provider } from 'react-redux'
import store from './state'
import Updaters from './state/Updaters'
import { RefreshContextProvider } from './context'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

import { SWRConfig } from 'swr'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import axios from 'axios'


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

    const fetcher = url => axios.get(url).then(res => res.data)

    return (
        <BrowserRouter>
            <SWRConfig
                value={{
                    refreshInterval: 10000,
                    fetcher
                }}
            >
                <WagmiProvider client={client}>
                    <Provider store={store}>
                        <ToastContainer autoClose={3000} limit={3} pauseOnFocusLoss={false} />
                        <Updaters />
                        <RefreshContextProvider>
                            <ThemeProvider theme={theme}>
                                <ViewBase>
                                    <Routes>
                                        <Route path={'/'} element={<Dashboard />} />
                                        <Route path={'/app'} element={<Dashboard />} />
                                        <Route path={'/freezer'} element={<Freezer />} />
                                        <Route path={'/swap'} element={<Swap />} />
                                        <Route path={'/referral'} element={<Referral />} />
                                    </Routes>
                                </ViewBase>
                            </ThemeProvider>
                        </RefreshContextProvider>
                    </Provider>
                </WagmiProvider>
            </SWRConfig>
        </BrowserRouter>
    )
}
