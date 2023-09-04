import React from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Typography } from '@mui/material'
import TwitterIcon from '../../asset/images/twitter.svg'
import TelegramIcon from '../../asset/images/telegram.svg'
import DiscordIcon from '../../asset/images/discord.svg'
import MediumIcon from '../../asset/images/medium.svg'
import FacebookIcon from '../../asset/images/facebook.svg'
import InstagramIcon from '../../asset/images/instagram.svg'
import SevenChainIcon from '../../asset/images/seven_chain_logo.png'
import { useTranslation } from '@/context/Localization'

const useStyles = makeStyles(() => ({
    footerView: {
        padding: '20px 0',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'rgb(245, 251, 255)',
        '& .MuiTypography-root': {
            color: '#555'
        },
        '& .MuiButton-root': {
            color: '#333',
            borderRadius: '20px',
            padding: '0 20px',
            background: 'linear-gradient(0deg,#f8bf4c,#e77b3b)'
        }
    }
}))

function Footer() {
    const classes = useStyles()
    const { t } = useTranslation()
    return (
        <div className={classes.footerView}>
            <Box
                sx={{
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 5
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 3
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '& img': {
                                width: '64px',
                                height: '64px',
                                marginBottom: '16px'
                            }
                        }}
                    >
                        <img src={SevenChainIcon} alt="svc_chain" />
                        <Typography>{t('Copyright')}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            '& img': {
                                width: 32,
                                height: 32,
                                mx: 1,
                                mt: 2
                            }
                        }}
                    >
                        <img src={TwitterIcon} alt="twitter" />
                        <img src={TelegramIcon} alt="telegram" />
                        <img src={DiscordIcon} alt="discord" />
                        <img src={MediumIcon} alt="medium" />
                        <img src={FacebookIcon} alt="fecebook" />
                        <img src={InstagramIcon} alt="instagram" />
                    </Box>
                </Box>
                <Box sx={{ maxWidth: '840px', p: 2 }}>
                    <Typography sx={{ fontSize: '24px', color: '#ffae5a !important', mb: 1.5 }}>
                        {t('Disclaimer')}
                    </Typography>
                    <Typography sx={{ textIndent: '20px' }}>{t('Disclaimer Content')}</Typography>
                </Box>
            </Box>
        </div>
    )
}

export default Footer
