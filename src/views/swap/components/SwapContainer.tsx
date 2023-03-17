import { useCallback, useMemo } from 'react'
import { makeStyles } from '@mui/styles'
import { useSwapState } from 'src/state/swap/hooks'
import { Field } from 'src/state/swap/actions'
import { useCurrency } from 'src/hooks/Tokens'
import { Currency } from 'src/utils/token'
import { useSwapActionHandlers } from 'src/state/swap/useSwapActionHandler'
import CurrencyInputPanel from './CurrencyInputPanel'
import CurrencyOutputPanel from './CurrencyOutputPanel'
import SubmitSwap from './SubmitSwap'
import SwitchIOCurrency from './SwitchIOCurrency'
import replaceBrowserHistory from 'src/utils/replaceBrowserHistory'
import currencyId from 'src/utils/currencyId'
import { Box } from '@mui/material'

const useStyles = makeStyles((theme) => ({
    cardView: {
        width: '500px',
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
            width: '95%',
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    }
}))

function SwapContainer() {

    const classes = useStyles()

    const {
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


    const { onCurrencySelection, onUserInput } = useSwapActionHandlers()

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


    const handleInputSelect = useCallback(
        (newCurrencyInput) => {
            //   setApprovalSubmitted(false) // reset 2 step UI for approvals
            onCurrencySelection(Field.INPUT, newCurrencyInput)

            const newCurrencyInputId = currencyId(newCurrencyInput)
            if (newCurrencyInputId === outputCurrencyId) {
                replaceBrowserHistory('outputCurrency', inputCurrencyId)
            }
            replaceBrowserHistory('inputCurrency', newCurrencyInputId)
        },
        [inputCurrencyId, outputCurrencyId, onCurrencySelection],
    )


    const handleOutputSelect = useCallback(
        (newCurrencyOutput) => {
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
        <div className={classes.cardView}>
            <CurrencyInputPanel
                currency={currencies[Field.INPUT]}
                onCurrencySelect={handleInputSelect}
                onUserInput={handleTypeInput}
            />
            <SwitchIOCurrency />
            <CurrencyOutputPanel
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                onUserInput={handleTypeOutput}
            />
            <Box mb={2} />
            <SubmitSwap />
        </div >
    )
}

export default SwapContainer