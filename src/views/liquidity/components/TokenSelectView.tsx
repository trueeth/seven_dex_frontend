import { Box, Divider, Typography } from "@mui/material"
import CurrencyInputPanel from "@/components/CurrencyInputPanel"
import { Currency } from "@/utils/token"
import { useCurrencySelectRoute } from "../useCurrencySelectRoute"
import AddIcon from '@mui/icons-material/Add'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { StyledButton } from "./Styled"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "@/context/Localization"


function TokenSelectView({
    currencyA,
    currencyB,
    // error,
    onNext
}: {
    currencyA?: Currency
    currencyB?: Currency
    // error?: string
    onNext: () => void
}) {

    const { t } = useTranslation()

    const navigate = useNavigate()
    const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

    return (
        <Box sx={{ width: '100%' }}>
            <Box p={4} pb={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/liquidity')}>
                    <KeyboardBackspaceIcon />
                </Box>
                <Box ml={3}>
                    <Typography sx={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#444 !important'
                    }}>{t('Add Liquidity')}</Typography>
                    <Typography mt={1}>{t('Receive LP tokens and earn 0.17% trading fees')}</Typography>
                </Box>
            </Box>
            <Divider />
            <Box p={3}>
                <Typography sx={{ ml: 5 }}>{t('Choose a valid pair')}</Typography>
                <Box sx={{
                    mt: 2,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <CurrencyInputPanel
                        currency={currencyA}
                        onCurrencySelect={handleCurrencyASelect}
                    />
                    <Typography><AddIcon /></Typography>
                    <CurrencyInputPanel
                        currency={currencyB}
                        onCurrencySelect={handleCurrencyBSelect}
                    />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                    <Typography>{t('LP reward APR')}</Typography>
                    <Typography>0.42%</Typography>
                </Box>
            </Box>
            <Divider />
            <Box p={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <StyledButton onClick={onNext}>{t('Next')}</StyledButton>
            </Box>
        </Box>
    )
}

export default TokenSelectView