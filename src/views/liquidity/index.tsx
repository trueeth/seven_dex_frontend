import { makeStyles } from '@mui/styles'
import Settings from '@/components/Settings'
import { Box } from '@mui/system'
import Container from './components/Container'
import { UserPosition } from './components/UserPosition'
import { useMemo, useState } from 'react'
import useNativeCurrency from '@/hooks/useNativeCurrency'
import TokenSelectView from './components/TokenSelectView'
import { SVC_MAINNET } from '@/utils/token'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useCurrency } from '@/hooks/Tokens'
import SupplyTokens from './components/SupplyTokens'
import RemoveLiquity from './components/RemoveLiquidity'
import PoolList from './components/PoolList'

const useStyles = makeStyles((theme) => ({
    liquidityView: {
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
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

    const [searchParams] = useSearchParams()
    const currencyIdA = searchParams.get('currencyA') ?? native.symbol
    const currencyIdB = searchParams.get('currencyB') ?? SVC_MAINNET.address

    const currencyA = useCurrency(currencyIdA)
    const currencyB = useCurrency(currencyIdB)

    return (
        <div className={classes.liquidityView}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: { xs: '100%', sm: 'fit-content' }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: { xs: '95%', sm: '500px' } }}>
                    <Settings />
                </Box>
                <Container>
                    {positionView ? (
                        <>{removeView ? <RemoveLiquity /> : <UserPosition setStep={setStep} />}</>
                    ) : (
                        <>
                            {step === 'select_token' ? (
                                <TokenSelectView
                                    currencyA={currencyA}
                                    currencyB={currencyB}
                                    onNext={() => setStep('supply_assets')}
                                />
                            ) : (
                                <SupplyTokens
                                    currencyA={currencyA}
                                    currencyB={currencyB}
                                    onBack={() => setStep('select_token')}
                                />
                            )}
                        </>
                    )}
                </Container>
            </Box>
            <PoolList />
        </div>
    )
}

export default Liquidity
