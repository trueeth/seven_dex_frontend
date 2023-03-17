import React from 'react'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import LanguageIcon from '@mui/icons-material/Language'
import { useTranslation } from 'src/context/Localization'
import { StyledMenu } from './Styled'





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
                aria-controls={open ? 'customized-menu' : undefined}
                onClick={openModal}
            >
                <LanguageIcon />
            </Button>
            <StyledMenu
                id="customized-menu"
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