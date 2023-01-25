import { useCallback, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useAccount } from 'wagmi'
import ERC20 from 'src/config/erc20';
import useRefresh from './useRefresh';
import { useAllTransactions } from 'src/state/transactions/hooks';


const useAllowance = (token: ERC20, spender: string, pendingApproval?: boolean) => {
    const [allowance, setAllowance] = useState<BigNumber | null>(null);
    const { address: account } = useAccount();
    const { fastRefresh } = useRefresh()
    const allTransactions = useAllTransactions()

    const fetchAllowance = useCallback(async () => {
        if (account) {
            const allowance = await token.allowance(account, spender);
            setAllowance(allowance);
        }
    }, [account, spender, token]);

    useEffect(() => {
        if (account && spender && token) {
            fetchAllowance().catch((err) => console.log(`Failed to fetch allowance: ${err.stack}`));
        }
    }, [account, spender, token, pendingApproval, fetchAllowance, allTransactions, fastRefresh]);

    return allowance;
};

export default useAllowance;


