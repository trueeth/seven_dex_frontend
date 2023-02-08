import React, { useCallback } from 'react'
import { makeStyles } from '@mui/styles'
import Settings from 'src/components/Settings'
import { Box } from '@mui/system'
import SwapContainer from './components/SwapContainer'
import { Field } from 'src/state/swap/actions'
import { useSwapState } from 'src/state/swap/hooks'
import { useCurrency } from 'src/hooks/Tokens'
import { Currency } from 'src/utils/token'
import { useSwapActionHandlers } from 'src/state/swap/useSwapActionHandlers'
import replaceBrowserHistory from 'src/utils/replaceBrowserHistory'
import currencyId from 'src/utils/currencyId'
import AddTokenToWallet from './components/AddTokenToWallet'

const useStyles = makeStyles(() => ({
    swapView: {
        width: '100vw',
        display: 'flex',
        justifyContent: 'center'
    }
}))

function Swap() {
    const classes = useStyles()
    const {
        [Field.INPUT]: { currencyId: inputCurrencyId },
        [Field.OUTPUT]: { currencyId: outputCurrencyId }
    } = useSwapState()

    const inputCurrency = useCurrency(inputCurrencyId)
    const outputCurrency = useCurrency(outputCurrencyId)


    const currencies: { [field in Field]?: Currency } = {
        [Field.INPUT]: inputCurrency ?? undefined,
        [Field.OUTPUT]: outputCurrency ?? undefined,
    }

    const { onCurrencySelection } = useSwapActionHandlers()

    const handleOutputSelect = useCallback(
        (newCurrencyOutput: Currency) => {
            onCurrencySelection(Field.OUTPUT, newCurrencyOutput)

            const newCurrencyOutputId = currencyId(newCurrencyOutput)
            if (newCurrencyOutputId === inputCurrencyId) {
                replaceBrowserHistory('inputCurrency', outputCurrencyId)
            }
            replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
        },

        [inputCurrencyId, outputCurrencyId, onCurrencySelection],
    )

    return (
        <div className={classes.swapView}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                height: 'fit-content'
            }}>
                <Settings />
                <SwapContainer />
                <AddTokenToWallet />
            </Box>
        </div>
    )
}

export default Swap
