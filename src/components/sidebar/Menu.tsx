import React from 'react'
import { Box, Link, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    menuList: {
        '& .MuiTypography-root': {
            color: '#FFF',
            fontSize: '20px',
            fontFamily: 'Square',
            fontWeight: 500,
            lineHeight: '55px'
        },
        '& .title': {
            fontSize: '28px',
            marginLeft: 20
        }
    }
}))

const menuList = [
    {
        title: 'Dashboard'
    }, {
        title: 'Swap'
    }
]

function MenuList() {
    const classes = useStyles()

    return (
        <div className={classes.menuList}>
            <Box sx={{ mt: 5 }}>
                {
                    menuList?.map((item, index) => (
                        <Link
                            key={index}
                            component={NavLink}
                            to={`${item.title.toLocaleLowerCase()}`}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 1,
                                borderRadius: '15px',
                                textDecoration: 'none'
                            }}
                        >
                            <Typography>{item.title}</Typography>
                        </Link>
                    ))
                }
            </Box >
        </div >
    )
}

export default MenuList
