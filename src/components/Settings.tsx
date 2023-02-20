import React, { useCallback, useState } from 'react'
import Menu from '@mui/material/Menu'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { Button, InputAdornment, OutlinedInput, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { IconAdjustmentsHorizontal, IconX, IconInfoCircle } from '@tabler/icons'
import SwitchLarge from './styled_components/SwitchLarge'
import { useTranslation } from 'src/context/Localization'
import { useSwapSetting } from 'src/state/global/hooks'
import { useDispatch } from 'react-redux'
import { setSwapSlippage, setTxSafeMode } from 'src/state/global/actions'

function Settings() {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openModal = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeModal = () => {
        setAnchorEl(null);
    };

    const dispatch = useDispatch()
    const { slippage, safemode, deadline } = useSwapSetting()

    const onSlippageChange = (
        event: any,
        newSlip: number,
    ) => {
        if (newSlip)
            dispatch(setSwapSlippage({ slippage: newSlip }))
    }

    const onSetMode = useCallback(() => {
        dispatch(setTxSafeMode({ mode: !safemode }))
    }, [dispatch, safemode])

    const { t } = useTranslation()

    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Button
                    onClick={openModal}
                    size="small"
                    sx={{
                        mr: 3,
                        p: 2,
                        bgcolor: '#fff',
                        borderRadius: '20px',
                        color: '#333',
                        '&:hover': {
                            bgcolor: '#fff'
                        }
                    }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <IconAdjustmentsHorizontal size={18} style={{ marginRight: '5px', color: '#666' }} />
                    {t('Settings')}
                </Button>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={closeModal}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        borderRadius: '10px',
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 200,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{
                    width: '360px',
                    p: '10px 20px'
                }}>
                    <Box sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography>{t('Settings')}</Typography>
                        <IconX onClick={closeModal} cursor='pointer' />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography color='#666' fontSize={14}>{t('Slippage Tolerance')}</Typography>
                        <Tooltip title='Your transaction will be revert if the price changes unfavorably by more than this percentage, Default is 0.5%' disableInteractive>
                            <Button sx={{ display: 'flex' }}>
                                <IconInfoCircle color='#666' />
                            </Button>
                        </Tooltip>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                        <ToggleButtonGroup
                            value={slippage}
                            exclusive
                            onChange={onSlippageChange}
                            sx={{
                                '& .MuiToggleButton-root': {
                                    mr: 0.5,
                                    minWidth: '60px',
                                    border: '1px solid #ccc !important',
                                    borderRadius: '20px !important'
                                }
                            }}
                        >
                            <ToggleButton value={0.1}>0.1%</ToggleButton>
                            <ToggleButton value={0.5}>0.5%</ToggleButton>
                            <ToggleButton value={1}>1%</ToggleButton>
                        </ToggleButtonGroup>
                        <OutlinedInput
                            sx={{
                                '& fieldset': {
                                    borderRadius: '20px'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ffae5a !important',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#ffae5a !important',
                                }
                            }}
                            type='number'
                            value={slippage}
                            endAdornment={<InputAdornment position="end">%</InputAdornment>}
                        />
                    </Box>
                    <Box mt={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography color='#666' fontSize={14}>Transaction Deadline</Typography>
                            <Tooltip title='Your transaction will be revert if it is pending for more than this long' disableInteractive>
                                <Button sx={{ display: 'flex', ml: -1.5 }}>
                                    <IconInfoCircle color='#666' />
                                </Button>
                            </Tooltip>
                        </Box>
                        <OutlinedInput
                            sx={{
                                '& fieldset': {
                                    borderRadius: '20px'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ffae5a !important',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#ffae5a !important',
                                }
                            }}
                            type='number'
                            value={30}
                            endAdornment={<InputAdornment position="end">minutes</InputAdornment>}
                            inputProps={{

                                'aria-label': 'percentage',
                            }}
                        />
                    </Box>
                    <Box mt={1}>
                        <Typography color='#666' fontSize={14}>Safe Mode</Typography>
                        <Box sx={{ display: 'flex' }}>
                            <SwitchLarge
                                sx={{ mt: 1 }}
                                checked={safemode}
                                onChange={onSetMode}
                            />
                            <Typography color='#666' fontSize={14} px={2}>
                                Prevent high price impact trades. Disable at your own risk.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Menu>
        </div>
    )
}

export default Settings