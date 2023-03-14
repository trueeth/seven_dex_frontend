
import { makeStyles } from '@mui/styles'
import Settings from 'src/components/Settings'
import { Box } from '@mui/system'
import Container from './components/Container'
import NoPosition from './components/UserPosition'
import { useMemo, useState } from 'react'
import useNativeCurrency from 'src/hooks/useNativeCurrency'
import TokenSelectView from './components/TokenSelectView'
import { SVC_TESTNET } from 'src/utils/token'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useCurrency } from 'src/hooks/Tokens'
import SupplyTokens from './components/SupplyTokens'


const useStyles = makeStyles((theme) => ({
    liquidityView: {
        width: '100vw',
        display: 'flex',
        justifyContent: 'center'
    }
}))

function AddLiquidity() {

    const classes = useStyles()
    const [userPosition, setUserPosition] = useState(null)
    const location = useLocation()

    const isUserLiquidity = useMemo(() => {
        return location.pathname === '/liquidity'
    }, [location])
    const [step, setStep] = useState(1)

    const native = useNativeCurrency()

    const [searchParams,] = useSearchParams()
    const currencyIdA = searchParams.get('currencyA') ?? native.symbol
    const currencyIdB = searchParams.get('currencyB') ?? SVC_TESTNET.address

    const currencyA = useCurrency(currencyIdA)
    const currencyB = useCurrency(currencyIdB)


    return (
        <div className={classes.liquidityView}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                height: 'fit-content'
            }}>
                <Settings />
                <Container>
                    {!userPosition && isUserLiquidity ?
                        <NoPosition /> :
                        <>
                            {
                                step === 1 ?
                                    <TokenSelectView
                                        currencyA={currencyA}
                                        currencyB={currencyB}
                                        onNext={() => setStep(2)}
                                    /> :
                                    < SupplyTokens
                                        currencyA={currencyA}
                                        currencyB={currencyB}
                                        onBack={() => setStep(1)}
                                    />
                            }
                        </>
                    }

                </Container>
            </Box>
        </div>
    )
}


export default AddLiquidity
