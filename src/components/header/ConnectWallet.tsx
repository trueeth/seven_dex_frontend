import React, { useMemo } from 'react'
// import { makeStyles } from '@mui/styles';
import { Button, Box, useMediaQuery } from '@mui/material'
import { formart } from '../../utils/formatAddress'

import { useAccount } from 'wagmi'
import useAuth from '@/hooks/useAuth'
import { useTranslation } from '@/context/Localization'
<<<<<<< HEAD
import { ConnectButton as RainbowButton } from '@rainbow-me/rainbowkit'
=======
import { StyledMenu } from './Styled'
import { Link, useLocation } from 'react-router-dom'
import { ConnectKitButton } from 'connectkit'
>>>>>>> 28596e34ffb6aae55cabf51c68eec61d7cbd77bc

function ConnectButton() {
    const isXs = useMediaQuery('(max-width:400px)')

    const { isConnected, address } = useAccount()
    const { t } = useTranslation()

<<<<<<< HEAD
    return (
        <div>
            <RainbowButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted
                }) => {
                    // Note: If your app doesn't use authentication, you
                    // can remove all 'authenticationStatus' checks
                    const ready = mounted && authenticationStatus !== 'loading'
                    const connected =
                        ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

=======
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const isDrop = Boolean(anchorEl)

    const openDrop = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const closeDrop = () => {
        setAnchorEl(null)
    }

    const location = useLocation()

    const hidden = useMemo(() => {
        return location.pathname === '/bridge/axelar'
    }, [location])

    return (
        <Box display={hidden ? 'none' : 'block'}>
            <ConnectKitButton.Custom>
                {({ show }) => {
>>>>>>> 28596e34ffb6aae55cabf51c68eec61d7cbd77bc
                    return (
                        <Box
                            sx={{
                                mx: 2,
                                display: 'flex',
                                alignContent: 'center',
                                justifyContent: 'center'
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
                                        bgcolor: '#e57a3b'
                                    }
                                }}
                                onClick={(evt) => {
                                    if (!connected) openConnectModal()
                                    else if (chain?.unsupported) openChainModal()
                                    else openAccountModal()
                                }}
                            >
                                {(() => {
                                    if (connected) return formart(address as string)
                                    else if (chain?.unsupported) return t('Switch Network')
                                    else return isXs ? t('Connect') : t('Connect Wallet')
                                })()}
                            </Button>
                        </Box>
                    )
                }}
<<<<<<< HEAD
            </RainbowButton.Custom>
        </div>
=======
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
                        height: '20px'
                    }
                }}
            >
                <Link to={{ pathname: `//polygonscan.com/address/${address}` }} target="_blank">
                    <MenuItem>
                        <Typography color="#333">{t('View on Scan')}</Typography>
                    </MenuItem>
                </Link>
                <MenuItem onClick={logout}>{t('Disconnect Wallet')}</MenuItem>
            </StyledMenu>
        </Box>
>>>>>>> 28596e34ffb6aae55cabf51c68eec61d7cbd77bc
    )
}

export default ConnectButton
