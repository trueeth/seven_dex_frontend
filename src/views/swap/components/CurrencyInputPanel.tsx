import React from 'react'
import { Button, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useTranslation } from 'src/context/Localization'





function CurrencyInputPanel() {


    const { t } = useTranslation()

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
                    <Typography>{t('Swap')}</Typography>
                    <Typography fontSize={12}>Balance: 0</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <TextField
                        variant="standard"
                        autoComplete='off'
                        InputProps={{
                            disableUnderline: true,
                            placeholder: '0.0',
                            type: 'number',
                            inputProps: { min: 0, inputMode: 'numeric', pattern: '[0-9]*' },

                        }}
                        sx={{ input: { fontSize: '28px', fontWeight: 'bold' } }}
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
                        <Button >{t('Max')}</Button>
                        <Button
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            {t('Select token')}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default CurrencyInputPanel