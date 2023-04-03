import { Button } from "@mui/material"
import { styled } from "@mui/system"

export const StyledButton = styled(Button)<{ outlined?: boolean }>(({ outlined }) => ({
    padding: '10px 0',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: '20px',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: outlined ? '#ffae5a' : '#fff',
    backgroundColor: outlined ? 'none' : '#ffae5a',
    '&:hover': {
        backgroundColor: '#ffae5a'
    },
    '&:disabled': {
        color: 'white',
        cursor: 'not-allowed'
    },
}));

export const OutlinedButton = styled(Button)({
    padding: 0,
    width: '90%',
    backgroundColor: 'none',
    color: '#ffae5a',
    '&:hover': {
        bgcolor: 'none'
    }
})
