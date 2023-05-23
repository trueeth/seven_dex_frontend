import { Box, Button, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PolygonLogo from '@/asset/images/polygon.svg'
import EthereumLogo from '@/asset/images/ethereum.svg'
import { Divider } from '@mui/material'
import { IconArrowsUpDown } from '@tabler/icons'
import { styled } from '@mui/system'
import { StyledButton } from '@/components/styled_components/Button'
import { numberInputOnWheelPreventChange } from '@/utils'
import { useBridgeState } from '@/state/bridge/hooks'
import { Field } from '@/state/bridge/actions'
import { useBridgeActionHandlers } from '@/state/bridge/useBridgeAction'
import { useCurrencyBalance } from '@/state/wallet/hooks'
import { useAccount } from 'wagmi'
import { SVC_TESTNET } from '@/utils/token'
import { trim } from '@/utils/trim'

const useStyles = makeStyles((theme) => ({
    cardView: {
        maxWidth: '420px',
        padding: '32px',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: '20px',
        borderRadius: '32px',
        background: '#fff',
        '& .MuiTypography-root': {
            color: '#333'
        },
        [theme.breakpoints.down('sm')]: {
            width: '95%',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '20px 15px'
        }
    }
}))

const BridgeContainer = () => {
    const classes = useStyles()
    const { address: account } = useAccount()

    const {
        typedValue,
        [Field.FROM]: { networkName: fromNet },
        [Field.TO]: { networkName: toNet }
    } = useBridgeState()

    const { onSwitchNetwork, onUserInput } = useBridgeActionHandlers()

    const networks = {
        ethereum: {
            logo: EthereumLogo,
            name: 'Ethereum Mainnet'
        },
        polygon: {
            logo: PolygonLogo,
            name: 'Polygon Network'
        }
    }

    const svcBalance = useCurrencyBalance(account, SVC_TESTNET)

    return (
        <div className={classes.cardView}>
            <Typography sx={{ mb: 2, textAlign: 'center' }}> Transfer SVC between Networks</Typography>
            <NetworkCard>
                <img src={networks[fromNet].logo} alt="network-logo" />
                <Box>
                    <Typography sx={{ fontSize: '12px', color: '#666 !important' }}>From</Typography>
                    <Typography>{networks[fromNet].name}</Typography>
                </Box>
            </NetworkCard>
            <Box>
                <Divider sx={{ mt: 2, mb: 2 }}>
                    <Box
                        sx={{
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            bgcolor: 'rgb(251, 247, 238)',
                            borderRadius: '9999px',
                            cursor: 'pointer'
                        }}
                        onClick={onSwitchNetwork}
                    >
                        <IconArrowsUpDown color="#333" size={18} />
                    </Box>
                </Divider>
            </Box>
            <NetworkCard>
                <img src={networks[toNet].logo} alt="network-logo" />
                <Box>
                    <Typography sx={{ fontSize: '12px', color: '#666 !important' }}>To</Typography>
                    <Typography>{networks[toNet].name}</Typography>
                </Box>
            </NetworkCard>
            <OutlinedInput
                sx={{
                    mt: 4,
                    p: 1,
                    px: 2,
                    '& fieldset': {
                        borderRadius: '20px',
                        borderColor: '#ffae5a '
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#ffae5a !important'
                    },
                    '&:hover fieldset': {
                        borderColor: '#ffae5a !important'
                    }
                }}
                type="number"
                value={typedValue}
                placeholder={'0.0'}
                onChange={(e) => {
                    if (Number(e.target.value) <= Number(svcBalance?.toFixed() ?? 0)) onUserInput(e.target.value)
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography fontSize="12px">Balance : {trim(svcBalance?.toFixed() ?? 0, 3)}</Typography>
                            <Button
                                sx={{
                                    p: 1,
                                    fontSize: '12px',
                                    bgcolor: 'rgb(251, 247, 238)',
                                    color: '#e57a3b',
                                    borderRadius: '15px'
                                }}
                                onClick={() => {
                                    onUserInput(trim(svcBalance?.toFixed() ?? 0, 3))
                                }}
                            >
                                Max
                            </Button>
                        </Box>
                    </InputAdornment>
                }
                onWheel={numberInputOnWheelPreventChange}
                inputProps={{
                    min: 0,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                }}
            />
            <Box
                sx={{
                    mt: 2,
                    '& .MuiBox-root': {
                        display: 'flex',
                        justifyContent: 'space-between',
                        px: 2,
                        mt: 1
                    }
                }}
            >
                <Box>
                    <Typography>Gas on destination</Typography>
                    <Typography>-</Typography>
                </Box>
                <Box>
                    <Typography>You will receive</Typography>
                    <Typography>{typedValue || 0} SVC</Typography>
                </Box>
            </Box>
            <StyledButton sx={{ mt: 3 }}>Supply</StyledButton>
        </div>
    )
}

const NetworkCard = styled(Box)(() => ({
    padding: '10px',
    display: 'flex',
    gap: '20px',
    backgroundColor: 'rgb(251, 247, 238)',
    borderRadius: '20px',
    cursor: 'pointer'
}))

export default BridgeContainer
