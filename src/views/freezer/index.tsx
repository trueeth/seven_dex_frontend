import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import FreezeBox from './components/FreezeBox'
import CheckBox from './components/CheckBox'
import useSWR from 'swr'
import { DATABASE_URL } from 'src/config'


const useStyles = makeStyles((theme) => ({
    freezerView: {
        width: '80%',
        display: 'flex',
        justifyContent: 'space-around',
        marginLeft: 'auto',
        marginRight: 'auto',
        '& .MuiTypography-root': {
            color: '#FFF'
        },
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center'
        }
    },
    toggleBtns: {
        '& .MuiToggleButtonGroup-grouped': {
            margin: '10px',
            border: 0,
            fontSize: '18px',
            textTransform: 'none',
            backgroundColor: '#0b2034',
            color: '#FFF',
            padding: '15px 30px',
            '&:hover': {
                backgroundColor: '#0f3152 !important'
            },
            '&.Mui-selected': {
                backgroundColor: '#0f3152',
                border: '1px solid #2e5387',
                borderRadius: '20px !important',
                color: '#FFF',
            }

        }
    }
}));

function Freezer() {

    const classes = useStyles();

    const [page, setPage] = useState('start');
    const onSetPage = (e, newPage) => {
        if (newPage)
            setPage(newPage);
    }

    const { data: aprs } = useSWR(DATABASE_URL)

    const freezeApr = aprs?.stakingPoolApr ?? 0

    return (
        <div className={classes.freezerView}>
            <Box sx={{ width: { xs: '95%', md: '40%' } }}>
                <Typography sx={{ fontSize: '32px', mb: 3 }}>Freeze with Ease</Typography>
                <Typography sx={{ fontSize: '20px' }}>
                    Lock up your FURFI tokens for a specified amount of time and level up in the Ecosystem.
                    Enjoy higher staking rewards, more affiliate commissions and more.
                </Typography>
                <Box sx={{
                    bgcolor: '#0b2034',
                    p: 1,
                    borderRadius: '30px',
                    my: 3,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <ToggleButtonGroup
                        exclusive
                        value={page}
                        onChange={onSetPage}
                        className={classes.toggleBtns}

                    >
                        <ToggleButton value='start'>Start Freezing</ToggleButton>
                        <ToggleButton value='check'>Check Freezing</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
            {page === 'start' && <FreezeBox apr={freezeApr} />}
            {page === 'check' && <CheckBox setPage={setPage} apr={freezeApr} />}
        </div>
    )
}

export default Freezer;