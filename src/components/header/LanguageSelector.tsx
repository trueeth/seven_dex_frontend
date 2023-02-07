import React, { useState } from 'react'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import LanguageIcon from '@mui/icons-material/Language'
import { useTranslation } from 'src/context/Localization'



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

const LangMenu = [
    {
        locale: 'en-US',
        language: 'English',
        code: 'en'
    }, {
        locale: 'ja-JP',
        language: '日本語',
        code: 'ja'
    }
]

function LanguageSelector() {

    const { setLanguage } = useTranslation()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const openModal = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const closeModal = () => {
        setAnchorEl(null)
    }

    const selectLang = (index) => {
        setLanguage(LangMenu[index])
    }

    return (
        <div>
            <Button
                sx={{
                    bgcolor: '#e57a3b',
                    borderRadius: '9999px',
                    color: '#333',
                    py: 1.3,
                    fontSize: '18px',
                    '&:hover': {
                        bgcolor: '#e57a3b'
                    },
                    '& svg': {
                        fill: '#fff'
                    }
                }}
                aria-controls={open ? 'demo-customized-menu' : undefined}
                onClick={openModal}
            >
                <LanguageIcon />
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
                    LangMenu.map((lang, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => selectLang(index)}
                        >
                            {lang.language}
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </div>
    )
}

export default LanguageSelector