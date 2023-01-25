import React, { useEffect, useMemo, useState } from 'react'

import { Box, Button, Divider, MenuItem, Modal, Select, TextField, ToggleButton, ToggleButtonGroup, Typography, CircularProgress } from '@mui/material'
// import { IconSettings } from '@tabler/icons'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import useApprove, { ApprovalState } from 'src/hooks/useApprove'
import addresses from 'src/config/address'
import { DEFAULT_CHAIN_ID } from 'src/config/chains'
import { isAddress } from '@ethersproject/address'
import ERC20 from 'src/config/erc20'
import { getDefaultProvider } from 'src/helper/provider'
import { useAccount, useSigner } from 'wagmi'
import { useInvestEth, useInvestToken } from 'src/hooks/useInvest'
import { Strategy } from 'src/hooks/useContract'
import { useReferrer } from 'src/state/application/hooks'
import { tokens } from 'src/config/token'
import useSWR from 'swr'
import { DATABASE_URL } from 'src/config'
import { trim } from 'src/helper/trim'


interface IProps {
    open: boolean;
    onClose: () => void;
    lp: string;
}

const modalStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
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



const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-around',
    '& .MuiToggleButtonGroup-grouped': {
        margin: '5px',
        flexGrow: 1,
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
        '&.Mui-selected:hover': {
            backgroundColor: '#0f3152',
            border: '1px solid #2e5387',
            color: '#FFF'
        },
        ['media']: {
            padding: '10px'
        }

    }
}))

interface IToken {
    symbol: string
    instance: ERC20
}

function InvestModal(props: IProps) {

    const defaultProvider = getDefaultProvider()
    const { isConnected } = useAccount()
    const { data: signer } = useSigner()
    const { address: account } = useAccount()
    const { open, onClose, lp } = props
    const [strategy, setStrategy] = useState<Strategy>(Strategy.Stable)
    const [spender, setSpender] = useState<string>(addresses.stableStrategy[lp][DEFAULT_CHAIN_ID]);
    const { onInvestToken } = useInvestToken(strategy, lp)
    const { onInvestEth } = useInvestEth(strategy, lp)
    const referrer = useReferrer()
    const [apy, setApy] = useState({
        standardStrategy: 0,
        furfiStrategy: 0,
        stableStrategy: 0
    })

    const { data } = useSWR(DATABASE_URL)

    const pairInfo = useMemo(() => data?.instances?.find(
        item => (item.poolName === lp.toLocaleUpperCase())
    ), [data])

    useEffect(() => {
        if (pairInfo)
            setApy({
                ...apy,
                standardStrategy: pairInfo.standardStrategy.Apy ?? 0,
                furfiStrategy: pairInfo.furiofiStrategy.Apy ?? 0,
                stableStrategy: pairInfo.stableCoinStrategy.Apy ?? 0

            })
    }, [pairInfo])

    const bnbPrice = data?.bnbPrice ?? 0

    const [token, setToken] = useState<IToken>({
        symbol: 'BNB',
        instance: new ERC20(addresses.bnb[DEFAULT_CHAIN_ID], signer ?? defaultProvider, 'USDT')
    })
    const [amount, setAmount] = useState<string>('')
    const [approveStatus, approve] = useApprove(token.instance, spender);

    // approve button active
    const [isApproved, setApproved] = useState<boolean>(false)

    useEffect(() => {
        if (token.symbol === 'BNB') {
            setApproved(true)
            return
        }
        if (approveStatus === ApprovalState.APPROVED)
            setApproved(true)
        else setApproved(false)
    }, [approveStatus, token, strategy])

    useEffect(() => {
        if (strategy === Strategy.Stable)
            setSpender(addresses.stableStrategy[lp][DEFAULT_CHAIN_ID])
        else if (strategy === Strategy.Standard)
            setSpender(addresses.standardStrategy[lp][DEFAULT_CHAIN_ID])
        else if (strategy === Strategy.Furfi) {
            setSpender(addresses.furfiStrategy[lp][DEFAULT_CHAIN_ID])
        }
    }, [strategy])

    const onSetStrategy = (e: React.MouseEvent<HTMLElement>, newStrategy: Strategy) => {
        if (newStrategy !== null)
            setStrategy(newStrategy)
    }

    const onTokenChange = (e) => {
        const symbol = e.target.value
        const tokenAddress = addresses[String(symbol).toLocaleLowerCase()][DEFAULT_CHAIN_ID] ?? ''
        if (isAddress(tokenAddress))
            setToken({
                symbol,
                instance: new ERC20(tokenAddress, signer ?? defaultProvider, symbol)
            })
    }

    const onSetAmount = (e) => {
        if (e.target.value >= 0)
            setAmount(e.target.value)
    }

    const onInvest = () => {
        if (Number(amount) > 0 && account)
            if (token.symbol === 'BNB')
                onInvestEth(amount, referrer)
            else
                onInvestToken(token.instance, amount, referrer)
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
                    <Typography sx={{ fontSize: '24px' }}>Add Liquidity</Typography>
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
                <Divider sx={{ borderBottomColor: '#666' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 3, px: 4 }}>
                    <Box sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={token.symbol}
                            sx={{
                                width: '200px',
                                '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
                                '& svg': { fill: '#FFF' }
                            }}
                            onChange={onTokenChange}
                        >
                            {Object.keys(tokens).map((item, index) => (
                                <MenuItem key={index} value={tokens[item].symbol}>
                                    <img src={tokens[item].logo} alt='logo' style={{ width: '32px', height: '32px' }} />
                                    <Typography sx={{ px: 2 }}>
                                        {tokens[item].symbol}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
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
                <Divider sx={{ borderBottomColor: '#666' }} />
                <Box sx={{ px: 4, my: 2 }}>
                    <Typography sx={{ fontSize: '18px', mb: 2 }}>Estimated Returns</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Box>
                            <Typography>Monthly Income</Typography>
                            <Typography>{trim(Number(amount) * apy[strategy] * (token.symbol === 'BNB' ? bnbPrice : 1) / 1200, 3)}$</Typography>
                        </Box>
                        <Box>
                            <Typography>Yearly Income</Typography>
                            <Typography>{trim(Number(amount) * apy[strategy] * (token.symbol === 'BNB' ? bnbPrice : 1) / 100, 3)}$</Typography>
                        </Box>
                        <Box>
                            <Typography>APY</Typography>
                            <Typography>{trim(apy[strategy], 3)}%</Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider sx={{ borderBottomColor: '#666' }} />
                <Box sx={{ px: 4, my: 2 }}>
                    <Typography sx={{ fontSize: '18px', mb: 2 }}>Choose Strategy</Typography>
                    <StyledToggleButtonGroup
                        value={strategy}
                        exclusive
                        onChange={onSetStrategy}
                    >
                        <ToggleButton value={Strategy.Stable} >
                            Stable
                        </ToggleButton >
                        <ToggleButton value={Strategy.Standard}>
                            Standard
                        </ToggleButton >
                        <ToggleButton value={Strategy.Furfi}>
                            Furfi
                        </ToggleButton >
                    </StyledToggleButtonGroup>
                    <Typography className='subText' sx={{ mt: 2 }}>All of your rewards are automatically re-invested into the two currencies of the hive, thus creating a daily compound effect. </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}></Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', '& .MuiButton-root': { p: 3, border: '1px solid #0f3152' } }}>
                    <Button
                        sx={{
                            borderBottomLeftRadius: '20px',
                            color: '#FFF',
                            bgcolor: '#0f3152',
                            display: 'flex',
                            justifyContent: 'center',
                            '&:hover': {
                                bgcolor: '#0f3152'
                            }
                        }}
                        disabled={isApproved}
                        onClick={approve}
                    >
                        {
                            (isConnected &&
                                approveStatus === ApprovalState.UNKNOWN ||
                                approveStatus === ApprovalState.PENDING) &&
                            <CircularProgress size={20} sx={{ mx: 2 }} />
                        }
                        Approve Strategy
                    </Button>
                    <Button
                        sx={{
                            borderBottomRightRadius: '20px',
                            color: '#FFF'
                        }}
                        disabled={!isApproved}
                        onClick={onInvest}
                    >
                        Invest
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default InvestModal
