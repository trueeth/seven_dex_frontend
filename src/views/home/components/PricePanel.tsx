import React, { useContext } from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useTranslation } from 'src/context/Localization'
import { makeStyles } from '@mui/styles'
import { TokenImage } from 'src/config'
import { DataContext } from 'src/context/DataContext'


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


function PricePanel() {

    const classes = useStyles()
    const { t } = useTranslation()
    const { tokenPrices } = useContext(DataContext)

    const TokenPrice: Record<string, number> = {
        'svc': tokenPrices?.SVC ?? 0.01,
        'matic': tokenPrices?.MATIC ?? 1.49,
        'weth': tokenPrices?.WETH ?? 1853,
        'wbtc': tokenPrices?.WBTC ?? 28032.94
    }


    return (
        <div className={classes.pricePanel}>
            <Typography mb={2} textAlign='center'>{t('Token Prices')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                {Object.keys(TokenPrice).map((item, index) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }} key={index}>
                        <img src={TokenImage[item]} style={{ width: '40px', height: '40px' }} />
                        <Box sx={{ mx: 2, minWidth: '100px', textAlign: 'center' }}>
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