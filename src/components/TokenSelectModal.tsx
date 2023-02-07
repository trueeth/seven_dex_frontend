import React from 'react'

import { Box, Modal, Tabs, Tab, Typography, OutlinedInput, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'src/context/Localization';

const modalStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    bgcolor: 'rgb(255, 231, 172)',
    boxShadow: 24,
    borderRadius: '20px',
    '& .MuiTypography-root': {
        color: '#333'
    },
    '& .subText': {
        color: '#bbb'
    }
}


function TokenSelectModal({ open, onClose, onTokenSelect }) {

    const [value, setValue] = React.useState('one')

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    }

    const { t } = useTranslation()

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
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    sx={{ mt: 4, mb: 1, px: 4 }}
                >
                    <Typography sx={{ fontSize: '20px' }}>{t('Select a token')}</Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItem: 'center',
                        justifyContent: 'center',
                        bgcolor: '#fff',
                        borderRadius: '9999px',
                        p: 1
                    }}>
                        <CloseIcon
                            sx={{ width: '20px', height: '20px', color: '#333', cursor: 'pointer' }}
                            onClick={onClose}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <OutlinedInput
                        placeholder='Search by a name, symbol or address'
                        startAdornment={<InputAdornment position='start'>
                            <SearchIcon />
                        </InputAdornment>}
                        sx={{
                            width: '90%',
                            color: '#333',
                            bgcolor: '#fff',
                            borderRadius: '10px',
                            '& fieldset': {
                                borderColor: '#ffae5a !important'
                            },
                            '& input': {
                                p: '10px 15px'
                            }
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        sx={{
                            '& .Mui-selected': {
                                color: '#333 !important',
                                bgcolor: '#fff',
                                borderTopLeftRadius: '20px',
                                borderTopRightRadius: '20px'
                            },
                            '& .MuiTabs-indicator': {
                                background: 'none'
                            }
                        }}
                    >
                        <Tab value="one" label="Wallet Tokens" disableRipple />
                        <Tab value="two" label="Ethereum" disableRipple />
                        <Tab value="three" label="Large Cap" disableRipple />
                        <Tab value="four" label="Stable Coins" disableRipple />
                    </Tabs>
                </Box>
                <Box sx={{
                    bgcolor: '#fff',
                    height: '500px',
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px'
                }}>

                </Box>

            </Box>
        </Modal>
    )
}

export default TokenSelectModal
