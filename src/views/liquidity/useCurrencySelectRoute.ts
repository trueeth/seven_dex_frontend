import { Currency, SVC_TESTNET } from '@/utils/token'
import useNativeCurrency from '@/hooks/useNativeCurrency'
import { useCallback } from 'react'
import currencyId from '@/utils/currencyId'
import { useNavigate, useSearchParams } from 'react-router-dom'


export const useCurrencySelectRoute = () => {
    const native = useNativeCurrency()
    const navigate = useNavigate()

    const [searchParams,] = useSearchParams()
    const currencyIdA = searchParams.get('currencyA') ?? native.symbol
    const currencyIdB = searchParams.get('currencyB') ?? SVC_TESTNET.address


    const handleCurrencyASelect = useCallback(
        (currencyA_: Currency) => {
            const newCurrencyIdA = currencyId(currencyA_)
            if (newCurrencyIdA !== currencyIdB)
                navigate(`/add?currencyA=${newCurrencyIdA}&currencyB=${currencyIdB}`)
        },
        [currencyIdB, currencyIdA],
    )
    const handleCurrencyBSelect = useCallback(
        (currencyB_: Currency) => {
            const newCurrencyIdB = currencyId(currencyB_)
            if (newCurrencyIdB !== currencyIdA) {
                navigate(`/add?currencyA=${currencyIdA}&currencyB=${newCurrencyIdB}`)
            }
        },
        [currencyIdA, currencyIdB, native],
    )

    return {
        handleCurrencyASelect,
        handleCurrencyBSelect,
    }
}
