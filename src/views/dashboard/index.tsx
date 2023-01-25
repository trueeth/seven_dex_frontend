import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Divider, Typography } from '@mui/material'
import { Box } from '@mui/system'

const useStyles = makeStyles((theme) => ({
    dashboardView: {
        display: 'flex',
        justifyContent: 'center',
        '& .MuiTypography-root': {
            color: '#FFF'
        }
    }
}))



function Dashboard() {

    const classes = useStyles()

    return (
        <div className={classes.dashboardView}>

        </div>
    )
}

export default Dashboard
