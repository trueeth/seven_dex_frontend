import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'
import { useTranslation } from '@/context/Localization'


const useStyles = makeStyles(() => ({
    farmView: {
        width: '100vw',
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

function Farm() {

    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.farmView}>
            <Box>
                <Typography sx={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#666'
                }}>
                    {t('We are Coming Soon!')}
                </Typography>
            </Box>
        </div>
    )
}

export default Farm