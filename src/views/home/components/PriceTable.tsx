import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useAllCurrencies } from 'src/hooks/Tokens'
import { useTranslation } from 'src/context/Localization'

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


function PriceTable() {

    const classes = useStyles()
    const allCurrency = useAllCurrencies()
    const { t } = useTranslation()

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
                                    <TableCell>{TokenDetails[allCurrency[key].symbol]?.volumn}</TableCell>
                                    <TableCell>{TokenDetails[allCurrency[key].symbol]?.price}</TableCell>
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

