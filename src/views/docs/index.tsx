import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
    docsView: {
        width: '100vw',
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

function Docs() {

    const classes = useStyles()

    return (
        <div className={classes.docsView}>
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

export default Docs