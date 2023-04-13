import { Box, Button, Typography } from "@mui/material"
import { StyledButton } from "./Styled"
import { Link } from "react-router-dom"
import { useAccount } from "wagmi"
import { toLiquidityToken, useTrackedTokenPairs } from "src/state/user/hooks"
import { useMemo } from "react"
import { useTokenBalancesWithLoadingIndicator } from "src/state/wallet/hooks"
import { PairState, usePairs } from "src/hooks/usePairs"
import FullPositionCard from './PositionCard'
import { IconInfoCircle } from "@tabler/icons"
import { useTranslation } from "src/context/Localization"
import { CustomTooltip } from "src/components/styled_components/Tooltip"


export function UserPosition({ setStep }) {

    const { address: account } = useAccount()

    const { t } = useTranslation()

    const trackedTokenPairs = useTrackedTokenPairs()

    const tokenPairsWithLiquidityTokens = useMemo(
        () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toLiquidityToken(tokens), tokens })),
        [trackedTokenPairs],
    )
    const liquidityTokens = useMemo(
        () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
        [tokenPairsWithLiquidityTokens],
    )

    const [pairsBalances, fetchingPairBalances] = useTokenBalancesWithLoadingIndicator(
        account ?? undefined,
        liquidityTokens,
    )

    // fetch the reserves for all V2 pools in which the user has a balance
    const liquidityTokensWithBalances = useMemo(
        () =>
            tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
                pairsBalances[liquidityToken.address]?.greaterThan('0'),
            ),
        [tokenPairsWithLiquidityTokens, pairsBalances],
    )

    const pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

    const isLoading =
        fetchingPairBalances ||
        pairs?.length < liquidityTokensWithBalances.length ||
        (pairs?.length && pairs.every(([pairState]) => pairState === PairState.LOADING))

    const allPairsWithLiquidity = pairs
        ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
        .map(([, pair]) => pair)


    const renderBody = () => {
        if (!account) {
            return (
                <Typography color="textSubtle" textAlign="center">
                    {t('Connect to a wallet to view your liquidity.')}
                </Typography>
            )
        }
        if (isLoading) {
            return (
                <Typography color="textSubtle" textAlign="center">
                    {t('Loading...')}
                </Typography>
            )
        }

        let positionCards = []

        if (allPairsWithLiquidity?.length > 0) {
            positionCards = allPairsWithLiquidity.map((pair, index) => (
                <FullPositionCard
                    key={pair.liquidityToken.address}
                    pair={pair}
                    setStep={setStep}
                />
            ))
        }

        if (positionCards?.length > 0) {
            return positionCards
        }

        return (
            <>
                <Typography>
                    {t('No liquidity found.')}
                </Typography>
                <Typography>{t('Do not see a pair you joined')}</Typography>
                <Typography>{t('Find other LP tokens')}</Typography>
            </>
        )
    }


    return (
        <Box sx={{ width: '100%' }}>
            <Box p={4}>
                <Box sx={{ display: 'flex' }}>
                    <Typography sx={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#444 !important'
                    }}>
                        {t('Your Liquidity')}
                    </Typography>
                    <CustomTooltip
                        arrow
                        title={t('Your positions(assets) which was depostied in the seven dex trading pairs.')}
                        disableInteractive
                    >
                        <Button sx={{ display: 'flex', ml: -1.5, mt: -1 }}>
                            <IconInfoCircle color='#666' />
                        </Button>
                    </CustomTooltip>
                </Box>
                <Typography mt={1}>{t('Remove liquidity to receive tokens back')}</Typography>
            </Box>
            <Box sx={{
                bgcolor: 'rgb(255, 231, 172,0.3)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                p: 3,
                gap: 1
            }}>
                {renderBody()}
            </Box>
            <Link to='/add'>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }} >
                    <StyledButton onClick={() => setStep('select_token')}>+ {t('Add Liquidity')}</StyledButton>
                </Box>
            </Link>
        </Box>
    )
}

