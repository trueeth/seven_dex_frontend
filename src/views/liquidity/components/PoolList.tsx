import {
    Box,
    Container,
    InputAdornment,
    OutlinedInput,
    Pagination,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Tabs
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import useDebounce from '@/hooks/useDebounce'
import { isAddress } from '@/utils'
import { FixedSizeList } from 'react-window'
import { useTrackedTokenPairs } from '@/state/user/hooks'
import { visuallyHidden } from '@mui/utils'
import { styled } from '@mui/system'
import { ERC20Token, WMATIC } from '@/utils/token'
import { trim } from '@/utils/trim'
import { PINNED_PAIRS } from '@/config/constants/exchange'
import { ChainId } from '@/config/constants/chains'
import { useNavigate } from 'react-router-dom'
import currencyId from '@/utils/currencyId'

const DEFAULT_ORDER = 'asc'
const DEFAULT_ORDER_BY = 'liquidity'

const PoolList = () => {
    const [poolType, setPoolType] = React.useState('main')
    const handleChange = (event: any, newValue: string) => {
        setPoolType(newValue)
    }

    const [page, setPage] = React.useState(1)
    const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    useEffect(() => {
        setPage(1)
    }, [poolType])

    // refs for fixed size lists
    const fixedList = useRef<FixedSizeList>()

    const [searchQuery, setSearchQuery] = useState<string>('')

    const [order, setOrder] = useState<Order>(DEFAULT_ORDER)
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)

    const [tableRow, setTableRow] = useState<any[] | null>(null)
    const navigate = useNavigate()

    const debouncedQuery = useDebounce(searchQuery, 200)

    const handleInput = useCallback((event) => {
        const input = event.target.value
        const checksummedInput = isAddress(input)
        setSearchQuery(checksummedInput || input)
        fixedList.current?.scrollTo(0)
    }, [])

    const allPairs = useTrackedTokenPairs()
    const pairs = useMemo(() => (poolType === 'main' ? PINNED_PAIRS[ChainId.MUMBAI] : allPairs), [poolType, allPairs])
    const filteredPairs = useMemo(
        () =>
            pairs.filter(
                (pair) =>
                    pair[0].name.indexOf(debouncedQuery) >= 0 ||
                    pair[0].symbol.indexOf(debouncedQuery) >= 0 ||
                    pair[0].address.indexOf(debouncedQuery) >= 0 ||
                    pair[1].name.indexOf(debouncedQuery) >= 0 ||
                    pair[1].symbol.indexOf(debouncedQuery) >= 0 ||
                    pair[1].address.indexOf(debouncedQuery) >= 0 ||
                    pair[0].name.toLowerCase().indexOf(debouncedQuery) >= 0 ||
                    pair[0].symbol.toLowerCase().indexOf(debouncedQuery) >= 0 ||
                    pair[0].address.toLowerCase().indexOf(debouncedQuery) >= 0 ||
                    pair[1].name.toLowerCase().indexOf(debouncedQuery) >= 0 ||
                    pair[1].symbol.toLowerCase().indexOf(debouncedQuery) >= 0 ||
                    pair[1].address.toLowerCase().indexOf(debouncedQuery) >= 0
            ),
        [debouncedQuery, poolType]
    )

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1
        }
        if (b[orderBy] > a[orderBy]) {
            return 1
        }
        return 0
    }

    type Order = 'asc' | 'desc'

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key
    ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy)
    }

    function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array?.map((el, index) => [el, index] as [T, number])
        stabilizedThis?.sort((a, b) => {
            const order = comparator(a[0], b[0])
            if (order !== 0) {
                return order
            }
            return a[1] - b[1]
        })
        return stabilizedThis?.map((el) => el[0])
    }

    const handleRequestSort = useCallback(
        (event: React.MouseEvent<unknown>, newOrderBy: any) => {
            const isAsc = orderBy === newOrderBy && order === 'asc'
            const toggledOrder = isAsc ? 'desc' : 'asc'
            setOrder(toggledOrder)
            setOrderBy(newOrderBy)
            const data = formatPair(filteredPairs)
            if (data) {
                const sortedRows = stableSort(data, getComparator(toggledOrder, newOrderBy))
                setTableRow(sortedRows)
            }
        },
        [order, orderBy, poolType]
    )

    const createSortHandler = (newOrderBy: any) => (event: React.MouseEvent<unknown>) => {
        // console.log({ event, newOrderBy });
        handleRequestSort(event, newOrderBy)
    }

    const formatPair = (pairs: Array<[ERC20Token, ERC20Token]>) => {
        const data = pairs.map((pair) => {
            return {
                name: `${pair[0].symbol}-${pair[1].symbol}`,
                logoA: pair[0].logoURI,
                logoB: pair[1].logoURI,
                currencyIdA: currencyId(pair[0]),
                currencyIdB: currencyId(pair[1]),
                liquidity: Number(trim(Math.random() * 10000, 3)),
                volumn: Number(trim(Math.random() * 100, 3)),
                fee: 0.25,
                apr: Number(trim(Math.random() * 25, 3))
            }
        })
        return data
    }

    useEffect(() => {
        const data = formatPair(filteredPairs)
        if (data) {
            const sortedRows = stableSort(data, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY))
            setTableRow(sortedRows)
        }
    }, [filteredPairs, poolType])

    return (
        <Container sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <Tabs
                    value={poolType}
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
                    <Tab value="main" label="Main Pools" disableRipple />
                    <Tab value="all" label="All Pools" disableRipple />
                </Tabs>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
                    <OutlinedInput
                        onChange={(e) => handleInput(e)}
                        placeholder="Search by a name, symbol or address"
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        sx={{
                            width: '100%',
                            color: '#333',
                            bgcolor: 'none',
                            borderRadius: '10px',
                            '& fieldset': {
                                borderColor: '#eee !important'
                            },
                            '& input': {
                                p: '10px 15px'
                            }
                        }}
                    />
                </Box>
            </Box>
            <Box sx={{ py: 3 }}>
                <TableContainer>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>POOL NAME</TableCell>
                                <TableCell sortDirection={orderBy === 'liquidity' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'liquidity'}
                                        direction={orderBy === 'liquidity' ? order : 'asc'}
                                        onClick={createSortHandler('liquidity')}
                                    >
                                        LIQUIDITY
                                        {orderBy === 'liquidity' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={orderBy === 'volumn' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'volumn'}
                                        direction={orderBy === 'volumn' ? order : 'asc'}
                                        onClick={createSortHandler('volumn')}
                                    >
                                        VOLUMN(24H)
                                        {orderBy === 'volumn' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={orderBy === 'fee' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'fee'}
                                        direction={orderBy === 'fee' ? order : 'asc'}
                                        onClick={createSortHandler('fee')}
                                    >
                                        FEES
                                        {orderBy === 'fee' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={orderBy === 'apr' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'apr'}
                                        direction={orderBy === 'apr' ? order : 'asc'}
                                        onClick={createSortHandler('apr')}
                                    >
                                        APR
                                        {orderBy === 'apr' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <CustomTableBody>
                            {tableRow?.map((pair: any, index) => {
                                if (page * 5 >= index + 1 && index + 1 > (page - 1) * 5)
                                    return (
                                        <StyledTableRow
                                            key={index}
                                            onClick={() => {
                                                if (pair.currencyIdA === WMATIC[ChainId.MUMBAI].address)
                                                    navigate(`/add?currencyA=MATIC&currencyB=${pair.currencyIdB}`)
                                                else if (pair.currencyIdB === WMATIC[ChainId.MUMBAI].address)
                                                    navigate(`/add?currencyA=${pair.currencyIdA}&currencyB=MATIC`)
                                                else
                                                    navigate(
                                                        `/add?currencyA=${pair.currencyIdA}&currencyB=${pair.currencyIdB}`
                                                    )
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <span>
                                                        <img
                                                            src={pair.logoA}
                                                            style={{ width: '24px', height: '24px' }}
                                                            alt="logoA"
                                                        />
                                                        <img
                                                            src={pair.logoB}
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                marginLeft: '-5px'
                                                            }}
                                                            alt="logoA"
                                                        />
                                                    </span>
                                                    {pair.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{pair.liquidity}</TableCell>
                                            <TableCell>{pair.volumn}</TableCell>
                                            <TableCell>{pair.fee}</TableCell>
                                            <TableCell>{pair.apr}</TableCell>
                                        </StyledTableRow>
                                    )
                            })}
                        </CustomTableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <Pagination
                        count={Math.ceil(tableRow ? tableRow.length / 5 : 1)}
                        page={page}
                        onChange={onPageChange}
                    />
                </Box>
            </Box>
        </Container>
    )
}

const TableContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    overflowX: 'auto',
    '.MuiTableCell-root': {
        whiteSpace: 'nowrap',
        fontSize: '12px',
        padding: '2.5px 10px !important'
    }
}))

const CustomTableBody = styled(TableBody)(({ theme }) => ({
    '.MuiTableCell-root': {
        color: 'blank'
    }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    height: 60,
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    },
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'white'
    }
}))

export default PoolList
