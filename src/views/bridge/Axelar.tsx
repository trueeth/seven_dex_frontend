import { SquidWidget } from '@0xsquid/widget'
import { Box } from '@mui/material'

const Axelar = () => {
    return (
        <Box sx={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: { xs: '95%', sm: '420px' } }}>
            <SquidWidget
                config={{
                    companyName: 'Custom',
                    style: {
                        neutralContent: '#5d5964',
                        baseContent: '#291f22',
                        base100: '#fbf0d0',
                        base200: '#FBFAFF',
                        base300: '#ffffff',
                        error: '#ED6A5E',
                        warning: '#ea9c43',
                        success: '#62C555',
                        primary: '#d8b146',
                        secondary: '#f5c542',
                        secondaryContent: '#F7F6FB',
                        neutral: '#FFFFFF',
                        roundedBtn: '26px',
                        roundedBox: '1rem',
                        roundedDropDown: '20rem',
                        displayDivider: true
                    },
                    slippage: 1.5,
                    infiniteApproval: false,
                    enableExpress: false,
                    apiUrl: 'https://api.squidrouter.com',
                    mainLogoUrl: 'https://seven-project.com/images/71.png',
                    initialFromChainId: 1, // Arbitrum
                    initialToChainId: 137, // Moonbeam
                    titles: {
                        swap: 'Bridge',
                        settings: 'Settings',
                        wallets: 'Wallets',
                        tokens: 'Tokens',
                        chains: 'Chains',
                        history: 'History',
                        transaction: 'Transaction',
                        allTokens: 'Tokens',
                        destination: 'Destination address'
                    },
                    priceImpactWarnings: {
                        warning: 3,
                        critical: 5
                    }
                }}
            />
        </Box>
    )
}

export default Axelar
