import { Box, Typography } from "@mui/material"
import { StyledButton } from "./Styled"
import { Link } from "react-router-dom"



function NoPosition() {

    return (
        <Box sx={{ width: '100%' }}>
            <Box p={4}>
                <Typography sx={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#444 !important'
                }}>
                    Your Liquidity
                </Typography>
                <Typography mt={1}>Remove liquidity to receive tokens back</Typography>
            </Box>
            <Box sx={{
                bgcolor: 'rgb(255, 231, 172,0.3)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                p: 3,
                gap: 1
            }}>
                <Typography>
                    No liquidity found.
                </Typography>
                <Typography>Don't see a pair you joined?</Typography>
                <Typography>Find other LP tokens</Typography>
            </Box>
            <Box sx={{ mt: 3, p: 3 }}>
                <Link to='/add' >
                    <StyledButton>+ Add Liquidity</StyledButton>
                </Link>
            </Box>
        </Box>
    )
}

export default NoPosition

