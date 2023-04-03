import React from 'react'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'
import { useTranslation } from 'src/context/Localization'

const useStyles = makeStyles(theme => ({
    menuList: {
        '& .MuiTypography-root': {
            color: '#333',
            fontSize: '20px',
            fontFamily: 'Square',
            fontWeight: 500,
            lineHeight: '55px'
        },
        '& .title': {
            fontSize: '28px',
            marginLeft: 20
        }
    }
}))



function MenuList() {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.menuList}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                '& .MuiTypography-root': {
                    px: 2
                }
            }}>
                <Link to='/home'>
                    <Typography >{t('Home')}</Typography>
                </Link>
                <Link to='/swap'>
                    <Typography>{t('Swap')}</Typography>
                </Link>
                <Link to='/liquidity'>
                    <Typography>{t('Liquidity')}</Typography>
                </Link>
                <Link to='/bridge'>
                    <Typography>{t('Bridge')}</Typography>
                </Link>
                <Link to={{ pathname: "//staking-svc-matic.ceewen.xyz/" }} target="_blank">
                    <Typography>{t('Stake')}</Typography>
                </Link>
                <Link to='/farm'>
                    <Typography>{t('Farm')}</Typography>
                </Link>
            </Box>
        </div >
    )
}

export default MenuList
