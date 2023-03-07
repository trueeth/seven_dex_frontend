import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useTranslation } from 'src/context/Localization'
import { makeStyles } from '@mui/styles'
import { TokenImage } from 'src/config'

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

const TokenPrice: Record<string, number> = {
    'svc': 0.01,
    'matic': 1.49,
    'weth': 1693,
    'wbtc': 24432.94
}

function PricePanel() {

    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.pricePanel}>
            <Typography mb={2} textAlign='center'>{t('Token Prices')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
                {Object.keys(TokenPrice).map((item, index) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }} key={index}>
                        <img src={TokenImage[item]} style={{ width: '40px', height: '40px' }} />
                        <Box sx={{ mx: 2 }}>
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