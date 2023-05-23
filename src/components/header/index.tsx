import React from 'react'
import { Typography, useMediaQuery, Avatar, Box, MenuItem } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { IconMenu2, IconExternalLink } from '@tabler/icons'
import ConnectButton from './ConnectWallet'
import SelectNetwork from './SelectNetwork'

import LanguageSelector from './LanguageSelector'
import { useTranslation } from '@/context/Localization'
import { Link } from 'react-router-dom'
import { StyledMenu } from './Styled'

interface IHeader {
    handleDrawerToggle?: () => void
}

const useStyles = makeStyles((theme) => ({
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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const isDrop = Boolean(anchorEl)

    const openDrop = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const closeDrop = () => {
        setAnchorEl(null)
    }

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
                {!isXs && (
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            flexGrow: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            '& .MuiTypography-root': {
                                px: 2
                            }
                        }}
                    >
                        <Link to="/home">
                            <Typography>{t('Home')}</Typography>
                        </Link>
                        <Link to="/swap">
                            <Typography>{t('Swap')}</Typography>
                        </Link>
                        <Link to="/liquidity">
                            <Typography>{t('Liquidity')}</Typography>
                        </Link>
                        <Box
                            sx={{ cursor: 'pointer' }}
                            aria-controls={isDrop ? 'customized-menu' : undefined}
                            onClick={(evt) => {
                                openDrop(evt)
                            }}
                            onMouseOver={(evt) => {
                                openDrop(evt)
                            }}
                        >
                            <Typography>{t('Bridge')}</Typography>
                        </Box>
                        <Link to={{ pathname: '//staking-svc-matic.ceewen.xyz/' }} target="_blank">
                            <Typography>{t('Stake')}</Typography>
                        </Link>
                        <Link to="/farm">
                            <Typography>{t('Farm')}</Typography>
                        </Link>
                        <Link to="/docs">
                            <Box sx={{ display: 'flex' }}>
                                <Typography>{t('Docs')}</Typography>
                                <IconExternalLink color="#888" style={{ marginLeft: '-14px', marginTop: '-3px' }} />
                            </Box>
                        </Link>
                    </Box>
                )}
                <Box display="flex" alignItems="center"></Box>
                <Box display="flex" alignItems="center">
                    <LanguageSelector />
                    {/* <SelectNetwork /> */}
                    <ConnectButton />
                    {is960 && (
                        <div onClick={handleDrawerToggle} className={classes.toggleButton}>
                            <Avatar
                                sx={{
                                    bgcolor: '#e77b3b',
                                    boxShadow: '0px 1px 4px #ccc',
                                    mt: '3px'
                                }}
                            >
                                <IconMenu2 color="#FFF" />
                            </Avatar>
                        </div>
                    )}
                </Box>
            </Box>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                open={isDrop}
                onClick={closeDrop}
                MenuListProps={{ onMouseLeave: closeDrop }}
                sx={{
                    '& img': {
                        pr: 1,
                        width: '24px',
                        height: '20px'
                    },
                    '& a': {
                        color: '#333'
                    }
                }}
            >
                <Link to="/bridge/svc">
                    <MenuItem onClick={closeDrop}>SVC</MenuItem>
                </Link>
                <Link to="/bridge/axelar">
                    <MenuItem onClick={closeDrop}>Axelar</MenuItem>
                </Link>
                {/* <Link to="/bridge/stargate">
                    <MenuItem onClick={closeDrop}>Stargate</MenuItem>
                </Link> */}
            </StyledMenu>
        </div>
    )
}

export default Header
