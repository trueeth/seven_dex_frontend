
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PricePanel from './components/PricePanel'
import PriceTable from './components/PriceTable'
import FeatureList from './components/Feature'
import { useTranslation } from 'src/context/Localization'

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
    const { t } = useTranslation()

    return (
        <div className={classes.homeView}>
            <Typography sx={{
                fontSize: '28px',
                color: '#555',
                textAlign: 'center'
            }}>
                {t('Assets Exchange on Polygon')}
            </Typography>
            <PricePanel />
            <PriceTable />
            <FeatureList />
        </div>
    )
}

export default Home