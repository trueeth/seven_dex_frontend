
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ViewBase from './components/viewbase'
import Swap from './views/swap'
import { WagmiProvider, client } from './utils/wagmi'
import { Provider } from 'react-redux'
import store from './state'
import { RefreshContextProvider } from './context'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

import { SWRConfig } from 'swr'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import axios from 'axios'
import { LanguageProvider } from './context/Localization'



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
                        <LanguageProvider>
                            <RefreshContextProvider>
                                <ThemeProvider theme={theme}>
                                    <ViewBase>
                                        <Routes>
                                            <Route path={'/swap'} element={<Swap />} />
                                        </Routes>
                                    </ViewBase>
                                </ThemeProvider>
                            </RefreshContextProvider>
                        </LanguageProvider>
                    </Provider>
                </WagmiProvider>
            </SWRConfig>
        </BrowserRouter>
    )
}
