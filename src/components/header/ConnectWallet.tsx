import React, { useCallback, useState, useEffect, useMemo } from 'react'
// import { makeStyles } from '@mui/styles';
import { Button, Box, Typography, Modal, useMediaQuery, MenuList, MenuItem } from '@mui/material'
import { IconX } from '@tabler/icons'
import { formart } from '@/utils/formatAddress'
import MetamaskIcon from '@/asset/images/metamask.svg'
import WalletConnectIcon from '@/asset/images/walletconnect.svg'
import CoinbaseWalletIcon from '@/asset/images/coinbasewallet.svg'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import useAuth from '@/hooks/useAuth'
import { ConnectorNames } from '@/config'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useTranslation } from '@/context/Localization'
import { StyledMenu } from './Styled'
import { Link } from 'react-router-dom'
import { DEFAULT_CHAIN_ID } from '@/config/constants/chains'
import useToast from '@/hooks/useToast'

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: '#FFF',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px'
}

const wallets = [
    {
        logo: MetamaskIcon,
        name: 'Metamask',
        id: ConnectorNames.MetaMask
    },
    {
        logo: WalletConnectIcon,
        name: 'Wallet Connect',
        id: ConnectorNames.WalletConnect
    },
    {
        logo: CoinbaseWalletIcon,
        name: 'Coinbase Wallet',
        id: ConnectorNames.WalletLink
    }
]

function ConnectButton() {
    const isXs = useMediaQuery('(max-width:400px)')
    const [open, setOpen] = useState(false)
    const onClose = () => {
        setOpen(false)
    }

    const [connecting, setConnect] = useState('Metamask')
    const { isConnected, address } = useAccount()
    const { login, loading, logout } = useAuth()
    const { chain } = useNetwork()
    const { t } = useTranslation()
    const { toastError } = useToast()

    const isWrongNetwork = useMemo(() => chain?.id !== DEFAULT_CHAIN_ID, [chain])
    const { switchNetwork } = useSwitchNetwork()

    useEffect(() => {
        if (isConnected) {
            setOpen(false)
        }
    }, [isConnected])

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
                        if (!isConnected) setOpen(true)
                        else if (isWrongNetwork) {
                            if (switchNetwork) switchNetwork(DEFAULT_CHAIN_ID)
                            else toastError(t('Switch Network in your wallet'))
                        } else openDrop(evt)
                    }}
                    aria-controls={isDrop ? 'customized-menu' : undefined}
                >
                    {(() => {
                        if (isConnected && !isWrongNetwork) return formart(address as string)
                        else if (isConnected) return t('Switch Network')
                        else return isXs ? t('Connect') : t('Connect Wallet')
                    })()}
                </Button>
            </Box>
            <Modal
                open={open}
                onClose={onClose}
                sx={{
                    '& > .MuiBackdrop-root': {
                        backdropFilter: 'blur(10px)'
                    }
                }}
            >
                <Box sx={{ ...modalStyle, width: { xs: '95%', md: '400px' } }}>
                    <Box
                        sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                        onClick={() => setOpen(false)}
                    >
                        <Typography>{t('Connect to a wallet')}</Typography>
                        <IconX />
                    </Box>
                    {wallets.map((wallet, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                width: '100%',
                                bgcolor: 'rgb(250,250,255)',
                                border: '1px solid rgb(235,236,255)',
                                padding: '20px',
                                borderRadius: '15px',
                                my: 2,
                                cursor: 'pointer'
                            }}
                            onClick={async () => {
                                setConnect(wallet.name)
                                await login(wallet.id)
                            }}
                        >
                            <img src={wallet.logo} alt="walletlogo" style={{ width: '32px', height: '32px' }} />
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Typography sx={{ lineHeight: '30px', px: 3 }}>{wallet.name}</Typography>
                                {loading && connecting === wallet.name && (
                                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                        <FiberManualRecordIcon color="info" sx={{ mr: 1 }} />
                                        {isXs ? '' : t('connecting')}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Modal>
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
