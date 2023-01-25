import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import FurfiLogo from '../../../asset/images/furio-icon.svg'
import StakingModal from './StakingModal'
import useStake from 'src/hooks/useStake'
import { trim } from 'src/helper/trim'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import UnStakingModal from './UnstakeModal'
import useSWR from 'swr'
import { DATABASE_URL } from 'src/config'

const useStyles = makeStyles((theme) => ({
    cardView: {
        minWidth: '320px',
        display: 'flex',
        height: '240px',
        margin: '20px',
        borderRadius: '30px',
        border: '1px solid #2e5387',
        background: 'linear-gradient(150deg,#102747 -87%,#102747)',
        '& .MuiTypography-root': {
            color: '#FFF'
        },
        [theme.breakpoints.down('sm')]: {
            minWidth: '95%',
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    }
}))

function StakingCard() {

    const classes = useStyles()

    const [open, setOpen] = useState(false)
    const [withdrawOpen, setWithdrawOpen] = useState(false)
    const { tvl, stakeAmount, claimRewards } = useStake()

    const { data } = useSWR(DATABASE_URL)

    const dollarTVL = tvl * (data?.furFiPrice ?? 0)
    const apr = data?.stakingPoolApr ?? 0

    const onClaim = () => {
        if (stakeAmount === 0)
            setOpen(true)
        else
            claimRewards()
    }

    return (
        <div className={classes.cardView}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                <Box sx={{ mt: 3, ml: 4 }}>
                    <Box ml={3} display='flex' alignItems='center'>\
                        <img src={FurfiLogo} alt='furfi_logo' style={{ width: '32px', height: '32px' }} />
                        <Typography sx={{ fontSize: '20px', ml: 2 }}>Staking Furfi</Typography>
                    </Box>
                </Box>
                {
                    stakeAmount === 0 ?
                        <Box>
                            <Box display='flex' justifyContent='space-around' mt={-2}>
                                <Box>
                                    <Typography my={1}>TVL:</Typography>
                                    <Typography fontSize={'24px'}>{trim(dollarTVL, 3)}$</Typography>
                                </Box>
                                <Box>
                                    <Typography my={1}>APR:</Typography>
                                    <Typography fontSize={'24px'}>{trim(apr, 3)}%</Typography>
                                </Box>
                            </Box>
                        </Box> :
                        <Box >
                            <Box display='flex' justifyContent='space-between'  >
                                <Box sx={{
                                    '& .MuiBox-root': { display: 'flex', justifyContent: 'space-between', px: 2, mb: 1 },
                                    flexGrow: 1,
                                    mt: 2
                                }}>
                                    <Box>
                                        <Typography>TVL:</Typography>
                                        <Typography >{trim(dollarTVL, 3)}$</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>Deposit:</Typography>
                                        <Typography >{trim(stakeAmount, 3)}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>APR:</Typography>
                                        <Typography >{trim(apr, 3)}%</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{
                                    mb: -1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '& .MuiButton-root': {
                                        flexGrow: 1,
                                        alignItems: 'center',
                                        bgcolor: '#0a172a9f',
                                        '&:hover': {
                                            bgcolor: '#0f3152'
                                        }
                                    }
                                }}>
                                    <Button onClick={() => setOpen(true)}>
                                        <AddIcon sx={{ color: '#FFF' }} />
                                    </Button>
                                    <Button onClick={() => setWithdrawOpen(true)}>
                                        <RemoveIcon sx={{ color: '#FFF' }} />
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                }
                <Box sx={{ display: 'flex' }}>
                    <Button
                        sx={{
                            flexGrow: 1,
                            bgcolor: '#0f3152',
                            color: '#FFF',
                            borderBottomLeftRadius: '30px',
                            borderBottomRightRadius: '30px',
                            py: 2,
                            '&:hover': {
                                bgcolor: '#0f3152'
                            }
                        }}
                        onClick={onClaim}
                    >
                        {stakeAmount !== 0 ? 'Claim Rewards' : 'Stake Furfi'}
                    </Button>
                </Box>
            </Box>
            <StakingModal open={open} onClose={() => setOpen(false)} />
            <UnStakingModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
        </div >
    )
}

export default StakingCard
