
import { makeStyles } from '@mui/styles'
import Settings from 'src/components/Settings'
import { Box } from '@mui/system'
import Container from './components/Container'
import { useActiveChainId } from 'src/hooks/useActiveChainId'
import { useAccount } from 'wagmi'
import NoPosition from './components/UserPosition'
import { useState } from 'react'

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
                    {!userPosition && <NoPosition />}
                </Container>
            </Box>
        </div>
    )
}

export default AddLiquidity
