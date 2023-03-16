
import { makeStyles } from '@mui/styles'
import Settings from 'src/components/Settings'
import { Box } from '@mui/system'
import Container from './components/Container'
import { UserPosition } from './components/UserPosition'
import { useMemo, useState } from 'react'
import useNativeCurrency from 'src/hooks/useNativeCurrency'
import TokenSelectView from './components/TokenSelectView'
import { SVC_TESTNET } from 'src/utils/token'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useCurrency } from 'src/hooks/Tokens'
import SupplyTokens from './components/SupplyTokens'
import RemoveLiquity from './components/RemoveLiquidity'


const useStyles = makeStyles((theme) => ({
    liquidityView: {
        width: '100vw',
        display: 'flex',
        justifyContent: 'center'
    }
}))

function Liquidity() {

    const classes = useStyles()
    const location = useLocation()

    const positionView = useMemo(() => {
        return location.pathname === '/liquidity' || location.pathname.includes('remove')
    }, [location])
    const removeView = useMemo(() => {
        return location.pathname.includes('remove')
    }, [location])

    const [step, setStep] = useState('position')

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
                    {positionView ?
                        <>
                            {
                                removeView ?
                                    <RemoveLiquity /> :
                                    <UserPosition setStep={setStep} />
                            }
                        </> :
                        <>
                            {
                                step === 'select_token' ?
                                    <TokenSelectView
                                        currencyA={currencyA}
                                        currencyB={currencyB}
                                        onNext={() => setStep('supply_assets')}
                                    /> :
                                    < SupplyTokens
                                        currencyA={currencyA}
                                        currencyB={currencyB}
                                        onBack={() => setStep('select_token')}
                                    />
                            }
                        </>
                    }
                </Container>
            </Box>
        </div>
    )
}


export default Liquidity
