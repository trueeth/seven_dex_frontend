<<<<<<< HEAD
import React from 'react'
=======
import React, { useContext, useMemo } from 'react'
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useTranslation } from 'src/context/Localization'
import { makeStyles } from '@mui/styles'
import { TokenImage } from 'src/config'
<<<<<<< HEAD
=======
import { DataContext } from 'src/context/DataContext'

>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

const useStyles = makeStyles((theme) => ({
    pricePanel: {
        marginTop: '100px',
        width: '60%',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '30px',
        [theme.breakpoints.down('sm')]: {
            width: '95%',
        }
    }
}))

<<<<<<< HEAD
const TokenPrice: Record<string, number> = {
    'svc': 0.01,
    'matic': 1.49,
    'weth': 1693,
    'wbtc': 24432.94
}
=======
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

function PricePanel() {

    const classes = useStyles()
    const { t } = useTranslation()
<<<<<<< HEAD
=======
    const { tokenPrices } = useContext(DataContext)

    const TokenPrice: Record<string, number> = useMemo(() => (
        {
            'svc': tokenPrices?.SVC ?? 0.01,
            'matic': tokenPrices?.MATIC ?? 1.49,
            'weth': tokenPrices?.WETH ?? 1853,
            'wbtc': tokenPrices?.WBTC ?? 28032.94,
            'b2z': tokenPrices?.B2Z ?? 0.2
        }
    ), [tokenPrices])
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

    return (
        <div className={classes.pricePanel}>
            <Typography mb={2} textAlign='center'>{t('Token Prices')}</Typography>
<<<<<<< HEAD
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
                {Object.keys(TokenPrice).map((item, index) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }} key={index}>
                        <img src={TokenImage[item]} style={{ width: '40px', height: '40px' }} />
                        <Box sx={{ mx: 2 }}>
=======
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                {Object.keys(TokenPrice).map((item, index) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }} key={index}>
                        <img src={TokenImage[item]} style={{ width: '40px', height: '40px' }} />
                        <Box sx={{ mx: 2, minWidth: '100px', textAlign: 'center' }}>
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
                            <Typography>{item.toLocaleUpperCase()}</Typography>
                            <Typography sx={{ fontSize: '24px', minWidth: '100px' }}>{TokenPrice[item]}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </div>
    )
}

export default PricePanel