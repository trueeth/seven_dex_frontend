import React, { useCallback, useState } from 'react'
import Menu from '@mui/material/Menu'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { Button, InputAdornment, OutlinedInput, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { IconAdjustmentsHorizontal, IconX, IconInfoCircle } from '@tabler/icons'
import SwitchLarge from './styled_components/SwitchLarge'
import { useTranslation } from 'src/context/Localization'
import { useDispatch } from 'react-redux'
import { useUserSlippageTolerance, useUserTransactionTTL } from 'src/state/user/hooks'
import { escapeRegExp } from 'src/utils'

enum SlippageError {
    InvalidInput = 'InvalidInput',
    RiskyLow = 'RiskyLow',
    RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
    InvalidInput = 'InvalidInput',
}


const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3


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
    const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
    const [ttl, setTtl] = useUserTransactionTTL()

    const [slippageInput, setSlippageInput] = useState('')
    const [deadlineInput, setDeadlineInput] = useState('')

    const slippageInputIsValid =
        slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
    const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

    let slippageError: SlippageError | undefined
    if (slippageInput !== '' && !slippageInputIsValid) {
        slippageError = SlippageError.InvalidInput
    } else if (slippageInputIsValid && userSlippageTolerance < 50) {
        slippageError = SlippageError.RiskyLow
    } else if (slippageInputIsValid && userSlippageTolerance > 500) {
        slippageError = SlippageError.RiskyHigh
    } else {
        slippageError = undefined
    }

    let deadlineError: DeadlineError | undefined
    if (deadlineInput !== '' && !deadlineInputIsValid) {
        deadlineError = DeadlineError.InvalidInput
    } else {
        deadlineError = undefined
    }

    const parseCustomSlippage = (value: string) => {
        if (value === '' || inputRegex.test(escapeRegExp(value))) {
            setSlippageInput(value)

            try {
                const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
                if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
                    setUserSlippageTolerance(valueAsIntFromRoundedFloat)
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    const parseCustomDeadline = (value: string) => {
        setDeadlineInput(value)

        try {
            const valueAsInt: number = Number.parseInt(value) * 60
            if (!Number.isNaN(valueAsInt) && valueAsInt > 60 && valueAsInt < THREE_DAYS_IN_SECONDS) {
                setTtl(valueAsInt)
            } else {
                deadlineError = DeadlineError.InvalidInput
            }
        } catch (error) {
            console.error(error)
        }
    }


    const onSlippageChange = (
        event: any,
        newSlip: number,
    ) => {
        if (newSlip) {
            setSlippageInput('')
            setUserSlippageTolerance(newSlip)
        }
    }



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
                            value={userSlippageTolerance}
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
                            <ToggleButton value={10}>0.1%</ToggleButton>
                            <ToggleButton value={50}>0.5%</ToggleButton>
                            <ToggleButton value={100}>1%</ToggleButton>
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
                            placeholder={(userSlippageTolerance / 100).toFixed(2)}
                            value={slippageInput}
                            onChange={(event) => {
                                if (event.currentTarget.validity.valid) {
                                    parseCustomSlippage(event.target.value.replace(/,/g, '.'))
                                }
                            }}
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
                            value={deadlineInput}
                            placeholder={(ttl / 60).toString()}
                            onBlur={() => {
                                parseCustomDeadline((ttl / 60).toString())
                            }}
                            onChange={(event) => {
                                if (event.currentTarget.validity.valid) {
                                    parseCustomDeadline(event.target.value)
                                }
                            }}
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
                                checked={true}
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