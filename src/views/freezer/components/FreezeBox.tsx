import React, { useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Typography, Button, Divider, ToggleButtonGroup, ToggleButton, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useAccount, useBalance, useSigner } from 'wagmi'
import addresses from 'src/config/address'

import TokenLogo from '../../../asset/images/furio-icon.svg'
import { DEFAULT_CHAIN_ID } from 'src/config/chains';
import useFreeze from 'src/hooks/useFreeze';
import ERC20 from 'src/config/erc20';
import { getDefaultProvider } from 'src/helper/provider';
import useApprove, { ApprovalState } from 'src/hooks/useApprove';
import { trim } from 'src/helper/trim';

const useStyles = makeStyles((theme) => ({
    cardView: {
        width: '450px',
        border: '1px solid #193855',
        background: '#0e1f2f',
        borderRadius: '20px',
        '& .MuiTypography-root': {
            color: '#FFF'
        },
        '& .MuiButton-root': {
            width: '100%',
            color: '#FFF',
            backgroundColor: '#0f3152',
            fontSize: '20px',
            padding: '20px 0',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px'
        },
        [theme.breakpoints.down('md')]: {
            width: '95%'
        }
    },
    egText: {
        color: '#999'
    }
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-around',
    '& .MuiToggleButtonGroup-grouped': {
        margin: '5px',
        border: 0,
        textTransform: 'none',
        backgroundColor: '#0b2034',
        color: '#FFF',
        padding: '15px 30px',
        '&.Mui-disabled': {
            border: 0,
        },
        '&:not(:first-of-type)': {
            borderRadius: '10px',
        },
        '&:first-of-type': {
            borderRadius: '10px',
        },
        '&:hover': {
            backgroundColor: '#0f3152'
        },
        '&.Mui-selected': {
            backgroundColor: '#0f3152',
            border: '1px solid #2e5387',
            color: '#FFF'
        },
        ['media']: {
            padding: '10px'
        }

    },
}));

interface IFreeze {
    apr: number
}

function FreezeBox({ apr }: IFreeze) {

    const classes = useStyles()
    const [period, setPeriod] = useState(0)
    const [amount, setAmount] = useState<number>(0)
    const { freeze } = useFreeze()
    const { data: signer } = useSigner()
    const defaultProvider = getDefaultProvider()

    const multiplier = useMemo(() => {
        switch (period) {
            case 0: return 1.1
            case 1: return 1.4
            case 2: return 1.7
            default: return 1.1
        }
    }, [period])

    const furfiToken = useMemo(() => {
        return new ERC20(addresses.furfi[DEFAULT_CHAIN_ID], signer ?? defaultProvider, 'FURFI')
    }, [signer])

    const [approveStatus, approve] = useApprove(furfiToken, addresses.freeze[DEFAULT_CHAIN_ID]);

    const onSetPeriod = (e: any, prd: number) => {
        if (prd !== null)
            setPeriod(prd)
    }

    const { address: account } = useAccount()
    const { data } = useBalance({
        addressOrName: account,
        token: addresses.furfi[DEFAULT_CHAIN_ID],
        watch: true
    })

    const onFreeze = () => {
        if (approveStatus !== ApprovalState.APPROVED)
            approve()
        else if (amount > 0)
            freeze(String(amount), period)
    }

    const onSetAmount = (e) => {
        if (e.target.value >= 0)
            setAmount(e.target.value)
    }

    return (
        <div className={classes.cardView}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 4, py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={TokenLogo} alt='logo' style={{ width: '32px', height: '32px' }} />
                    <Typography sx={{ ml: 1 }}>Furfi</Typography>
                </Box>
                <Box>
                    <TextField
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            placeholder: 'e.g 1.83',
                            type: 'number',
                            inputProps: { min: 0 }
                        }}
                        value={amount}
                        onChange={onSetAmount}
                        sx={{ input: { color: '#FFF', fontSize: '20px', textAlign: 'right' } }}

                    />
                    <Typography textAlign='right' className='egText'>Balance: {trim(Number(data?.formatted ?? 0), 3)}</Typography>
                </Box>
            </Box>
            <Divider sx={{ bgcolor: '#2e5387' }} />
            <Box sx={{ px: 4, py: 3 }}>
                <Typography sx={{ mb: 4 }}>Length of tenure : Max 6 months</Typography>
                <StyledToggleButtonGroup
                    exclusive
                    value={period}
                    onChange={onSetPeriod}
                >
                    <ToggleButton value={0}>1 month</ToggleButton>
                    <ToggleButton value={1}>3 months</ToggleButton>
                    <ToggleButton value={2}>6 months</ToggleButton>
                </StyledToggleButtonGroup>
            </Box>
            <Divider sx={{ bgcolor: '#2e5387' }} />
            <Box sx={{
                px: 4,
                py: 3,
                '& .MuiBox-root': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1
                }
            }}>
                <Box>
                    <Typography>Base APR</Typography>
                    <Typography>{trim(apr, 3)}%</Typography>
                </Box>
                <Box>
                    <Typography>Multiplier</Typography>
                    <Typography>{multiplier}x</Typography>
                </Box>
                <Box>
                    <Typography>Freezer APR</Typography>
                    <Typography>{trim(apr * multiplier, 3)}%</Typography>
                </Box>
            </Box>
            <Button onClick={onFreeze}>
                {approveStatus !== ApprovalState.APPROVED ? 'Approve Assets' : 'Freeze Assets'}
            </Button>
        </div>
    )
}

export default FreezeBox;