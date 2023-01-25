import { Modal, Box, Typography, Divider, TextField, Button, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import FurfiLogo from '../../../asset/images/furio-icon.svg'
import { DEFAULT_CHAIN_ID } from 'src/config/chains'
import { useAccount, useBalance, useSigner } from 'wagmi'
import addresses from 'src/config/address'
import useStake from 'src/hooks/useStake'
import { trim } from 'src/helper/trim'

const modalStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: '#0a172a',
    boxShadow: 24,
    borderRadius: '20px',
    '& .MuiTypography-root': {
        color: '#FFF'
    },
    '& .subText': {
        color: '#bbb'
    }
}

interface IProps {
    open: boolean;
    onClose: () => void;
}


function UnStakingModal(props: IProps) {

    const { open, onClose } = props

    const { address: account } = useAccount()
    const [amount, setAmount] = useState<number>(0)

    const { data: balance } = useBalance({
        addressOrName: account,
        token: addresses.furfi[DEFAULT_CHAIN_ID],
        watch: true
    })

    const { stakeAmount, unstake } = useStake()

    const onSetAmount = (e) => {
        if (e.target.value >= 0)
            setAmount(e.target.value)
    }

    const onUnStake = () => {
        if (amount > 0)
            unstake(amount)
    }

    return (

        <Modal
            open={open}
            sx={{
                "& > .MuiBackdrop-root": {
                    backdropFilter: "blur(10px)"
                }
            }}
        >
            <Box sx={{ ...modalStyle }}>
                <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ mt: 4, mb: 3, px: 4 }}>
                    <Typography sx={{ fontSize: '24px' }}>UnStaking</Typography>
                    <Box>
                        {/* <IconSettings
                            style={{
                                width: '32px',
                                height: '32px',
                                color: '#FFF',
                                marginRight: '15px',
                                cursor: 'pointer'
                            }}
                        /> */}
                        <CloseIcon
                            sx={{ width: '32px', height: '32px', color: '#FFF', cursor: 'pointer' }}
                            onClick={onClose}
                        />
                    </Box>
                </Box>
                <Divider sx={{ borderBottomColor: 'none' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 3, px: 4 }}>
                    <Box sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                        <Box ml={3} display='flex' alignItems='center'>
                            <img src={FurfiLogo} alt='furfi_logo' style={{ width: '32px', height: '32px' }} />
                            <Typography sx={{ fontSize: '20px', ml: 2 }}>Furfi</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                placeholder: 'e.g 1.83',
                                type: 'number',
                                inputProps: { min: 0 }
                            }}
                            sx={{ input: { color: '#FFF', fontSize: '20px', textAlign: 'right' } }}
                            onChange={onSetAmount}
                            value={amount}
                        />
                    </Box>
                </Box>
                <Divider sx={{ borderBottomColor: 'none' }} />
                <Box sx={{ px: 4, mt: 2, mb: 3 }}>
                    <Box sx={{ '& .MuiBox-root': { display: 'flex', justifyContent: 'space-between', mb: 2.5 } }}>
                        <Box>
                            <Typography>Staked Balance</Typography>
                            <Typography>{stakeAmount}</Typography>
                        </Box>
                        <Box>
                            <Typography>Furfi Balance In Wallet</Typography>
                            <Typography>{trim(balance?.formatted ?? 0, 3)}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Button
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexGrow: 1,
                            bgcolor: '#0f3152',
                            color: '#FFF',
                            borderBottomLeftRadius: '30px',
                            borderBottomRightRadius: '30px',
                            py: 3,
                            fontSize: '16px',
                            '&:hover': {
                                bgcolor: '#0f3152'
                            }
                        }}
                        onClick={onUnStake}
                    >
                        Unstake Furfi
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default UnStakingModal