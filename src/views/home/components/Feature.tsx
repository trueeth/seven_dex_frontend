import React from 'react'
import { Box } from '@mui/system'
import { Typography, Grid } from '@mui/material'
import styled from '@emotion/styled'
import SwapIcon from 'src/asset/images/swap.png'
import AnalyticsIcon from 'src/asset/images/analytics.png'
import LiquidityIcon from 'src/asset/images/liquidity.png'
import EarningIcon from 'src/asset/images/earning.png'
import { useTranslation } from 'src/context/Localization'

const ImageWrapper = styled.img` 
    width : 100px;
    height: 100px;
    margin: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 30px;
`;

function FeatureList() {

    const { t } = useTranslation()

    return (
        <div>
            <Box sx={{
                mt: 5,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography sx={{ fontSize: '24px', color: '#555', mb: 3 }}>{t('Features')}</Typography>
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
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>{t('Swap Tokens')}</Typography>
                            <Typography>{t('Trade any combination of ERC-20 tokens permissionless, with ease.')}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ImageWrapper src={LiquidityIcon} />
                        <Box>
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>{t('Supply Liquidity')}</Typography>
                            <Typography>{t('Earn 0.25% fee on trades proportional to your share of the pool.')}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ImageWrapper src={EarningIcon} />
                        <Box>
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>{t('Earn SVC')}</Typography>
                            <Typography>{t('Deposit your LP tokens to earn additional rewards in SVC')}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ImageWrapper src={AnalyticsIcon} />
                        <Box>
                            <Typography sx={{ color: '#e57a3b !important', fontSize: '24px' }}>{t('Analytics')}</Typography>
                            <Typography>{t('Scan through SevenSwap analytics & Historical Data')}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default FeatureList