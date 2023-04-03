import { Box, Button, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { TradeType } from 'src/config/constants'
import { ONE_BIPS } from 'src/config/constants/exchange'
import { Field } from 'src/state/swap/actions'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'src/utils/exchange'
import { Currency } from 'src/utils/token'
import { Trade } from 'src/utils/trade'
import SwapRoute from './SwapRoute'
import { IconInfoCircle } from '@tabler/icons'
import { useTranslation } from 'src/context/Localization'

export default function SwapDetail({ trade, allowedSlippage }: { trade: Trade<Currency, Currency, TradeType>; allowedSlippage: number }) {

    const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
    const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
    const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
    const { t } = useTranslation()

    return (
        <Box sx={{
            mt: 4,
            '& > .MuiBox-root': {
                my: 0.5,
                display: 'flex',
                justifyContent: 'space-between',
                '& .MuiBox-root': {
                    display: 'flex',
                    width: 'fit-content',
                    alignItems: 'center',
                    '& .MuiButton-root': {
                        mx: -2
                    }
                },
                '& .MuiTypography-root:nth-child(2)': {
                    textAlign: 'right'
                }
            },
        }}>
            <Box>
                <Box>
                    <Typography> {isExactIn ? t('Minimum received') : t('Maximum sold')}</Typography>
                    <Tooltip title={t('Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.')} disableInteractive>
                        <Button sx={{ display: 'flex' }}>
                            <IconInfoCircle color='#666' />
                        </Button>
                    </Tooltip>
                </Box>
                <Typography>
                    {isExactIn
                        ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                        '-'
                        : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
                </Typography>
            </Box>
            <Box>
                <Box>
                    <Typography>{t('Price Impace')}</Typography>
                    <Tooltip title={t('The difference between the market price and estimated price due to trade size.')} disableInteractive>
                        <Button sx={{ display: 'flex' }}>
                            <IconInfoCircle color='#666' />
                        </Button>
                    </Tooltip>
                </Box>
                <Typography> {priceImpactWithoutFee ? (priceImpactWithoutFee.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpactWithoutFee.toFixed(2)}%`) : '-'}</Typography>
            </Box>
            <Box>
                <Box>
                    <Typography>{t('Liquidity Provider Fee')}</Typography>
                    <Tooltip title={t('For each trade a 0.25% fee is paid')} disableInteractive>
                        <Button sx={{ display: 'flex' }}>
                            <IconInfoCircle color='#666' />
                        </Button>
                    </Tooltip>
                </Box>
                <Typography>  {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}</Typography>
            </Box>
            <Box>
                <Box>
                    <Typography>{t('Route')}</Typography>
                    <Tooltip title={t('Routing through these tokens resulted in the best price for your trade.')} disableInteractive>
                        <Button sx={{ display: 'flex' }}>
                            <IconInfoCircle color='#666' />
                        </Button>
                    </Tooltip>
                </Box>
                <SwapRoute trade={trade} />
            </Box>
        </Box>
    )
}