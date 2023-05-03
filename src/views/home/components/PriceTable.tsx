import React, { useContext } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useAllCurrencies } from '@/hooks/Tokens'
import { useTranslation } from '@/context/Localization'
import { DataContext } from '@/context/DataContext'
import { trim } from '@/utils/trim'

const useStyles = makeStyles((theme) => ({
    priceTable: {
        marginTop: '50px',
        width: '60%',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '30px',
        [theme.breakpoints.down('sm')]: {
            width: '95%',
        }
    }
}))


function PriceTable() {

    const classes = useStyles()
    const allCurrency = useAllCurrencies()
    const { t } = useTranslation()
    const { tokenPrices, tradeVolume } = useContext(DataContext)

    const TokenDetails = {
        'MATIC': {
            volumn: tradeVolume?.MATIC ?? 0,
            price: tokenPrices?.MATIC ?? 1.49,
            change24: 1.4,
            change7d: 21.34
        },
        'SVC': {
            volumn: tradeVolume?.SVC ?? 0,
            price: tokenPrices?.SVC ?? 0.01,
            change24: 1.2,
            change7d: 11.26

        },
        'WBTC': {
            volumn: tradeVolume?.WBTC ?? 0,
            price: tokenPrices?.WBTC ?? 28032.94,
            change24: 1.37,
            change7d: 11.87
        },
        'WETH': {
            volumn: tradeVolume?.WETH ?? 0,
            price: tokenPrices?.WETH ?? 1853,
            change24: 0.75,
            change7d: 12.36
        },
        'B2Z': {
            volumn: tradeVolume?.B2Z ?? 270,
            price: tokenPrices?.B2Z ?? 0.2,
            change24: 0.35,
            change7d: 1.36
        }
    }

    return (
        <div className={classes.priceTable}>
            <Typography sx={{}}>{t('Top Traded')}</Typography>
            <TableContainer>
                <Table sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>{t('TOKEN')}</TableCell>
                            <TableCell>{t('VOLUME (24H)')}</TableCell>
                            <TableCell>{t('PRICE')}</TableCell>
                            <TableCell>{t('CHANGE (24H)')}</TableCell>
                            <TableCell>{t('CHANGE (7D)')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Object.keys(allCurrency).map((key, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={allCurrency[key].logoURI} alt='logo' style={{ width: '24px', height: '24px' }} />
                                        <Typography sx={{ ml: 1, minWidth: '60px' }}>
                                            {allCurrency[key].symbol}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{trim(TokenDetails[allCurrency[key].symbol]?.volumn, 3)}</TableCell>
                                    <TableCell>{trim(TokenDetails[allCurrency[key].symbol]?.price, 3)}</TableCell>
                                    <TableCell>{TokenDetails[allCurrency[key].symbol]?.change24}</TableCell>
                                    <TableCell>{TokenDetails[allCurrency[key].symbol]?.change7d}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default PriceTable

