import { Box, Paper, Typography } from "@mui/material"
import JSBI from "jsbi"
import { useMemo, useState } from "react"
import { BIG_INT_ZERO } from "src/config/constants/exchange"
import { useTranslation } from "src/context/Localization"
import useTotalSupply from "src/hooks/useTotalSupply"
import { useTokenBalance } from "src/state/wallet/hooks"

import { Pair } from "src/utils/pair"
import { Percent } from "src/utils/percent"
import { multiplyPriceByAmount } from "src/utils/price"
import { Currency, CurrencyAmount } from "src/utils/token"
import { unwrappedToken } from "src/utils/wrappedCurrency"
import { useAccount } from "wagmi"
import { OutlinedButton, StyledButton } from "./Styled"
import { CurrencyLogo } from "src/components/styled_components/CurrencyLogo"
import { formatAmount } from "src/utils/formatInfoNumbers"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DoubleCurrencyLogo from "src/components/styled_components/DoubleCurrencyLogo"
import { useNavigate } from "react-router-dom"
import currencyId from 'src/utils/currencyId'

interface PositionCardProps {
    pair: Pair
    setStep: (step: string) => void
    showUnwrapped?: boolean
    currency0: Currency
    currency1: Currency
    token0Deposited: CurrencyAmount<Currency>
    token1Deposited: CurrencyAmount<Currency>
    totalUSDValue: number
    userPoolBalance: CurrencyAmount<Currency>
    poolTokenPercentage: Percent
}



const useTokensDeposited = ({ pair, totalPoolTokens, userPoolBalance }) => {
    const [token0Deposited, token1Deposited] =
        !!pair &&
            !!totalPoolTokens &&
            !!userPoolBalance &&
            // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
            JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
            ? [
                pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
                pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
            ]
            : [undefined, undefined]

    return [token0Deposited, token1Deposited]
}


const useTotalUSDValue = ({ currency0, currency1, token0Deposited, token1Deposited }) => {

    // const token0Price = useUSDPrice(currency0)
    // const token1Price = useUSDPrice(currency1)

    // const token0USDValue =
    //     token0Deposited && token0Price
    //         ? multiplyPriceByAmount(token0Price, parseFloat(token0Deposited.toSignificant(6)))
    //         : null
    // const token1USDValue =
    //     token1Deposited && token1Price
    //         ? multiplyPriceByAmount(token1Price, parseFloat(token1Deposited.toSignificant(6)))
    //         : null
    // return token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null
    return 100
}


const usePoolTokenPercentage = ({ userPoolBalance, totalPoolTokens }) => {
    return !!userPoolBalance &&
        !!totalPoolTokens &&
        JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
        ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
        : undefined
}

const withLPValuesFactory =
    ({ useLPValuesHook, hookArgFn }) =>
        (Component) =>
            (props) => {
                const { address: account } = useAccount()

                const currency0 = props.showUnwrapped ? props.pair.token0 : unwrappedToken(props.pair.token0)
                const currency1 = props.showUnwrapped ? props.pair.token1 : unwrappedToken(props.pair.token1)

                const userPoolBalance = useTokenBalance(account ?? undefined, props.pair.liquidityToken)

                const totalPoolTokens = useTotalSupply(props.pair.liquidityToken)

                const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

                const args = useMemo(
                    () =>
                        hookArgFn({
                            userPoolBalance,
                            pair: props.pair,
                            totalPoolTokens,
                        }),
                    [userPoolBalance, props.pair, totalPoolTokens],
                )

                const [token0Deposited, token1Deposited] = useLPValuesHook(args)

                const totalUSDValue = useTotalUSDValue({ currency0, currency1, token0Deposited, token1Deposited })

                return (
                    <Component
                        {...props}
                        currency0={currency0}
                        currency1={currency1}
                        token0Deposited={token0Deposited}
                        token1Deposited={token1Deposited}
                        totalUSDValue={totalUSDValue}
                        userPoolBalance={userPoolBalance}
                        poolTokenPercentage={poolTokenPercentage}
                    />
                )
            }

const withLPValues = withLPValuesFactory({
    useLPValuesHook: useTokensDeposited,
    hookArgFn: ({ pair, userPoolBalance, totalPoolTokens }) => ({ pair, userPoolBalance, totalPoolTokens }),
})



function FullPositionCard({
    pair,
    setStep,
    currency0,
    currency1,
    token0Deposited,
    token1Deposited,
    totalUSDValue,
    userPoolBalance,
    poolTokenPercentage
}: PositionCardProps) {

    const { t } = useTranslation()
    const navigate = useNavigate()
    // const poolData = useLPApr(pair)
    const poolData = {
        lpApr7d: 0.45
    }

    const [showMore, setShowMore] = useState(false)
    const currencyIdA = currencyId(currency0)
    const currencyIdB = currencyId(currency1)

    return (
        <Box sx={{ display: 'flex', width: '100%', cursor: 'pointer' }}>
            <Paper sx={{
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column',
                p: '20px',
                borderRadius: '20px'
            }}
                onClick={() => setShowMore(!showMore)}
            >
                <Box display='flex' alignItems='center' justifyContent='space-between' flexGrow={1}>
                    <Box display='flex' alignItems="center" mb="4px">
                        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} />
                        <Box>
                            <Typography ml="8px" fontSize='14px'>
                                {!currency0 || !currency1 ? <span>{t('Loading...')}</span> : `${currency1.symbol}/${currency0.symbol}`}
                            </Typography>
                            <Typography fontSize="14px" textAlign='center'>
                                {userPoolBalance?.toSignificant(4)} LP
                            </Typography>
                        </Box>
                    </Box>

                    {/* {Number.isFinite(totalUSDValue) && (
                            <Typography >{`(~${totalUSDValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })} USD)`}</Typography>
                        )} */}

                    {showMore ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </Box>
                {showMore && (
                    <Box sx={{
                        mt: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        width: '100%',
                        '& > .MuiBox-root': {
                            display: 'flex',
                            flexGrow: 1,
                            justifyContent: 'space-between'
                        }
                    }}>
                        <Box >
                            <Box display='flex'>
                                <CurrencyLogo currency={currency0} />
                                <Typography color="textSubtle" ml="10px">
                                    {t('Pooled %asset%', { asset: currency0.symbol })}:
                                </Typography>
                            </Box>
                            {token0Deposited ? (
                                <Box>
                                    <Typography ml="6px">{token0Deposited?.toSignificant(6)}</Typography>
                                </Box>
                            ) : ('-')}
                        </Box>

                        <Box >
                            <Box display='flex'>
                                <CurrencyLogo currency={currency1} />
                                <Typography color="textSubtle" ml="10px">
                                    {t('Pooled %asset%', { asset: currency1.symbol })}:
                                </Typography>
                            </Box>
                            {token1Deposited ? (
                                <Box>
                                    <Typography ml="6px">{token1Deposited?.toSignificant(6)}</Typography>
                                </Box>
                            ) : ('-')}
                        </Box>

                        {poolData && (
                            <Box>
                                <Box>
                                    <Typography >
                                        {t('LP reward APR')}:
                                    </Typography>
                                </Box>
                                <Typography>{formatAmount(poolData.lpApr7d)}%</Typography>
                            </Box>
                        )}

                        <Box>
                            <Typography color="textSubtle">{t('Share in Trading Pair')}</Typography>
                            <Typography>
                                {poolTokenPercentage
                                    ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                                    : '-'}
                            </Typography>
                        </Box>

                        {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, BIG_INT_ZERO) && (
                            <Box flexDirection="column" gap={1} alignItems='center' mt={1}>
                                <StyledButton onClick={() => navigate(`/remove?currencyA=${currencyIdA}&currencyB=${currencyIdB}`)}>
                                    {t('Remove')}
                                </StyledButton>
                                <OutlinedButton onClick={() => {
                                    setStep('supply_assets')
                                    navigate(`/add?currencyA=${currencyIdA}&currencyB=${currencyIdB}`)
                                }}>

<<<<<<< HEAD
                                    {t('+ Add liquidity instead')}
=======
                                    + {t('Add liquidity instead')}
>>>>>>> 0f09354e5f02d1237ada755e69a066c117b42283
                                </OutlinedButton>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>
        </Box>
    )
}

export default withLPValues(FullPositionCard)





