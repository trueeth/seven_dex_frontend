import { makeStyles } from "@mui/styles"

const useStyles = makeStyles((theme) => ({
    cardView: {
        minWidth: '500px',
        padding: '32px',
        display: 'flex',
        flexGrow: 1,
        margin: '20px',
        borderRadius: '32px',
        background: '#fff',
        '& .MuiTypography-root': {
            color: '#333'
        },
        [theme.breakpoints.down('sm')]: {
            minWidth: '95%',
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    }
}))

function Container({ children }: any) {

    const classes = useStyles()

    return (
        <div className={classes.cardView}>
            {
                children
            }
        </div>
    )
}

export default Container