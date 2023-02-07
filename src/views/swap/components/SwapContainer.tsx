import React, { useCallback, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { Button, Divider } from '@mui/material'
import { IconArrowsUpDown } from '@tabler/icons'
import { useTranslation } from 'src/context/Localization'
import { useSwapState } from 'src/state/swap/hooks'
import { Field } from 'src/state/swap/actions'
import { useCurrency } from 'src/hooks/Tokens'
import { Currency } from 'src/utils/token'
import { useSwapActionHandlers } from 'src/state/swap/useSwapActionHandlers'
import useActiveWeb3React from 'src/hooks/useActiveWeb3React'
import { useAtomValue } from 'jotai'
import { combinedTokenMapFromOfficialsUrlsAtom } from 'src/state/lists/hooks'
import useRefreshBlockNumberID from 'src/hooks/useRefreshBlockNumber'
import CurrencyInputPanel from './CurrencyInputPanel'
import CurrencyOutputPanel from './CurrencyOutputPanel'
import SubmitSwap from './SubmitSwap'

const useStyles = makeStyles((theme) => ({
    cardView: {
        maxWidth: '500px',
        padding: '32px',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: '20px',
        borderRadius: '32px',
        background: '#fff',
        '& .MuiTypography-root': {
            color: '#333'
        },
        [theme.breakpoints.down('sm')]: {
            minWidth: '95%',
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    }
}))

function SwapContainer() {

    const classes = useStyles()

    const { t } = useTranslation()

    const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
    const { account, chainId } = useActiveWeb3React()
    const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)

    const {
        independentField,
        typedValue,
        recipient,
        [Field.INPUT]: { currencyId: inputCurrencyId },
        [Field.OUTPUT]: { currencyId: outputCurrencyId },
    } = useSwapState()

    const inputCurrency = useCurrency(inputCurrencyId)
    const outputCurrency = useCurrency(outputCurrencyId)

    const currencies: { [field in Field]?: Currency } = useMemo(
        () => ({
            [Field.INPUT]: inputCurrency ?? undefined,
            [Field.OUTPUT]: outputCurrency ?? undefined,
        }),
        [inputCurrency, outputCurrency],
    )

    const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(Field.INPUT, value)
        },
        [onUserInput],
    )
    const handleTypeOutput = useCallback(
        (value: string) => {
            onUserInput(Field.OUTPUT, value)
        },
        [onUserInput],
    )


    return (
        <div className={classes.cardView}>
            <CurrencyInputPanel />
            <Divider sx={{ mt: 4, mb: 2 }}>
                <Box sx={{
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    bgcolor: 'rgb(255, 231, 172)',
                    borderRadius: '9999px',
                    cursor: 'pointer'
                }}>
                    <IconArrowsUpDown color='#333' size={18} />
                </Box>
            </Divider>
            <CurrencyOutputPanel />
            <SubmitSwap />
        </div >
    )
}

export default SwapContainer