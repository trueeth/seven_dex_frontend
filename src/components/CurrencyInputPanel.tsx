import React, { useState } from 'react'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import TokenSelectModal from 'src/components/TokenSelectModal'

function CurrencyInputPanel({ currency, onCurrencySelect }) {


    const [open, setOpen] = useState(false)

    return (
        <div>
            <Box>
                <Box sx={{
                    display: 'flex',
                    '& .MuiButton-root': {
                        p: 1.5,
                        minWidth: { xs: '140px', md: '180px' },
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img src={currency?.logoURI} style={{ width: '24px', height: '24px' }} />
                            <Typography px={1}>{currency?.symbol}</Typography>
                        </Box>
                    </Button>
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

export default CurrencyInputPanel