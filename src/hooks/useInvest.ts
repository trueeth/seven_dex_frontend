import { useCallback, useEffect, useState } from "react"
import { parseUnits } from "@ethersproject/units"
import { Contract } from "ethers"
import ERC20 from "src/config/erc20"
import useHandleTransactionReceipt from "./useHandleTransactionReceipt"
import { Strategy, useStrategyContract } from "./useContract"
import addresses from "src/config/address"
import { DEFAULT_CHAIN_ID } from "src/config/chains"
import { AddressZero, MaxUint256 } from "@ethersproject/constants"
import { ContractCallContext, ContractCallResults } from "ethereum-multicall"
import FurfiStrategyABI from '../config/abi/strategyFurfi.json'
import StableStrategyABI from '../config/abi/strategyStable.json'
import StandardStrategyABI from '../config/abi/strategyStandard.json'
import { useAccount } from "wagmi"
import { multicall } from "src/helper/multiCall"
import { useAllTransactions } from "src/state/transactions/hooks"

export const useInvestToken = (
    strategy: Strategy,
    pair: string
) => {

    const handleTransactionReceipt = useHandleTransactionReceipt()
    const router = useStrategyContract(pair, strategy) as Contract

    const handleInvest = useCallback(
        (token: ERC20, amount: string, referrer: string) => {
            const amountBn = parseUnits(amount, 18)
            handleTransactionReceipt(
                router.depositFromToken(
                    token.address,
                    amountBn,
                    referrer ?? AddressZero,
                    [token.address],
                    [addresses.bnb[DEFAULT_CHAIN_ID]],
                    [amountBn],
                    [0],
                    10000,
                    MaxUint256
                ),
                `Invest ${amount + ' ' + token.symbol}`
            )
        },
        [handleTransactionReceipt, router]
    )
    return { onInvestToken: handleInvest }
}

export const useInvestEth = (
    strategy: Strategy,
    pair: string
) => {

    const handleTransactionReceipt = useHandleTransactionReceipt()
    const router = useStrategyContract(pair, strategy) as Contract
    const tokens = pair.split('_')
    const tokenA = addresses[tokens[0]][DEFAULT_CHAIN_ID]
    const tokenB = addresses[tokens[1]][DEFAULT_CHAIN_ID]

    const handleInvest = useCallback(
        (amount: string, referrer: string) => {
            const amountBn = parseUnits(amount, 18)
            handleTransactionReceipt(
                router.deposit(
                    referrer ?? AddressZero,
                    [addresses.bnb[DEFAULT_CHAIN_ID], addresses.bnb[DEFAULT_CHAIN_ID]],
                    [tokenA, tokenB],
                    [amountBn.div(2), amountBn.div(2)],
                    [0, 0],
                    10000,
                    MaxUint256,
                    { value: amountBn }
                ),
                `Invest ${amount + ' BNB'}`
            )
        },
        [handleTransactionReceipt, router]
    )
    return { onInvestEth: handleInvest }
}

export interface IInvestInfo {
    strategy: string
    pair: string
    amount: number
    pendingRewards: number
    reinvested: number,
    loanable: number,
    loaned: number
}

export function useInvestInfo() {

    const strategies = ['furfiStrategy', 'stableStrategy', 'standardStrategy']
    const methodNames = ['getFuriofiStrategyParticipantData', 'getStablecoinStrategyParticipantData', 'getStandardStrategyParticipantData']
    const pairs = Object.keys(addresses.stableStrategy)
    const abis = [FurfiStrategyABI, StableStrategyABI, StandardStrategyABI]

    const { address: account } = useAccount()
    const allTransactions = useAllTransactions()

    const [data, setData] = useState<IInvestInfo[]>()

    const contractCallContext: ContractCallContext[] = strategies.map((strategy, index) => {
        const callPairs: ContractCallContext[] = [];
        pairs.forEach((pair) => {
            callPairs.push({
                reference: `${strategy + '/' + pair}`,
                contractAddress: addresses[strategy][pair][DEFAULT_CHAIN_ID],
                abi: abis[index],
                calls: [{ reference: 'invest', methodName: methodNames[index], methodParameters: [account] },
                { reference: 'loan', methodName: 'getLoanParticipantData', methodParameters: [account] }]
            } as ContractCallContext)
        })

        return callPairs
    }).flatMap((callParam) => callParam)

    const fetchInvestInfo = useCallback(async () => {
        const data: ContractCallResults = await multicall.call(contractCallContext)
        const result: IInvestInfo[] = []
        if (data) {
            strategies.map((strategy) => {
                pairs.forEach((pair) => {
                    let amtInvest = data.results[`${strategy + '/' + pair}`]['callsReturnContext'][0]['returnValues'][0]
                    if (Number(amtInvest.hex) > 0) {
                        let _data = {
                            strategy,
                            pair,
                            amount: Number(amtInvest.hex) / Math.pow(10, 18),
                            pendingRewards: 0,
                            reinvested: 0,
                            loanable: 0,
                            loaned: 0
                        }
                        if (strategy === 'furfiStrategy') {
                            _data.pendingRewards = (data.results[`${strategy + '/' + pair}`]['callsReturnContext'][0]['returnValues'][2].hex) / Math.pow(10, 18)
                        } else if (strategy === 'stableStrategy') {
                            _data.reinvested = (data.results[`${strategy + '/' + pair}`]['callsReturnContext'][0]['returnValues'][2].hex) / Math.pow(10, 18)
                        } else if (strategy === 'standardStrategy') {
                            _data.pendingRewards = (data.results[`${strategy + '/' + pair}`]['callsReturnContext'][0]['returnValues'][3].hex) / Math.pow(10, 18)
                            _data.reinvested = (data.results[`${strategy + '/' + pair}`]['callsReturnContext'][0]['returnValues'][4].hex) / Math.pow(10, 18)
                        }
                        _data.loanable = (data.results[`${strategy + '/' + pair}`]['callsReturnContext'][1]['returnValues'][0].hex) / Math.pow(10, 18)
                        _data.loaned = (data.results[`${strategy + '/' + pair}`]['callsReturnContext'][1]['returnValues'][1].hex) / Math.pow(10, 18)
                        result.push(_data)
                    }
                })
            })
        }
        setData(result)
    }, [contractCallContext, account])

    useEffect(() => {
        if (account)
            fetchInvestInfo().catch(err => console.log('Failed to fetch the invest info'))
    }, [fetchInvestInfo, account, allTransactions])

    return { investData: data }
}

export function useInvest(
    strategy: string,
    pair: string
) {

    const _strategy = (strategy === 'furfiStrategy') ? Strategy.Furfi : (strategy === 'stableStrategy') ? Strategy.Stable : Strategy.Standard

    const handleTransactionReceipt = useHandleTransactionReceipt()
    const router = useStrategyContract(pair, _strategy) as Contract

    const tokens = pair.split('_')
    const tokenA = addresses[tokens[0]][DEFAULT_CHAIN_ID]
    const tokenB = addresses[tokens[1]][DEFAULT_CHAIN_ID]

    const claimRewards = useCallback(() => {
        if (strategy === 'stableStrategy')
            return;
        else if (strategy === 'furfiStrategy') {
            handleTransactionReceipt(
                router.furiofiStrategyClaimFurFi(),
                'Claim Furfi rewards'
            )
        }
        else if (strategy === 'standardStrategy') {
            handleTransactionReceipt(
                router.getStandardStrategyFurFiRewards(),
                'Claim Furfi rewards'
            )
        }
    }, [handleTransactionReceipt, router])

    const withdrawETH = useCallback(
        (amount: string) => {
            const amountBn = parseUnits(amount, 18)
            handleTransactionReceipt(
                router.withdraw(
                    amountBn,
                    [tokenA, tokenB],
                    [addresses.bnb[DEFAULT_CHAIN_ID], addresses.bnb[DEFAULT_CHAIN_ID]],
                    [amountBn.div(2), amountBn.div(2)],
                    [0, 0],
                    10000,
                    MaxUint256
                ),
                `Withdraw ${amount + ' BNB '}`
            )
        }, [handleTransactionReceipt, router])

    const loan = useCallback(() => {
        handleTransactionReceipt(
            router.loan(),
            'Loan Furfi token'
        )
    }, [handleTransactionReceipt, router])

    return { claimRewards, loan, withdrawETH }
}