
import { makeStyles } from '@mui/styles'
import Settings from 'src/components/Settings'
import { Box } from '@mui/system'
import Container from './components/Container'
import { useActiveChainId } from 'src/hooks/useActiveChainId'
import { useAccount } from 'wagmi'
import NoPosition from './components/UserPosition'
import { useState } from 'react'
import useNativeCurrency from 'src/hooks/useNativeCurrency'
import TokenSelectView from './components/TokenSelectView'
import { SVC_TESTNET } from 'src/utils/token'
import { useSearchParams } from 'react-router-dom'
import { useCurrency } from 'src/hooks/Tokens'
import SupplyTokens from './components/SupplyTokens'

const useStyles = makeStyles(() => ({
    liquidityView: {
        width: '100vw',
        display: 'flex',
        justifyContent: 'center'
    }
}))

function AddLiquidity() {

    const classes = useStyles()
    const { chainId } = useActiveChainId()
    const { isConnected } = useAccount()
    const [userPosition, setUserPosition] = useState(null)

    const native = useNativeCurrency()

    const onNext = () => { }
    const onSupply = () => { }


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
                    {/* {!userPosition && <NoPosition />} */}
                    {/* <TokenSelectView
                        currencyA={currencyA}
                        currencyB={currencyB}
                        onNext={onNext}
                    /> */}
                    <SupplyTokens
                        currencyA={currencyA}
                        currencyB={currencyB}
                        onSupply={onSupply}
                    />
                </Container>
            </Box>
        </div>
    )
}


export default AddLiquidity
