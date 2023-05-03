
import { styled } from '@mui/material/styles'
import { Box } from "@mui/material"
import { Currency } from "@/utils/token"


const DoubleCurrencyLogo = ({ currency0, currency1 }: {
    currency0: Currency,
    currency1: Currency
}) => (
    <Box sx={{
        display: 'flex',
        '& img': {
            width: '24px', height: '24px'
        }
    }}>
        <img src={currency1.logoURI} />
        <img src={currency0.logoURI} />
    </Box>
)

export default DoubleCurrencyLogo

