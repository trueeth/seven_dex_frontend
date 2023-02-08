import { Divider } from "@mui/material"
import { Box } from "@mui/system"
import { IconArrowsUpDown } from "@tabler/icons"

function SwitchIOCurrency() {

    return (
        <div>
            <Divider sx={{ mt: 4, mb: 2 }}>
                <Box sx={{
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    bgcolor: 'rgb(255, 231, 172)',
                    borderRadius: '9999px',
                    cursor: 'pointer'
                }}>
                    <IconArrowsUpDown color='#333' size={18} />
                </Box>
            </Divider>
        </div>
    )
}

export default SwitchIOCurrency