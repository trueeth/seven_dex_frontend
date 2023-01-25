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


const useStyles = makeStyles(() => ({
    footerView: {
        padding: '20px 0',
        display: 'flex',
        justifyContent: 'center',
        '& .MuiTypography-root': {
            color: '#333'
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
    return (
        <div className={classes.footerView}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    m: 3
                }}>
                    <Typography sx={{ fontSize: '20px', mt: 2 }}>Social Links</Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        '& img': {
                            width: 32,
                            height: 32,
                            m: 1
                        }
                    }}>
                        <img src={TwitterIcon} alt='twitter' />
                        <img src={TelegramIcon} alt='telegram' />
                        <img src={DiscordIcon} alt='discord' />
                        <img src={MediumIcon} alt='medium' />
                        <img src={FacebookIcon} alt='fecebook' />
                        <img src={InstagramIcon} alt='instagram' />
                    </Box>
                </Box>
                <Box sx={{ my: 3, mx: 4 }}>
                    <Typography sx={{ fontSize: '20px', mt: 2 }}>Useful Link</Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 2, '& .MuiTypography-root': { pt: '7px', fontSize: '16px' } }}>
                            <Typography>Seven Project</Typography>
                            <Typography>Docs</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ my: 2.7, mx: 4 }}>
                    <Typography sx={{ fontSize: '20px', mt: 2 }}>Exchanges</Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 2, '& .MuiTypography-root': { pt: '7px', fontSize: '16px' } }}>
                            <Typography>Uniswap</Typography>
                            <Typography>Quickswap</Typography>
                            <Typography>Coinsbit</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    my: 2.7,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '& img': {
                        width: '64px',
                        height: '64px',
                        marginBottom: '16px'
                    }
                }}>
                    <img src={SevenChainIcon} alt='svc_chain' />
                    <Typography>Copyright © 2023.<br />By Seven Project Team</Typography>
                </Box>
            </Box>
        </div>
    )
}

export default Footer
