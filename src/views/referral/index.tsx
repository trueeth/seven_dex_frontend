import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Button, Divider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import QrCode from 'react-qr-code'
import { useAccount } from 'wagmi'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import useReferral from 'src/hooks/useReferral'
import { trim } from 'src/helper/trim'

const useStyles = makeStyles((theme) => ({
    referralView: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        justifyContent: "space-around",
        '& .MuiTypography-root': {
            color: '#FFF'
        },
        '& .MuiButton-root': {
            color: '#FFF',
            backgroundColor: '#0f3152',
            borderRadius: '10px',
            padding: '10px'
        },
        [theme.breakpoints.down('md')]: {
            width: '95%',
            flexDirection: 'column',
            alignItems: 'center'
        }
    },
    referralCard: {
        width: '600px',
        padding: '20px 30px',
        border: '1px solid #193855',
        background: '#0e1f2f',
        borderRadius: '20px',
        [theme.breakpoints.down('md')]: {
            width: '95%',
        }
    }
}))

function Referral() {
    const classes = useStyles()
    const { address, isConnected } = useAccount();

    const [qr, setQr] = useState('http://localhost:3000')
    const [referralLink, setReferralLink] = useState('http://localhost:3000')

    useEffect(() => {
        if (isConnected && address) {
            setQr(`http://localhost:3000?referrer=${address}`)
            setReferralLink(`http://localhost:3000?referrer=${address}`)
        }
    }, [isConnected])

    const { friends, totalEarning, pendingRewards, claim } = useReferral()

    return (
        <div className={classes.referralView}>
            <Box sx={{ mx: 3, mb: 3, width: { xs: '95%', md: 'fit-content' } }}>
                <Typography sx={{ fontSize: '32px' }}>Invite Your Friends.</Typography>
                <Typography sx={{ fontSize: '32px', mb: 2 }}>Earn Together</Typography>
                <Typography sx={{ fontSize: '20px' }}>Earn a 1% commission of the Furfi minted <br />for your friends</Typography>
            </Box>
            <Box className={classes.referralCard}>
                <Typography sx={{ fontSize: '24px', mb: 2 }}>My Referral Link</Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#0d1b2e9f',
                    p: 3,
                    border: '1px solid #2e5387',
                    borderRadius: '20px'
                }}>
                    <Typography sx={{ width: '90%', overflow: 'hidden' }}>{referralLink}</Typography>
                    <CopyToClipboard text={referralLink}>
                        <Button sx={{ ml: 3 }}>Copy</Button>
                    </CopyToClipboard>
                </Box>
                <Divider sx={{ my: 3, bgcolor: '#2e5387' }} />
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <Typography sx={{ mb: 2 }}>Referral QR Code</Typography>
                    <QrCode
                        value={qr}
                        bgColor='#FFF'
                        fgColor='#000'
                        size={150}
                    />
                </Box>
                <Divider sx={{ my: 3, bgcolor: '#2e5387' }} />
                <Box sx={(theme) => ({
                    display: 'flex',
                    justifyContent: 'space-around',
                    [theme.breakpoints.down('md')]: {
                        flexDirection: 'column'
                    },
                    '& .MuiBox-root': {
                        mx: 2,
                        mb: 1,
                        [theme.breakpoints.down('md')]: {
                            display: 'flex',
                            justifyContent: 'space-between'
                        }
                    }
                })}>
                    <Box>
                        <Typography>Active friends</Typography>
                        <Typography>{friends}</Typography>
                    </Box>
                    <Box>
                        <Typography>Total Earned</Typography>
                        <Typography>{trim(totalEarning, 3)} Furfi</Typography>
                    </Box>
                    <Box>
                        <Typography>Claimable</Typography>
                        <Typography>{trim(pendingRewards, 3)} Furfi </Typography>
                    </Box>
                    <Button sx={{ mt: { xs: 1, md: 0 } }} onClick={claim}>Claim</Button>
                </Box>
            </Box>
        </div >
    )
}

export default Referral
