import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'
<<<<<<< HEAD
=======
import { useTranslation } from 'src/context/Localization'
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283


const useStyles = makeStyles(() => ({
    farmView: {
        width: '100vw',
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

function Bridge() {

    const classes = useStyles()
<<<<<<< HEAD
=======
    const { t } = useTranslation()
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

    return (
        <div className={classes.farmView}>
            <Box>
                <Typography sx={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#666'
                }}>
<<<<<<< HEAD
                    We're Coming Soon!
=======
                    {t('We are Coming Soon!')}
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
                </Typography>
            </Box>
        </div>
    )
}

export default Bridge