import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'


const useStyles = makeStyles(() => ({
    pageView: {
        width: '100vw',
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

function Liquidity() {

    const classes = useStyles()

    return (
        <div className={classes.pageView}>
            <Box>
                <Typography sx={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#666'
                }}>
                    We're Coming Soon!
                </Typography>
            </Box>
        </div>
    )
}

export default Liquidity