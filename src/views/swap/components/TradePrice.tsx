import React from 'react'
import { Price } from 'src/utils/price'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { Currency } from 'src/utils/token'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'src/context/Localization'

interface TradePriceProps {
    price?: Price<Currency, Currency>
    showInverted: boolean
    setShowInverted: (showInverted: boolean) => void,
    slippage: number
}

export default function TradePrice({ price, showInverted, setShowInverted, slippage }: TradePriceProps) {

    const { t } = useTranslation()

    const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

    const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
    const label = showInverted
        ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
        : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Typography>Price:</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {show ? (
                        <>
                            <Typography>{formattedPrice ?? '-'} {label}</Typography>
                            <Box onClick={() => setShowInverted(!showInverted)} ml={1}>
                                <AutorenewIcon width="10px" sx={{ cursor: 'pointer' }} />
                            </Box>
                        </>
                    ) : (
                        '-'
                    )}
                </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{t('Slippage Tolerance')}</Typography>
                <Typography> {slippage / 100}%</Typography>
            </Box>
        </>

    )
}
