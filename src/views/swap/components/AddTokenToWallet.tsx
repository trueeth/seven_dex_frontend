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
                        tokens['0x8160510aAa29256E34d26D770171C05867d5252F']
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