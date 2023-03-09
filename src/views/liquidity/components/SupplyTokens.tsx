import { Box, Button, Divider, TextField, Tooltip, Typography } from "@mui/material"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { Currency } from "src/utils/token"
import { StyledButton } from "./Styled"
import AddIcon from '@mui/icons-material/Add'
import { IconInfoCircle } from '@tabler/icons'
import { useAccount } from "wagmi"
import { useCurrencyBalance } from "src/state/wallet/hooks"

function SupplyTokens({
    currencyA,
    currencyB,
    onSupply
}: {
    currencyA: Currency,
    currencyB: Currency,
    onSupply: () => void
}) {


    const { address: account } = useAccount()
    const currencyABalance = useCurrencyBalance(account ?? undefined, currencyA ?? undefined)
    const currencyBBalance = useCurrencyBalance(account ?? undefined, currencyB ?? undefined)

    return (
        <Box sx={{ width: '100%' }}>
            <Box p={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <KeyboardBackspaceIcon />
                <Box ml={3}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography sx={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#444 !important'
                        }}>
                            Add Liquidity
                        </Typography>
                        <Tooltip
                            title='By adding liquidity you will earn 0.17% of all trades on this pair proportional to your share in the trading pair. 
                        Fees are added to the pair, accrue in real time and can be claimed by withdrawing your liquidity.'
                            disableInteractive
                        >
                            <Button sx={{ display: 'flex', ml: -1.5, mt: -1 }}>
                                <IconInfoCircle color='#666' />
                            </Button>
                        </Tooltip>
                    </Box>
                    <Typography mt={1}>
                        Receive LP tokens and earn 0.17% trading fees
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <Box
                //  supply amount fields
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    '& img': { width: '24px', height: '24px' }
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                borderRadius: '20px',
                                bgcolor: 'rgb(255, 231, 172,0.3)',
                                width: 'fit-content'
                            }}>
                                <img src={currencyA?.logoURI} alt='tokenA' />
                                <Typography >{currencyA?.symbol}</Typography>
                            </Box>
                            <Typography sx={{ mr: 2, color: '#666 !important' }}>Balance: {currencyABalance?.toSignificant(6) ?? 0}</Typography>
                        </Box>
                        <TextField
                            variant="standard"
                            autoComplete='off'
                            InputProps={{
                                disableUnderline: true,
                                placeholder: '0.0',
                                type: 'number',
                                inputProps: { min: 0, inputMode: 'numeric', pattern: '[0-9]*' },

                            }}
                            sx={{
                                width: '100%',
                                p: 2,
                                borderRadius: '20px',
                                bgcolor: 'rgb(255, 231, 172,0.3)',
                                input: { fontSize: '18px', fontWeight: 'bold', color: '#444', textAlign: 'right' }
                            }}
                        />
                    </Box>
                </Box>
                <AddIcon sx={{ mt: 2, mb: 0 }} />
                <Box sx={{ width: '100%' }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                borderRadius: '20px',
                                bgcolor: 'rgb(255, 231, 172,0.3)',
                                width: 'fit-content'
                            }}>
                                <img src={currencyB?.logoURI} alt='tokenA' />
                                <Typography >{currencyB?.symbol}</Typography>
                            </Box>
                            <Typography sx={{ mr: 2, color: '#666 !important' }}>Balance: {currencyBBalance?.toSignificant(6) ?? 0}</Typography>
                        </Box>
                        <TextField
                            variant="standard"
                            autoComplete='off'
                            InputProps={{
                                disableUnderline: true,
                                placeholder: '0.0',
                                type: 'number',
                                inputProps: { min: 0, inputMode: 'numeric', pattern: '[0-9]*' },

                            }}
                            sx={{
                                width: '100%',
                                p: 2,
                                borderRadius: '20px',
                                bgcolor: 'rgb(255, 231, 172,0.3)',
                                input: { fontSize: '18px', fontWeight: 'bold', color: '#444', textAlign: 'right' }
                            }}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    p: 2,
                    mt: 2,
                    width: '100%',
                    border: '1px solid #eee',
                    borderRadius: '32px'
                }}>
                    <Typography ml={2}>Prices and Shares</Typography>
                    <Box sx={{
                        p: 2,
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-around',
                        gap: 1.5,
                        width: '100%',
                        border: '1px solid #eee',
                        borderRadius: '32px',
                        '& .MuiBox-root': {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5,
                            '& .MuiTypography-root': {
                                fontSize: '14px !important'
                            }
                        },
                    }}>
                        <Box>
                            <Typography>0.021</Typography>
                            <Typography>{currencyA?.symbol} per {currencyB?.symbol}</Typography>
                        </Box>
                        <Box>
                            <Typography>52.32</Typography>
                            <Typography>{currencyB?.symbol} per {currencyA?.symbol}</Typography>
                        </Box>
                        <Box>
                            <Typography>0.32%</Typography>
                            <Typography>Share in Trading Pair</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider />
            <Box p={3}>
                <StyledButton onClick={onSupply}>Supply</StyledButton>
            </Box>
        </Box >
    )
}

export default SupplyTokens