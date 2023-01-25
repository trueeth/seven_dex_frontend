import { Modal, Box, Typography, Divider, TextField, Button, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useMemo, useState } from 'react'
import FurfiLogo from '../../../asset/images/furio-icon.svg'
import ERC20 from 'src/config/erc20'
import { DEFAULT_CHAIN_ID } from 'src/config/chains'
import useApprove, { ApprovalState } from 'src/hooks/useApprove'
import { getDefaultProvider } from 'src/helper/provider'
import { useAccount, useBalance, useSigner } from 'wagmi'
import addresses from 'src/config/address'
import useStake from 'src/hooks/useStake'
import { trim } from 'src/helper/trim'
import useSWR from 'swr'
import { DATABASE_URL } from 'src/config'

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


function StakingModal(props: IProps) {

    const { open, onClose } = props

    const { data: signer } = useSigner()
    const { isConnected, address: account } = useAccount()
    const defaultProvider = getDefaultProvider()
    const [amount, setAmount] = useState<number>(0)

    const { stakeAmount, stake } = useStake()

    const { data: balance } = useBalance({
        addressOrName: account,
        token: addresses.furfi[DEFAULT_CHAIN_ID],
        watch: true
    })

    const onSetAmount = (e) => {
        if (e.target.value >= 0)
            setAmount(e.target.value)
    }

    const { data } = useSWR(DATABASE_URL)
    const furfiPrice = data?.furFiPrice ?? 0
    const apr = data?.stakingPoolApr ?? 0


    const furfiToken = useMemo(() => {
        return new ERC20(addresses.furfi[DEFAULT_CHAIN_ID], signer ?? defaultProvider, 'FURFI')
    }, [signer])

    const [approveStatus, approve] = useApprove(furfiToken, addresses.stakingPool[DEFAULT_CHAIN_ID])

    const onStake = () => {
        if (approveStatus !== ApprovalState.APPROVED)
            approve()
        else if (amount > 0)
            stake(amount)
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
                    <Typography sx={{ fontSize: '24px' }}>Staking</Typography>
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
                        {/* <Typography textAlign='right'>= ${120}</Typography> */}
                    </Box>
                </Box>
                <Divider sx={{ borderBottomColor: 'none' }} />
                <Box sx={{ px: 4, mt: 2, mb: 3 }}>
                    {/* <Typography sx={{ fontSize: '18px', mb: 2 }}>Details</Typography> */}
                    <Box sx={{ '& .MuiBox-root': { display: 'flex', justifyContent: 'space-between', mb: 2.5 } }}>
                        <Box>
                            <Typography>Staked Balance</Typography>
                            <Typography>{stakeAmount}</Typography>
                        </Box>
                        <Box>
                            <Typography>Furfi in Wallet</Typography>
                            <Typography>{trim(balance?.formatted ?? 0, 3)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography>Monthly Income</Typography>
                            <Typography>{trim(amount * furfiPrice * apr / 12, 3)}$</Typography>
                        </Box>
                        <Box>
                            <Typography>Yearly Income</Typography>
                            <Typography>{trim(amount * furfiPrice * apr, 3)}$</Typography>
                        </Box>
                        <Box>
                            <Typography>APR</Typography>
                            <Typography>{trim(apr, 3)}%</Typography>
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
                        onClick={onStake}
                    >
                        {
                            (isConnected &&
                                approveStatus === ApprovalState.UNKNOWN ||
                                approveStatus === ApprovalState.PENDING) &&
                            <CircularProgress size={20} sx={{ mx: 2 }} />
                        }
                        {approveStatus !== ApprovalState.APPROVED ? 'Approve Furfi' : 'Staking Furfi'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default StakingModal