import React, { useCallback, useMemo, useRef, useState } from 'react'

import { Box, Modal, Tabs, Tab, Typography, OutlinedInput, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from '@/context/Localization'
import { useAllTokens } from '@/hooks/Tokens'
import { isAddress } from '@ethersproject/address'
import { FixedSizeList } from 'react-window'
import useDebounce from '@/hooks/useDebounce'
import { createFilterToken } from '@/utils/filtering'
import { Currency, NATIVE, Token } from '@/utils/token'
import { DEFAULT_CHAIN_ID } from '@/config/constants/chains'
import useNativeCurrency from '@/hooks/useNativeCurrency'
import { useAllTokenBalances, useCurrencyBalance, useNativeBalances } from '@/state/wallet/hooks'
import { useAccount } from 'wagmi'


const modalStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    bgcolor: 'rgb(255, 231, 172)',
    boxShadow: 24,
    borderRadius: '20px',
    '& .MuiTypography-root': {
        color: '#333'
    },
    '& .subText': {
        color: '#bbb'
    },
    '@media(max-width:450px)': {
        width: '95%',
        height: '90vh'
    }
}


function CurrencyRow({ token, onSelect, balance }) {

    return (

        <Box
            onClick={onSelect}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: '#eee'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <img src={token.logoURI} style={{ width: '28px', height: '28px' }} />
                <Box px={1}>
                    <Typography sx={{ fontSize: '16px' }}>{token.symbol}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{token.name}</Typography>
                </Box>
            </Box>
            <Box>
                <Typography sx={{ fontSize: '16px', mr: 3 }}>{balance}</Typography>
            </Box>
        </Box>
    )
}

function TokenSelectModal({ open, onClose, onCurrencySelect }) {

    const [value, setValue] = React.useState('one')

    const { address } = useAccount()
    const nativeCurrency = useNativeCurrency()
    const allTokens = useAllTokens()
    const allTokenBalances = useAllTokenBalances()
    const nativeBalance = useCurrencyBalance(address ?? undefined, nativeCurrency)

    const handleChange = (event: any, newValue: string) => {
        setValue(newValue);
    }

    const { t } = useTranslation()

    // refs for fixed size lists
    const fixedList = useRef<FixedSizeList>()

    const [searchQuery, setSearchQuery] = useState<string>('')
    const debouncedQuery = useDebounce(searchQuery, 200)

    const handleInput = useCallback((event) => {
        const input = event.target.value
        const checksummedInput = isAddress(input)
        setSearchQuery(checksummedInput || input)
        fixedList.current?.scrollTo(0)
    }, [])

    const filteredTokens: Token[] = useMemo(() => {
        const filterToken = createFilterToken(debouncedQuery)
        return Object.values(allTokens).filter(filterToken)
    }, [allTokens, debouncedQuery])

    const handleCurrencySelect = useCallback(
        (currency: Currency) => {
            onCurrencySelect(currency)
        }, [onCurrencySelect])

    return (
        <Modal
            open={open}
            sx={{
                "& > .MuiBackdrop-root": {
                    backdropFilter: "blur(10px)"
                }
            }}
        >
            <Box sx={{ ...modalStyle }}>
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    sx={{ mt: 4, mb: 1, px: 4 }}
                >
                    <Typography sx={{ fontSize: '20px' }}>{t('Select a token')}</Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItem: 'center',
                        justifyContent: 'center',
                        bgcolor: '#fff',
                        borderRadius: '9999px',
                        p: 1
                    }}>
                        <CloseIcon
                            sx={{ width: '20px', height: '20px', color: '#333', cursor: 'pointer' }}
                            onClick={onClose}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <OutlinedInput
                        onChange={(e) => handleInput(e)}
                        placeholder='Search by a name, symbol or address'
                        startAdornment={<InputAdornment position='start'>
                            <SearchIcon />
                        </InputAdornment>}
                        sx={{
                            width: '90%',
                            color: '#333',
                            bgcolor: '#fff',
                            borderRadius: '10px',
                            '& fieldset': {
                                borderColor: '#ffae5a !important'
                            },
                            '& input': {
                                p: '10px 15px'
                            }
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        sx={{
                            '& .Mui-selected': {
                                color: '#333 !important',
                                bgcolor: '#fff',
                                borderTopLeftRadius: '20px',
                                borderTopRightRadius: '20px'
                            },
                            '& .MuiTabs-indicator': {
                                background: 'none'
                            }
                        }}
                    >
                        <Tab value="one" label="Wallet Tokens" disableRipple />
                        <Tab value="two" label="Polygon" disableRipple />
                        <Tab value="three" label="Large Cap" disableRipple />
                        <Tab value="four" label="Stable Coins" disableRipple />
                    </Tabs>
                </Box>
                <Box sx={{
                    bgcolor: '#fff',
                    height: '400px',
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px'
                }}>
                    <CurrencyRow
                        token={NATIVE[DEFAULT_CHAIN_ID]}
                        onSelect={() => {
                            handleCurrencySelect(nativeCurrency)
                            onClose()
                        }}
                        balance={nativeBalance?.toSignificant() ?? 0}
                    />
                    {
                        filteredTokens.map((token, index) => (
                            <CurrencyRow
                                key={index}
                                token={token}
                                onSelect={() => {
                                    handleCurrencySelect(token)
                                    onClose()
                                }}
                                balance={allTokenBalances?.[token.address]?.toSignificant() ?? 0}
                            />
                        ))
                    }
                </Box>
            </Box>
        </Modal>
    )
}

export default TokenSelectModal
