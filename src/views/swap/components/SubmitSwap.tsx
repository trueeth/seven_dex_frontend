import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useTranslation } from 'src/context/Localization'

function SubmitSwap() {

    const { t } = useTranslation()

    return (
        <div>
            <Box sx={{ display: 'flex', mt: 3 }}>
                <Button sx={{
                    p: 1,
                    width: '100%',
                    borderRadius: '20px',
                    fontSize: '1.2rem',
                    color: '#fff',
                    bgcolor: '#ffae5a',
                    '&:hover': {
                        bgcolor: '#ffae5a'
                    }
                }}>
                    {t('Swap')}
                </Button>
            </Box>
        </div>
    )
}

export default SubmitSwap