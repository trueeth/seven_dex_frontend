import React, { useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Typography, Button, Select, TextField, MenuItem, Slider } from '@mui/material'
import { trim } from 'src/helper/trim'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { DEFAULT_CHAIN_ID } from 'src/config/chains'
import { getDefaultProvider } from 'src/helper/provider'
import { isAddress } from '@ethersproject/address'
import ERC20 from 'src/config/erc20'
import addresses from 'src/config/address'
import { useAccount, useBalance, useSigner } from 'wagmi'
import { tokens } from 'src/config/tokens'
import { useInvest, useInvestEth, useInvestToken } from 'src/hooks/useInvest'
import { Strategy } from 'src/hooks/useContract'
import { useReferrer } from 'src/state/application/hooks'
import useApprove, { ApprovalState } from 'src/hooks/useApprove'
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

export interface IInvestInfo {
    strategy: string
    pair: string
    amount: number
    pendingRewards: number
    reinvested: number,
    loanable: number,
    loaned: number
}

interface IProps {
    detail: IInvestInfo
}

interface IToken {
    symbol: string,
    address: string,
    instance: ERC20
}

const strategies = {
    furfiStrategy: 'Furfi',
    stableStrategy: 'Stable',
    standardStrategy: 'Standard'
}

const enum ActionView {
    MAIN,
    CLAIM,
    ADD,
    REMOVE,
    LOAN
}

function ClaimCard(props: IProps) {

    const {
        strategy,
        pair,
        amount: depositAmount,
        pendingRewards,
        reinvested,
        loanable,
        loaned
    } = props.detail

    const [apy, setApy] = useState(0)

    const { data } = useSWR(DATABASE_URL)
    const lpPrice = data?.instances.find(
        item => item.poolName === pair.toLocaleUpperCase()
    ).lpPrice ?? 0


    useEffect(() => {
        const pairInfo = data?.instances?.find(
            item => (item.poolName === pair.toLocaleUpperCase())
        )
        if (strategy === 'furfiStrategy')
            setApy(pairInfo.furiofiStrategy.Apy ?? 0)
        else if (strategy === 'stableStrategy')
            setApy(pairInfo.stableCoinStrategy.Apy ?? 0)
        else if (strategy === 'standardStrategy')
            setApy(pairInfo.standardStrategy.Apy ?? 0)
    }, [data])


    const _strategy = (strategy === 'furfiStrategy') ?
        Strategy.Furfi : (strategy === 'stableStrategy') ? Strategy.Stable : Strategy.Standard

    const spender = (strategy === 'furfiStrategy') ?
        addresses.furfiStrategy[pair][DEFAULT_CHAIN_ID] : (strategy === 'stableStrategy') ?
            addresses.stableStrategy[pair][DEFAULT_CHAIN_ID] : addresses.standardStrategy[pair][DEFAULT_CHAIN_ID]

    const defaultProvider = getDefaultProvider()
    const classes = useStyles()
    const [actionView, setActionView] = useState<ActionView>(ActionView.MAIN)
    const { data: signer } = useSigner()
    const { address: account } = useAccount()
    const { loan, claimRewards, withdrawETH } = useInvest(strategy, pair)
    const { onInvestToken } = useInvestToken(_strategy, pair)
    const { onInvestEth } = useInvestEth(_strategy, pair)
    const referrer = useReferrer()


    const furfiToken = useMemo(() => {
        return new ERC20(addresses.furfi[DEFAULT_CHAIN_ID], signer ?? defaultProvider, 'FURFI')
    }, [signer])

    const [furfiApprove, approveFurfi] = useApprove(furfiToken, spender);

    const [token, setToken] = useState<IToken>({
        symbol: 'BNB',
        address: addresses.bnb[DEFAULT_CHAIN_ID],
        instance: new ERC20(addresses.bnb[DEFAULT_CHAIN_ID], signer ?? defaultProvider, 'BNB')
    })


    const [approveStatus, approve] = useApprove(token.instance, spender);
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

    const tokenA = pair.split('_')[0].toLocaleUpperCase()
    const tokenB = pair.split('_')[1].toLocaleUpperCase()


    const { data: nativeBalance } = useBalance({
        addressOrName: account,
        watch: true
    })

    const { data: tokenBalance } = useBalance({
        addressOrName: account,
        token: token.address,
        watch: true
    })

    const [amt, setAmount] = useState<string>('')
    const [amtWithdraw, setWithdrawAmt] = useState<number | Array<number>>(0)

    const onWithdrawChange = (event: Event, newValue: number | number[]) => {
        setWithdrawAmt(newValue)
    }

    const onTokenChange = (e) => {
        const symbol = e.target.value
        const tokenAddress = addresses[String(symbol).toLocaleLowerCase()][DEFAULT_CHAIN_ID] ?? ''
        if (isAddress(tokenAddress))
            setToken({
                ...token,
                symbol,
                address: tokenAddress,
                instance: new ERC20(tokenAddress, signer ?? defaultProvider, symbol)
            })
    }

    const onSetAmount = (e) => {
        if (e.target.value >= 0)
            setAmount(e.target.value)
    }

    const onInvest = () => {
        if (!isApproved) {
            approve()
            return;
        }
        if (Number(amt) > 0 && account)
            if (token.symbol === 'BNB')
                onInvestEth(amt, referrer)
            else
                onInvestToken(token.instance, amt, referrer)
    }

    const onWithdraw = () => {
        if ((loaned > 0) && furfiApprove !== ApprovalState.APPROVED)
            approveFurfi()
        else {
            if (token.symbol === 'BNB')
                withdrawETH(String(amtWithdraw))
        }
    }

    return (
        <div className={classes.cardView}>
            {
                actionView === ActionView.MAIN ?
                    <Box>
                        <Box display='flex' alignItems='center' sx={{ mt: 3, ml: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <img src={tokens[tokenA].logo} alt='tokenA' />
                                <img
                                    src={tokens[tokenB].logo}
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
                            <Box ml={3} display='flex' alignItems='end'>
                                <Typography sx={{ fontSize: '20px' }}>{pair.toLocaleUpperCase()}</Typography>
                                {/* <Typography sx={{ fontSize: '14px', ml: 2 }}>Strategy: {strategies[strategy]}</Typography> */}
                            </Box>
                        </Box>
                        <Box display='flex' justifyContent='space-between'  >
                            <Box sx={{
                                '& .MuiBox-root': { display: 'flex', justifyContent: 'space-between', px: 2, mb: 1.5 },
                                flexGrow: 1,
                                mt: 1.8
                            }}>
                                <Box>
                                    <Typography >Strategy:</Typography>
                                    <Typography >{strategies[strategy]}</Typography>
                                </Box>

                                <Box>
                                    <Typography >Deposit:</Typography>
                                    <Typography >{trim(depositAmount * lpPrice, 3)}$</Typography>
                                </Box>
                                {
                                    strategy !== 'stableStrategy' ?
                                        <Box>
                                            <Typography >Rewards:</Typography>
                                            <Typography >{trim(pendingRewards * lpPrice, 3)}$</Typography>
                                        </Box> :
                                        <Box>
                                            <Typography >Reinvested:</Typography>
                                            <Typography >{trim(reinvested * lpPrice, 3)}$</Typography>
                                        </Box>
                                }
                            </Box>
                            <Box sx={{
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
                                <Button onClick={() => setActionView(ActionView.ADD)}>
                                    <AddIcon sx={{ color: '#FFF' }} />
                                </Button>
                                <Button onClick={() => setActionView(ActionView.REMOVE)}>
                                    <RemoveIcon sx={{ color: '#FFF' }} />
                                </Button>
                            </Box>
                        </Box>
                        {
                            strategy !== 'stableStrategy' &&
                            <Box sx={{ display: 'flex' }}>
                                <Button
                                    sx={{
                                        flexGrow: 1,
                                        bgcolor: '#0f3152',
                                        color: '#FFF',
                                        borderBottomLeftRadius: '30px',
                                        borderBottomRightRadius: '30px',
                                        py: 2
                                    }}
                                    onClick={claimRewards}
                                >
                                    Claim Rewards
                                </Button>
                                {/* <Button
                                    sx={{
                                        flexGrow: 1,
                                        bgcolor: '#0a172a9f',
                                        borderBottomRightRadius: '30px',
                                        py: 2,
                                        '&:hover': {
                                            color: '#FFF'
                                        }
                                    }}
                                    onClick={loan}
                                >
                                    Loan
                                </Button> */}
                            </Box>
                        }
                    </Box> :
                    actionView === ActionView.ADD ?
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2, px: 4 }}>
                                <Box sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={token.symbol}
                                        sx={{
                                            width: '160px',
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
                                        value={trim(Number(amt), 3)}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{ display: 'flex', px: 6, mt: -4, alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => setAmount(trim(Number(token.symbol === 'BNB' ? nativeBalance?.formatted ?? 0 : tokenBalance?.formatted ?? 0), 3))}
                            >
                                <Typography mt={1} sx={{ color: '#FF0' }}>
                                    Balance: {trim(Number(token.symbol === 'BNB' ? nativeBalance?.formatted ?? 0 : tokenBalance?.formatted ?? 0), 3)}(Max)
                                </Typography>
                            </Box>
                            <Box sx={{
                                px: 2, mb: 1.5,
                                flexGrow: 1,
                                mt: 1,
                                '& .MuiBox-root': {
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    '& > .MuiTypography-root': {
                                        mb: 1
                                    }
                                }
                            }}>
                                <Box >
                                    <Typography >Deposit:</Typography>
                                    <Typography >{trim(depositAmount * lpPrice, 3)}$</Typography>
                                </Box>
                                {/* <Box>
                                    <Typography >APR:</Typography>
                                    <Typography >{13.4}%</Typography>
                                </Box> */}
                                <Box>
                                    <Typography >APY:</Typography>
                                    <Typography >{trim(apy, 3)}%</Typography>
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
                                    onClick={onInvest}
                                >
                                    {isApproved ? 'Invest' : 'Approve'}
                                </Button>
                                <Button
                                    sx={{
                                        flexGrow: 1,
                                        bgcolor: '#0a172a9f',
                                        borderBottomRightRadius: '30px',
                                        py: 2,
                                        '&:hover': {
                                            color: '#FFF'
                                        }
                                    }}
                                    onClick={() => setActionView(ActionView.MAIN)}
                                >
                                    Back
                                </Button>
                            </Box>
                        </Box> :
                        actionView === ActionView.REMOVE &&
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, px: 4 }}>
                                <Box sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={token.symbol}
                                        sx={{
                                            width: '160px',
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
                                {/* <Box mt={2}>
                                    <Typography>Loaned:</Typography>
                                    <Typography>{trim(loaned, 3)}</Typography>
                                </Box> */}
                            </Box>
                            <Box sx={{
                                display: 'flex', justifyContent: 'space-between', px: 2, mb: 2.5,
                                flexGrow: 1,
                                mt: 2,
                                '& .MuiBox-root': {
                                    '& > .MuiTypography-root': {
                                        mb: 1
                                    }
                                }
                            }}>
                                <Box>
                                    <Typography >Deposited:</Typography>
                                    <Typography >{trim(depositAmount * lpPrice, 3)}$</Typography>
                                </Box>
                                <Box width={250} px={2}>
                                    <Slider
                                        size="small"
                                        value={amtWithdraw}
                                        onChange={onWithdrawChange}
                                        aria-label="Small"
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={Number(trim(depositAmount, 3))}
                                    />
                                    <Typography>
                                        Amount: {trim(amtWithdraw as number * lpPrice, 3)}
                                    </Typography>
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
                                    onClick={onWithdraw}
                                >
                                    {(loaned > 0) && (furfiApprove !== ApprovalState.APPROVED) ? 'Approve Furfi' : 'Withdraw'}
                                </Button>
                                <Button
                                    sx={{
                                        flexGrow: 1,
                                        bgcolor: '#0a172a9f',
                                        borderBottomRightRadius: '30px',
                                        py: 2,
                                        '&:hover': {
                                            color: '#FFF'
                                        }
                                    }}
                                    onClick={() => setActionView(ActionView.MAIN)}
                                >
                                    Back
                                </Button>
                            </Box>
                        </Box>

            }

        </div>
    )
}

export function NoClaimCard() {

    const classes = useStyles()

    return (
        <div className={classes.cardView}>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 'auto' }}>
                <Button
                    sx={{
                        bgcolor: '#0f3152',
                        borderRadius: '20px',
                        boxShadow: 2,
                        p: 2
                    }}
                >
                    <Typography>Deposit assets in Farming Pools <br /> Earn rewards</Typography>
                </Button>
            </Box>
        </div>
    )
}


export default ClaimCard