<<<<<<< HEAD
import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useAllCurrencies } from 'src/hooks/Tokens'
=======
import React, { useContext } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useAllCurrencies } from 'src/hooks/Tokens'
import { useTranslation } from 'src/context/Localization'
import { DataContext } from 'src/context/DataContext'
import { trim } from 'src/utils/trim'
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

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

<<<<<<< HEAD
const TokenDetails = {
    'MATIC': {
        volumn: 775360094,
        price: 1.49,
        change24: 1.4,
        change7d: 21.34
    },
    'SVC': {
        volumn: 20094,
        price: 0.01,
        change24: 1.2,
        change7d: 11.26

    },
    'WBTC': {
        volumn: 4360094,
        price: 24432.94,
        change24: 1.37,
        change7d: 11.87
    },
    'WETH': {
        volumn: 405003,
        price: 1693,
        change24: 0.75,
        change7d: 12.36
    }
}

=======
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

function PriceTable() {

    const classes = useStyles()
    const allCurrency = useAllCurrencies()
<<<<<<< HEAD

    return (
        <div className={classes.priceTable}>
            <Typography sx={{}}>Top Traded</Typography>
=======
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
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
            <TableContainer>
                <Table sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
<<<<<<< HEAD
                            <TableCell>TOKEN</TableCell>
                            <TableCell>VOLUME (24H)</TableCell>
                            <TableCell>PRICE</TableCell>
                            <TableCell>CHANGE (24H)</TableCell>
                            <TableCell>CHANGE (7D)</TableCell>
=======
                            <TableCell>{t('TOKEN')}</TableCell>
                            <TableCell>{t('VOLUME (24H)')}</TableCell>
                            <TableCell>{t('PRICE')}</TableCell>
                            <TableCell>{t('CHANGE (24H)')}</TableCell>
                            <TableCell>{t('CHANGE (7D)')}</TableCell>
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
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
<<<<<<< HEAD
                                    <TableCell>{TokenDetails[allCurrency[key].symbol]?.volumn}</TableCell>
                                    <TableCell>{TokenDetails[allCurrency[key].symbol]?.price}</TableCell>
=======
                                    <TableCell>{trim(TokenDetails[allCurrency[key].symbol]?.volumn, 3)}</TableCell>
                                    <TableCell>{trim(TokenDetails[allCurrency[key].symbol]?.price, 3)}</TableCell>
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
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

