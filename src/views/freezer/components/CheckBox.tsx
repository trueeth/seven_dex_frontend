import React from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Typography, Button, Divider } from '@mui/material'
import useFreeze, { IFreezeInfo } from 'src/hooks/useFreeze';
import Slide from 'react-slick'
import { trim } from 'src/helper/trim';
import { formatTimestamp } from 'src/helper/formatSeconds';

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

const slideSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
}

function CheckBox({ setPage, apr }) {

    const classes = useStyles()
    const { freezing, claimRewards } = useFreeze()

    const onClaim = (round: number) => {
        claimRewards(round)
    }

    return (
        <div className={classes.cardView}>
            {
                freezing ?
                    <Slide {...slideSettings}>
                        {freezing.map((freezing, index) => (
                            <ClaimView
                                freezingInfo={freezing}
                                onClaim={() => { onClaim(index + 1) }}
                                key={index}
                                apr={apr}
                            />
                        ))}
                    </Slide> :
                    <Box sx={{ '& > .MuiBox-root': { p: '30px 20px' } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '20px' }}>Freezing</Typography>
                            <Typography sx={{ fontSize: '24px' }}>e.g 1.80</Typography>
                        </Box>
                        <Divider sx={{ bgcolor: '#2e5387' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography sx={{ mb: 4 }}>Time Passed</Typography>
                                <Typography>-</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ mb: 4 }}>Freezing For</Typography>
                                <Typography>-</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ bgcolor: '#2e5387' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>Claimed Rewards</Typography>
                            <Typography>-</Typography>
                        </Box>
                        <Divider sx={{ bgcolor: '#2e5387' }} />
                        <Box sx={{
                            '& .MuiBox-root': {
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1
                            }
                        }}>
                            <Box>
                                <Typography>Base APR</Typography>
                                <Typography>86.09%</Typography>
                            </Box>
                            <Box>
                                <Typography>Multiplier</Typography>
                                <Typography>1.1x</Typography>
                            </Box>
                            <Box>
                                <Typography>Freezer APR</Typography>
                                <Typography>94.9%</Typography>
                            </Box>
                        </Box>
                        <Button onClick={() => setPage('start')}>
                            Go Freeze
                        </Button>
                    </Box>
            }

        </div>
    )
}

interface IClaimView {
    freezingInfo: IFreezeInfo
    onClaim: () => void
    key: number
    apr: number
}

const PERIOD = [
    '1 Month',
    '3 Months',
    '6 Months'
]

const multipliers = [
    1.1, 1.4, 1.7
]

function ClaimView(props: IClaimView) {

    const { freezingInfo, onClaim, key: index, apr } = props
    const freezingAmt = freezingInfo.amount / Math.pow(10, 18)
    const claimedAmt = freezingInfo.claimedFurFiRewards / Math.pow(10, 18)
    const periodIndex = freezingInfo.periodIndex.toString()
    const startTime = freezingInfo.freezingStartTime.toString()
    const furfiRewards = trim(freezingInfo.pendingFurFiRewards / Math.pow(10, 18), 3)
    const bnbRewards = trim(freezingInfo.pendingBnbRewards / Math.pow(10, 18), 3)

    const multiplier = multipliers[Number(periodIndex)]


    return (
        <Box sx={{ '& > .MuiBox-root': { p: '30px 20px' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '20px' }}>Freezing</Typography>
                <Typography sx={{ fontSize: '24px' }}>{trim(freezingAmt, 3)}</Typography>
            </Box>
            <Divider sx={{ bgcolor: '#2e5387' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography sx={{ mb: 4 }}>Time Passed</Typography>
                    <Typography textAlign='center'>{formatTimestamp(Number(startTime))}</Typography>
                </Box>
                <Box>
                    <Typography sx={{ mb: 4 }}>Freezing For</Typography>
                    <Typography textAlign='center'>{PERIOD[periodIndex]}</Typography>
                </Box>
            </Box>
            <Divider sx={{ bgcolor: '#2e5387' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Claimed Rewards</Typography>
                <Typography>{trim(claimedAmt, 3)}</Typography>
            </Box>
            <Divider sx={{ bgcolor: '#2e5387' }} />
            <Box sx={{
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
            <Button onClick={onClaim}>
                Claim Rewards : {`${furfiRewards} FURFI, ${bnbRewards} BNB`}
            </Button>
        </Box>
    )
}

export default CheckBox;