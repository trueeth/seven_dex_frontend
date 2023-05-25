import { Box, Button, InputAdornment, OutlinedInput, Typography, CircularProgress } from '@mui/material'
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
import { useBridgeContract } from '@/hooks/useContract'
import { useActiveChainId } from '@/hooks/useActiveChainId'
import { useAllTransactions, useTransactionAdder } from '@/state/transactions/hooks'
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback'
import { BridgeAddress } from '@/config/constants/bridge'
import { tryParseAmount } from '@/state/swap/hooks'
import { useTranslation } from '@/context/Localization'
import { useEffect, useState } from 'react'
import { GAS_PRICE_GWEI } from '@/state/types'
import { TransactionResponse } from '@ethersproject/providers'
import useToast from '@/hooks/useToast'

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
    const { chainId } = useActiveChainId()
    const allTransactions = useAllTransactions()
    const addTransaction = useTransactionAdder()
    const { toastError } = useToast()

    const {
        typedValue,
        [Field.FROM]: { networkName: fromNet },
        [Field.TO]: { networkName: toNet }
    } = useBridgeState()

    const { onSwitchNetwork, onUserInput } = useBridgeActionHandlers()
    const { t } = useTranslation()

    const networks = {
        ethereum: {
            logo: EthereumLogo,
            name: 'Ethereum Mainnet',
            chainId: 1
        },
        polygon: {
            logo: PolygonLogo,
            name: 'Polygon Network',
            chainId: 137
        }
    }

    const svcBalance = useCurrencyBalance(account, SVC_TESTNET)
    const parsedAmount = tryParseAmount(typedValue, SVC_TESTNET)
    const [approval, approveCallback] = useApproveCallback(parsedAmount, BridgeAddress[chainId])

    const [{ attemptingTxn, bridgeErrorMessage, txHash }, setBridgeState] = useState<{
        attemptingTxn: boolean
        bridgeErrorMessage: string | undefined
        txHash: string | undefined
    }>({
        attemptingTxn: false,
        bridgeErrorMessage: undefined,
        txHash: undefined
    })

    const bridgeContract = useBridgeContract()

    async function onSupply() {
        if (!chainId || !account || !bridgeContract) throw new Error('missing dependencies')
        if (!parsedAmount) {
            throw new Error('missing currency amounts')
        }
        let methodName: string
        let args: Array<string | string[] | number | boolean>
        if (approval === ApprovalState.APPROVED) {
            methodName = 'deposit'
            args = [account, SVC_TESTNET.address, parsedAmount.quotient.toString(), networks[toNet]?.chainId]
        }

        setBridgeState({ attemptingTxn: true, bridgeErrorMessage: undefined, txHash: undefined })
        await bridgeContract[methodName](...args, { gasPrice: GAS_PRICE_GWEI.fast })
            .then((response: TransactionResponse) => {
                setBridgeState({ attemptingTxn: true, bridgeErrorMessage: undefined, txHash: response.hash })
                addTransaction(response, {
                    summary: `Bridge ${typedValue} SVC`,
                    translatableSummary: {
                        text: 'Bridge SVC token between networks'
                    },
                    type: 'bridge-svc'
                })
            })
            .catch((err) => {
                toastError(t('User rejected transaction'))
                if (err && err.code !== 4001) {
                    console.error(`Bridge failed`, err, args)
                }
                setBridgeState({
                    attemptingTxn: false,
                    bridgeErrorMessage: err && err?.code !== 4001 ? t('Bridge failed') : undefined,
                    txHash: undefined
                })
            })
    }

    const enableBtnText =
        approval === ApprovalState.PENDING
            ? t('Approving')
            : approval === ApprovalState.APPROVED
            ? t('Approved')
            : t('Approve')
    const supplyBtnDisable =
        !chainId ||
        !account ||
        !bridgeContract ||
        parsedAmount?.toExact() === undefined ||
        attemptingTxn ||
        approval !== ApprovalState.APPROVED

    useEffect(() => {
        if (txHash) {
            const removeTx = allTransactions[chainId][txHash]
            if (removeTx.confirmedTime) {
                setBridgeState({ attemptingTxn: false, bridgeErrorMessage: undefined, txHash: undefined })
                onUserInput('0')
            }
        }
    }, [txHash, allTransactions])

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
                        // onClick={onSwitchNetwork}
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
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                {approval !== ApprovalState.APPROVED && parsedAmount !== undefined && (
                    <StyledButton disabled={approval === ApprovalState.PENDING} onClick={approveCallback}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                            {t(enableBtnText)}
                            {approval === ApprovalState.PENDING && <CircularProgress sx={{ color: 'white' }} />}
                        </Box>
                    </StyledButton>
                )}
                <StyledButton disabled={supplyBtnDisable} onClick={onSupply}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        {t('Supply')}
                        {attemptingTxn && <CircularProgress sx={{ color: 'white' }} />}
                    </Box>
                </StyledButton>
            </Box>
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
