import React, { useState } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useTranslation } from 'src/context/Localization'
import TokenSelectModal from 'src/components/TokenSelectModal'
import { useAccount } from 'wagmi'
import { useCurrencyBalance } from 'src/state/wallet/hooks'


function CurrencyOutputPanel({ currency, onCurrencySelect, onUserInput }) {


    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    const { address: account } = useAccount()
    const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

    return (
        <div>
            <Box>
                <Box sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    '& .MuiTypography-root': {
                        color: '#aeafc2'
                    }
                }}>
                    <Typography>{t('To')}</Typography>
                    <Typography fontSize={12}>Balance: {selectedCurrencyBalance?.toSignificant(6) ?? 0}</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <TextField
                        variant="standard"
                        autoComplete='off'
                        onChange={(e) => onUserInput(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                            placeholder: '0.0',
                            type: 'number',
                            inputProps: { min: 0, inputMode: 'numeric', pattern: '[0-9]*' },

                        }}
                        sx={{ input: { fontSize: '28px', fontWeight: 'bold', color: '#555' } }}
                    />
                    <Box sx={{
                        display: 'flex',
                        '& .MuiButton-root': {
                            ml: 1,
                            color: '#333',
                            borderRadius: '16px',
                            bgcolor: 'rgb(255, 231, 172)'
                        }
                    }}>
                        <Button
                            onClick={() => setOpen(true)}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ whiteSpace: 'nowrap', minWidth: '140px' }}
                        >
                            {/* {t('Select token')} */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <img src={currency?.logoURI} style={{ width: '24px', height: '24px' }} />
                                <Typography px={1}>{currency?.symbol}</Typography>
                            </Box>
                        </Button>
                    </Box>
                </Box>
            </Box>
            <TokenSelectModal
                open={open}
                onClose={() => setOpen(false)}
                onCurrencySelect={onCurrencySelect}
            />
        </div>
    )
}

export default CurrencyOutputPanel