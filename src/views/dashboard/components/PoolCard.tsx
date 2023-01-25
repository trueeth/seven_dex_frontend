import React, { useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Button, Typography } from '@mui/material'
import InvestModal from './InvestModal'
import { useAccount } from 'wagmi'
import { trim } from 'src/helper/trim'
import useSWR from 'swr'
import { DATABASE_URL } from 'src/config'

const useStyles = makeStyles((theme) => ({
    cardView: {
        minWidth: '320px',
        height: '240px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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

export interface IPoolCard {
    aTokenLogo: string;
    bTokenLogo: string;
    poolName: string;
    apy: number;
    tvl: number;
    lpRewardsApr: number;
    blockRewardsApr: number;
    lp: string;
}

interface IProps {
    poolInfo: IPoolCard
}

function PoolCard(props: IProps) {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [poolApy, setPoolApy] = useState({
        standardStrategy: 0,
        furfiStrategy: 0,
        stableStrategy: 0
    })

    const {
        aTokenLogo,
        bTokenLogo,
        poolName,
        apy,
        tvl,
        lp
    } = props.poolInfo
    const { isConnected } = useAccount()

    const { data } = useSWR(DATABASE_URL)

    const pairInfo = useMemo(() => data?.instances?.find(
        item => (item.poolName === lp.toLocaleUpperCase())
    ), [data])

    useEffect(() => {
        if (pairInfo)
            setPoolApy({
                ...poolApy,
                standardStrategy: pairInfo.standardStrategy.Apy ?? 0,
                furfiStrategy: pairInfo.furiofiStrategy.Apy ?? 0,
                stableStrategy: pairInfo.stableCoinStrategy.Apy ?? 0

            })
    }, [pairInfo])

    return (
        <div className={classes.cardView}>
            <Box display='flex' alignItems='center' sx={{ mt: 4, ml: 4 }}>
                <Box sx={{ position: 'relative' }}>
                    <img src={aTokenLogo} alt='tokenA' />
                    <img
                        src={bTokenLogo}
                        alt='tokenB'
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '20px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '9999px',
                            border: '1px solid yellow',
                            backgroundColor: '#000'
                        }}
                    />
                </Box>
                <Box ml={3}>
                    <Typography sx={{ fontSize: '20px' }}>{poolName}</Typography>
                </Box>
            </Box>
            <Box display='flex' justifyContent='space-around' mt={-4}>
                <Box>
                    <Typography my={1}>APY:</Typography>
                    <Typography fontSize={'24px'}>{trim(apy, 2)}%</Typography>
                </Box>
                <Box>
                    <Typography my={1}>TVL:</Typography>
                    <Typography fontSize={'24px'}>${trim(tvl, 3)}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex' }}>
                <Button
                    sx={{
                        flexGrow: 1,
                        bgcolor: '#0f3152',
                        color: '#FFF',
                        borderBottomLeftRadius: '30px',
                        py: 2
                    }}
                    onClick={() => {
                        if (isConnected)
                            setOpen(true)
                    }}
                >
                    Invest
                </Button>
                <Button sx={{
                    flexGrow: 1,
                    bgcolor: '#0a172a9f',
                    borderBottomRightRadius: '30px',
                    py: 2,
                    '&:hover': {
                        color: '#FFF'
                    }
                }}>
                    Details
                </Button>
            </Box>
            <InvestModal open={open} onClose={() => setOpen(false)} lp={lp} />
        </div>
    )
}

export default PoolCard
