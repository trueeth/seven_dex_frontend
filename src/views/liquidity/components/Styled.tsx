import { styled } from "@mui/system"

export const StyledButton = styled('button')({
    padding: '15px 0',
    width: '100%',
    borderRadius: '20px',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: '#ffae5a',
    '&:hover': {
        backgroundColor: '#ffae5a'
    }
})