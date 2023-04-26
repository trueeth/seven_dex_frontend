import React from 'react'
// import { makeStyles } from '@mui/styles';
import { Button, Box, Typography, useMediaQuery, MenuItem } from '@mui/material'
import { formart } from '../../utils/formatAddress'

import { useAccount } from 'wagmi'
import useAuth from '@/hooks/useAuth'
import { useTranslation } from '@/context/Localization'
import { StyledMenu } from './Styled'
import { Link } from 'react-router-dom'
import { ConnectKitButton } from 'connectkit'

function ConnectButton() {
    const isXs = useMediaQuery('(max-width:400px)')

    const { isConnected, address } = useAccount()
    const { logout } = useAuth()
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
        <div>
            <ConnectKitButton.Custom>
                {({ show }) => {
                    return (
                        <Box
                            sx={{
                                mx: 2,
                                display: 'flex',
                                alignContent: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                sx={{
                                    bgcolor: '#e57a3b',
                                    borderRadius: '10000px',
                                    textTransform: 'none',
                                    color: '#FFF',
                                    padding: '5px 10px 10px',
                                    fontSize: '18px',
                                    '&:hover': {
                                        bgcolor: '#e57a3b',
                                    },
                                }}
                                onClick={(evt) => {
                                    if (!isConnected) show()
                                    else openDrop(evt)
                                }}
                                aria-controls={isDrop ? 'customized-menu' : undefined}
                            >
                                {(() => {
                                    if (isConnected) return formart(address as string)
                                    else return isXs ? t('Connect') : t('Connect Wallet')
                                })()}
                            </Button>
                        </Box>
                    )
                }}
            </ConnectKitButton.Custom>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                open={isDrop}
                onClick={closeDrop}
                sx={{
                    '& img': {
                        pr: 1,
                        width: '24px',
                        height: '20px',
                    },
                }}
            >
                <Link to={{ pathname: `//mumbai.polygonscan.com/address/${address}` }} target="_blank">
                    <MenuItem>
                        <Typography color="#333">{t('View on Scan')}</Typography>
                    </MenuItem>
                </Link>
                <MenuItem onClick={logout}>{t('Disconnect Wallet')}</MenuItem>
            </StyledMenu>
        </div>
    )
}

export default ConnectButton
