import React from 'react'
import { Typography, useMediaQuery, Avatar, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { IconMenu2, IconExternalLink } from '@tabler/icons'
import ConnectButton from './ConnectWallet'
import SelectNetwork from './SelectNetwork'

import { NavLink } from 'react-router-dom'


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
    const is960 = useMediaQuery('(max-width:960px)')
    const isXs = useMediaQuery('(max-width:768px)')
    const classes = useStyles()

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
                        <NavLink to='/home'>
                            <Typography >Home</Typography>
                        </NavLink>
                        <NavLink to='/swap'>
                            <Typography>Swap</Typography>
                        </NavLink>
                        <NavLink to='/liquidity'>
                            <Typography>Liquidity</Typography>
                        </NavLink>
                        <NavLink to='/bridge'>
                            <Typography>Bridge</Typography>
                        </NavLink>
                        <NavLink to='/stake'>
                            <Typography>Stake</Typography>
                        </NavLink>
                        <NavLink to='/farm'>
                            <Typography>Farm</Typography>
                        </NavLink>
                        <NavLink to='/'>
                            <Box sx={{ display: 'flex' }}>
                                <Typography>Docs</Typography>
                                <IconExternalLink
                                    color='#888'
                                    style={{ marginLeft: '-14px', marginTop: '-3px' }}
                                />
                            </Box>
                        </NavLink>
                    </Box>
                }
                <Box display='flex' alignItems='center'>

                </Box>
                <Box display='flex' alignItems='center'>
                    <SelectNetwork />
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
