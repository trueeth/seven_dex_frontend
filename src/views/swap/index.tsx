
import { makeStyles } from '@mui/styles'
import Settings from 'src/components/Settings'
import { Box } from '@mui/system'
import SwapContainer from './components/SwapContainer'
import AddTokenToWallet from './components/AddTokenToWallet'
import { useActiveChainId } from 'src/hooks/useActiveChainId'
import { useAccount } from 'wagmi'

const useStyles = makeStyles(() => ({
    swapView: {
        width: '100vw',
        display: 'flex',
        justifyContent: 'center'
    }
}))

function Swap() {

    const classes = useStyles()
    const { chainId } = useActiveChainId()
    const { isConnected } = useAccount()

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
                {
                    isConnected && chainId === 80001 &&
                    <AddTokenToWallet />
                }
            </Box>
        </div>
    )
}

export default Swap
