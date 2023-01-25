import React, { useState } from 'react'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import EtheremIcon from '../../asset/images/ethereum.svg'
import PolygonIcon from '../../asset/images/polygon.svg'
import SevenChainIcon from '../../asset/images/seven_chain_logo.png'

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 16,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '10px 5px',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                )
            }
        }
    }
}))

const NetworkMenu = [
    {
        name: 'Ethereum',
        logo: EtheremIcon
    }, {
        name: 'Polygon',
        logo: PolygonIcon
    }, {
        name: 'Seven Chain',
        logo: SevenChainIcon
    }
]

function SelectNetwork() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const [network, setNetwork] = useState({
        name: 'Ethereum',
        logo: EtheremIcon
    })

    const openModal = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const closeModal = () => {
        setAnchorEl(null)
    }

    const selectNetwork = (index) => {
        setNetwork(NetworkMenu[index])
        setAnchorEl(null)
    }

    return (
        <div>
            <Button
                sx={{
                    bgcolor: '#fff',
                    borderRadius: '20px',
                    textTransform: 'none',
                    color: '#333',
                    padding: '5px 10px 10px',
                    fontSize: '18px',
                    '&:hover': {
                        bgcolor: '#fff'
                    },
                    '& img': {
                        pr: 1,
                        width: '24px',
                        height: '20px'
                    }
                }}
                aria-controls={open ? 'demo-customized-menu' : undefined}
                onClick={openModal}
                endIcon={<KeyboardArrowDownIcon />}
            >
                <img src={network.logo} alt={network.name} />
                {network.name}
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeModal}
                sx={{
                    '& img': {
                        pr: 1,
                        width: '24px',
                        height: '20px'
                    }
                }}
            >
                {
                    NetworkMenu.map((network, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => selectNetwork(index)}
                        >
                            <img src={network.logo} alt='ethereum' />
                            {network.name}
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </div>
    )
}

export default SelectNetwork