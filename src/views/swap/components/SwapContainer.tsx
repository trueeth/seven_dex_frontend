import React from 'react'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { Button, TextField, Typography, Divider } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { IconArrowsUpDown } from '@tabler/icons'

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
                    <Typography>Swap</Typography>
                    <Typography fontSize={12}>Balance: 0</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <TextField
                        variant="standard"
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
                        <Button >Max</Button>
                        <Button endIcon={<KeyboardArrowDownIcon />} sx={{ whiteSpace: 'nowrap' }}>Select token</Button>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ my: 2 }}>
                <Box sx={{
                    p: 1,
                    width: '40px',
                    height: '40px',
                    bgcolor: 'rgb(255, 231, 172)',
                    borderRadius: '9999px'
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
                    <Typography>To</Typography>
                    <Typography fontSize={12}>Balance: 0</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <TextField
                        variant="standard"
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
                        <Button endIcon={<KeyboardArrowDownIcon />} sx={{ whiteSpace: 'nowrap' }}>Select token</Button>
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
                    S w a p
                </Button>
            </Box>
        </div >
    )
}

export default SwapContainer