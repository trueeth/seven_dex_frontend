import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useTranslation } from 'src/context/Localization'
import { makeStyles } from '@mui/styles'
import { TokenImage } from 'src/config'

const useStyles = makeStyles(() => ({
    pricePanel: {
        marginTop: '100px',
        width: '60%',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '30px'
    }
}))


function PricePanel() {

    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.pricePanel}>
            <Typography mb={2} textAlign='center'>{t('Token Prices')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={TokenImage['svc']} style={{ width: '40px', height: '40px' }} />
                    <Box sx={{ mx: 2 }}>
                        <Typography>SVC</Typography>
                        <Typography sx={{ fontSize: '24px' }}>0.01$</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={TokenImage['matic']} style={{ width: '40px', height: '40px' }} />
                    <Box sx={{ mx: 2 }}>
                        <Typography>MATIC</Typography>
                        <Typography sx={{ fontSize: '24px' }}>1.49$</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={TokenImage['weth']} style={{ width: '40px', height: '40px' }} />
                    <Box sx={{ mx: 2 }}>
                        <Typography>WETH</Typography>
                        <Typography sx={{ fontSize: '24px' }}>1693$</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={TokenImage['wbtc']} style={{ width: '40px', height: '40px' }} />
                    <Box sx={{ mx: 2 }}>
                        <Typography>WBTC</Typography>
                        <Typography sx={{ fontSize: '24px' }}>24432.94$</Typography>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default PricePanel