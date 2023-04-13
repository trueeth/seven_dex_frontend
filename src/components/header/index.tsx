import React from 'react'
import { Typography, useMediaQuery, Avatar, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { IconMenu2, IconExternalLink } from '@tabler/icons'
import ConnectButton from './ConnectWallet'
import SelectNetwork from './SelectNetwork'

import LanguageSelector from './LanguageSelector'
import { useTranslation } from 'src/context/Localization'
import { Link } from 'react-router-dom'


interface IHeader {
    handleDrawerToggle?: () => void
}

const useStyles = makeStyles(theme => ({

    topBar: {
        backgroundColor: 'rgb(255, 231, 172)',
        width: '100%',
        '& .MuiTypography-root': {
            whiteSpace: 'nowrap',
            color: '#666',
            fontSize: '17px'
        }
    },
    topBarShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: 1000
        }),
        marginLeft: 0
    },
    toggleButton: {
        marginLeft: '15px'
    }
}))

function Header({ handleDrawerToggle }: IHeader) {
    const is960 = useMediaQuery('(max-width:1024px)')
    const isXs = useMediaQuery('(max-width:1024px)')
    const classes = useStyles()

    const { t } = useTranslation()

    return (
        <div className={classes.topBar}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'end', md: 'space-between' },
                    alignContent: 'center',
                    p: 2
                }}
            >
                {!isXs &&
                    <Box sx={{
                        display: 'flex',
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
                        <Link to='/docs'>
                            <Box sx={{ display: 'flex' }}>
                                <Typography>{t('Docs')}</Typography>
                                <IconExternalLink
                                    color='#888'
                                    style={{ marginLeft: '-14px', marginTop: '-3px' }}
                                />
                            </Box>
                        </Link>
                    </Box>
                }
                <Box display='flex' alignItems='center'>

                </Box>
                <Box display='flex' alignItems='center'>
                    <LanguageSelector />
                    {/* <SelectNetwork /> */}
                    <ConnectButton />
                    {
                        is960 && (
                            <div onClick={handleDrawerToggle} className={classes.toggleButton}>
                                <Avatar
                                    sx={{
                                        bgcolor: '#e77b3b',
                                        boxShadow: '0px 1px 4px #ccc',
                                        mt: '3px'
                                    }}
                                >
                                    <IconMenu2 color='#FFF' />
                                </Avatar>
                            </div>
                        )
                    }
                </Box>
            </Box>
        </div >
    )
}

export default Header
