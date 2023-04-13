
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PricePanel from './components/PricePanel'
import PriceTable from './components/PriceTable'
import FeatureList from './components/Feature'
<<<<<<< HEAD
=======
import { useTranslation } from 'src/context/Localization'
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

const useStyles = makeStyles(() => ({
    homeView: {
        marginTop: '100px',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }
}))



function Home() {

    const classes = useStyles()
<<<<<<< HEAD
=======
    const { t } = useTranslation()
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283

    return (
        <div className={classes.homeView}>
            <Typography sx={{
                fontSize: '28px',
                color: '#555',
                textAlign: 'center'
            }}>
<<<<<<< HEAD
                Assets Exchange on Polygon
=======
                {t('Assets Exchange on Polygon')}
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
            </Typography>
            <PricePanel />
            <PriceTable />
            <FeatureList />
        </div>
    )
}

export default Home