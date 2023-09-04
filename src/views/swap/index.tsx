import React from 'react'
import { makeStyles } from '@mui/styles'
import Settings from '@/components/Settings'
import { Box } from '@mui/system'
import SwapContainer from './components/SwapContainer'
import AddTokenToWallet from './components/AddTokenToWallet'

const useStyles = makeStyles(() => ({
    swapView: {
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
    },
}))

function Swap() {
    const classes = useStyles()

    return (
        <div className={classes.swapView}>
            {/* <Box sx={{ mt: 10 }}>
                <Typography>No currencies selected</Typography>
            </Box> */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    height: 'fit-content',
                }}
            >
                <Settings />
                <SwapContainer />
                <AddTokenToWallet />
            </Box>
        </div>
    )
}

export default Swap
