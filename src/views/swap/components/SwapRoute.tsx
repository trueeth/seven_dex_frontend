import React, { Fragment, memo } from 'react'
import { Trade } from 'src/utils/trade'

import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { TradeType } from 'src/config/constants'
import { Box, Typography } from '@mui/material'
import { Currency } from 'src/utils/token'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

export default memo(function SwapRoute({ trade }: { trade: Trade<Currency, Currency, TradeType> }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {trade.route.path.map((token, i, path) => {
                const isLastItem: boolean = i === path.length - 1
                const currency = unwrappedToken(token)
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <Fragment key={i}>
                        <Box alignItems="end">
                            <Typography fontSize="14px" ml="0.125rem" mr="0.125rem">
                                {currency.symbol}
                            </Typography>
                        </Box>
                        {!isLastItem && <KeyboardArrowRightIcon width="12px" />}
                    </Fragment>
                )
            })}
        </Box>
    )
})
