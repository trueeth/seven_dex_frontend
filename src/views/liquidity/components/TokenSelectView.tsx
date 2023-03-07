import { Box, Typography } from "@mui/material"
import CurrencyInputPanel from "src/components/CurrencyInputPanel"
import { useCurrency } from "src/hooks/Tokens"
import useActiveWeb3React from "src/hooks/useActiveWeb3React"
import { WMATIC } from "src/utils/token"

function TokenSelectView({ currencyIdA, currencyIdB }) {


    return (
        <Box>
            <Box>
                <Typography>Add Liquidity</Typography>
                <Typography>Receive LP tokens and earn 0.17% trading fees</Typography>
            </Box>
            <Box>
                <Typography>CHOOSE A VALID PAIR</Typography>
                <Box>
                </Box>
            </Box>
        </Box>
    )
}

export default TokenSelectView