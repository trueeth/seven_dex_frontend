import { makeStyles } from '@mui/styles'
import { useLocation } from 'react-router-dom'
import Axelar from './Axelar'
import StargateWidget from './Stargate'
import SvcBridge from './svcbridge'

const useStyles = makeStyles(() => ({
    bridgeView: {
        width: '100vw'
    }
}))

function Bridge() {
    const classes = useStyles()
    const location = useLocation()

    return (
        <div className={classes.bridgeView}>
            {location.pathname === '/bridge/svc' && <SvcBridge />}
            {location.pathname === '/bridge/axelar' && <Axelar />}
            {location.pathname === '/bridge/stargate' && <StargateWidget />}
        </div>
    )
}

export default Bridge
