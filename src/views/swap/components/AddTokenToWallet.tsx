import { Box, Button, Typography } from "@mui/material"


function AddTokenToWallet() {

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button>
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