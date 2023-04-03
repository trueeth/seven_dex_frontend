import React from 'react'

import { makeStyles } from '@mui/styles'
import { Box, Drawer } from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BrowserView, MobileView } from 'react-device-detect'

// project component
import MenuList from './Menu'

// style constant
const useStyles = makeStyles((theme) => ({
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: '350px',
            flexShrink: 0
        }
    },
    drawerPaper: {
        width: '280px',
        color: theme.palette.text.primary,
        borderRight: 'none'
    },
    scrollHeight: {
        height: 'calc(100vh - 68px)',
        paddingLeft: '16px',
        paddingRight: '16px',
        [theme.breakpoints.down('sm')]: {
            height: 'calc(100vh - 56px)'
        }
    }
}))

// -----------------------|| SIDEBAR DRAWER ||-----------------------//

interface IProps {
    drawerOpen: boolean;
    drawerToggle: () => void;
}

const Sidebar = ({ drawerOpen, drawerToggle }: IProps) => {
    const classes = useStyles()

    const drawer = (
        <React.Fragment>
            <BrowserView>
                <PerfectScrollbar component="div" className={classes.scrollHeight}>
                    <Box sx={{ mt: '20px', ml: '10px' }}>
                        <MenuList toggle={drawerToggle} />
                    </Box>
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ mt: '100px', ml: '10px' }}>
                    <MenuList toggle={drawerToggle} />
                </Box>
            </MobileView>
        </React.Fragment>
    )

    const container = window.document.body

    return (
        <nav className={classes.drawer}>
            <Drawer
                container={container}
                variant='temporary'
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                classes={{
                    paper: classes.drawerPaper
                }}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                    sx: {
                        backgroundColor: '#fff'
                    }
                }}
            >
                {drawer}
            </Drawer>
        </nav>
    )
}

export default Sidebar
