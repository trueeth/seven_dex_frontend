import React from 'react'
import { Box } from '@mui/system'
import { Typography, Grid } from '@mui/material'
import styled from '@emotion/styled'
import SwapIcon from 'src/asset/images/swap.png'
import AnalyticsIcon from 'src/asset/images/analytics.png'
import LiquidityIcon from 'src/asset/images/liquidity.png'
import EarningIcon from 'src/asset/images/earning.png'
<<<<<<< HEAD
=======
import { useTranslation } from 'src/context/Localization'
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

const ImageWrapper = styled.img` 
    width : 100px;
    height: 100px;
    margin: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 30px;
`;

function FeatureList() {

<<<<<<< HEAD
=======
    const { t } = useTranslation()

>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
    return (
        <div>
            <Box sx={{
                mt: 5,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
<<<<<<< HEAD
                <Typography sx={{ fontSize: '24px', color: '#555', mb: 3 }}>Features</Typography>
=======
                <Typography sx={{ fontSize: '24px', color: '#555', mb: 3 }}>{t('Features')}</Typography>
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
                <Grid
                    container
                    sx={{
                        width: { xs: '95%', md: '70%' },
                        '& .MuiGrid-item': {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '& .MuiTypography-root': {
                                color: '#333',
                                maxWidth: '300px'
                            }
                        }
                    }}
                    spacing={5}
                >
                    <Grid item xs={12} md={6}>
                        <ImageWrapper src={SwapIcon} />
                        <Box >
<<<<<<< HEAD
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>Swap Tokens</Typography>
                            <Typography>Trade any combination of ERC-20 tokens permissionless, with ease.</Typography>
=======
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>{t('Swap Tokens')}</Typography>
                            <Typography>{t('Trade any combination of ERC-20 tokens permissionless, with ease.')}</Typography>
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ImageWrapper src={LiquidityIcon} />
                        <Box>
<<<<<<< HEAD
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>Supply Liquidity</Typography>
                            <Typography>  Earn 0.25% fee on trades proportional to your share of the pool</Typography>
=======
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>{t('Supply Liquidity')}</Typography>
                            <Typography>{t('Earn 0.25% fee on trades proportional to your share of the pool.')}</Typography>
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ImageWrapper src={EarningIcon} />
                        <Box>
<<<<<<< HEAD
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>Earn SVC</Typography>
                            <Typography> Deposit your LP tokens to earn additional rewards in SVC</Typography>
=======
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>{t('Earn SVC')}</Typography>
                            <Typography>{t('Deposit your LP tokens to earn additional rewards in SVC')}</Typography>
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ImageWrapper src={AnalyticsIcon} />
                        <Box>
<<<<<<< HEAD
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>Analytics</Typography>
                            <Typography>Scan through SevenSwap analytics & Historical Data</Typography>
=======
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>{t('Analytics')}</Typography>
                            <Typography>{t('Scan through SevenSwap analytics & Historical Data')}</Typography>
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default FeatureList