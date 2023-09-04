import React from 'react'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from '@/context/Localization'
import { IconExternalLink } from '@tabler/icons'

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



function MenuList({ toggle }) {
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
                },
                '& .active': {
                    width: '80%',
                    borderRadius: '20px',
                    backgroundColor: '#e57a3b',
                    '& .MuiTypography-root': {
                        textAlign: 'center',
                        color: '#fff'
                    }
                },

            }}
                onClick={toggle}
            >
                <NavLink to='/home'>
                    <Typography >{t('Home')}</Typography>
                </NavLink>
                <NavLink to='/swap'>
                    <Typography>{t('Swap')}</Typography>
                </NavLink>
                <NavLink to='/liquidity'>
                    <Typography>{t('Liquidity')}</Typography>
                </NavLink>
                <NavLink to='/bridge'>
                    <Typography>{t('Bridge')}</Typography>
                </NavLink>
                <Link to={{ pathname: "//staking.seven-project.com/" }} target="_blank">
                    <Typography>{t('Stake')}</Typography>
                </Link>
                <NavLink to='/farm'>
                    <Typography>{t('Farm')}</Typography>
                </NavLink>
                <NavLink to='/docs'>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography>{t('Docs')}</Typography>
                        <IconExternalLink
                            color='#fff'
                            style={{ marginTop: '10px', marginLeft: '-10px' }}
                        />
                    </Box>
                </NavLink>
            </Box>
        </div >
    )
}

export default MenuList
