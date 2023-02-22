import { Box, Button, Typography } from "@mui/material"
import { useAllTokens } from "src/hooks/Tokens"
import { registerToken } from "src/utils/registerToken"
import { Token } from "src/utils/token"


function AddTokenToWallet() {

    const onRegisterToken = (token: Token) => {
        registerToken(
            token.address,
            token.symbol,
            token.decimals,
            token.logoURI)
    }
    const tokens = useAllTokens()

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
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
                    Add SVC to wallet
                </Typography>
            </Button>
        </Box>
    )
}

export default AddTokenToWallet