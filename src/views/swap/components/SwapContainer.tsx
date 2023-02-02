import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { Button, TextField, Typography, Divider } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { IconArrowsUpDown } from '@tabler/icons'
import TokenList from 'src/components/TokenList'
import { useTranslation } from 'src/context/Localization'

const useStyles = makeStyles((theme) => ({
    cardView: {
        maxWidth: '500px',
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
            minWidth: '95%',
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    }
}))

function SwapContainer() {

    const classes = useStyles()
    const [openTl, setOpenTl] = useState(false) // token list modal

    const { t } = useTranslation()

    return (
        <div className={classes.cardView}>
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
                            onClick={() => setOpenTl(true)}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            {t('Select token')}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ my: 2 }}>
                <Box sx={{
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    bgcolor: 'rgb(255, 231, 172)',
                    borderRadius: '9999px',
                    cursor: 'pointer'
                }}>
                    <IconArrowsUpDown color='#333' size={18} />
                </Box>
            </Divider>
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
                    <Typography fontSize={12}>Balance: 0</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
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
                        <Button
                            onClick={() => setOpenTl(true)}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            {t('Select token')}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', mt: 3 }}>
                <Button sx={{
                    p: 1,
                    width: '100%',
                    borderRadius: '20px',
                    fontSize: '1.2rem',
                    color: '#fff',
                    bgcolor: '#ffae5a',
                    '&:hover': {
                        bgcolor: '#ffae5a'
                    }
                }}>
                    {t('Swap')}
                </Button>
            </Box>
            <TokenList open={openTl} onClose={() => setOpenTl(false)} />
        </div >
    )
}

export default SwapContainer