import { Box } from "@mui/material"
import { Currency } from "@/utils/token"

export const CurrencyLogo = ({ currency }: {
    currency: Currency,
}) => (
    <Box sx={{
        '& img': {
            width: '24px', height: '24px'
        }
    }}>
        <img src={currency?.logoURI} />
    </Box>
)
