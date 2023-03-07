import { Box, Typography } from "@mui/material"
import { StyledButton } from "./Styled"



function NoPosition() {

    return (
        <Box sx={{ width: '100%' }}>
            <Box>
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
                bgcolor: 'rgb(242, 246, 250)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                p: 3,
                mt: 3,
                borderRadius: '32px',
                gap: 3
            }}>
                <Typography>
                    No liquidity found.
                </Typography>
                <Typography>Don't see a pair you joined?</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
                <StyledButton>+ Add Liquidity</StyledButton>
            </Box>
        </Box>
    )
}

export default NoPosition

