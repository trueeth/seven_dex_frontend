import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import BridgeContainer from './BridgeContainer'

const useStyles = makeStyles(() => ({
    bridgeView: {
        width: '100vw',
        display: 'flex',
        justifyContent: 'center'
    }
}))

const SvcBridge = () => {
    const classes = useStyles()

    return (
        <div className={classes.bridgeView}>
            <BridgeContainer />
        </div>
    )
}

export default SvcBridge
