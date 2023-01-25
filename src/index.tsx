import React from 'react'
import ReactDOM from 'react-dom'
import { Theme } from '@mui/material/styles'

import App from './App'

import './index.css'

declare global {
    interface Window {
        aptos: any
    }
}

declare module '@mui/styles/defaultTheme' {
    interface DefaultTheme extends Theme { }
}
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
)

