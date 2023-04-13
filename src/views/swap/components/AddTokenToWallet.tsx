import { Box, Button, Typography } from "@mui/material"
import { useTranslation } from "src/context/Localization"
import { useAllTokens } from "src/hooks/Tokens"
<<<<<<< HEAD
=======
import useToast from "src/hooks/useToast"
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
import { registerToken } from "src/utils/registerToken"
import { Token } from "src/utils/token"


function AddTokenToWallet() {

<<<<<<< HEAD
    const onRegisterToken = (token: Token) => {
        registerToken(
=======
    const tokens = useAllTokens()
    const { t } = useTranslation()
    const { toastSuccess } = useToast()
    const onRegisterToken = async (token: Token) => {
        await registerToken(
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
            token.address,
            token.symbol,
            token.decimals,
            token.logoURI)
<<<<<<< HEAD
    }
    const tokens = useAllTokens()
    const { t } = useTranslation()
=======
        toastSuccess(t('SVC Token added successfully'))
    }
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
<<<<<<< HEAD
=======
                sx={{ cursor: 'pointer' }}
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
                onClick={() =>
                    onRegisterToken(
                        tokens['0x40ae465CC90c636Ea0Ff123f91924d222F513a6E']
                    )
                }
            >
                <Typography sx={{
                    width: '100%',
                    textAlign: 'center',
                    color: '#ffae5a'
                }}>
                    {t('Add SVC to wallet')}
                </Typography>
            </Button>
        </Box>
    )
}

export default AddTokenToWallet