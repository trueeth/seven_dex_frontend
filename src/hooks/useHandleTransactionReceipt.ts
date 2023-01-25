import { useCallback } from 'react';
import { TransactionResponse } from '@ethersproject/providers';
import { useTransactionAdder } from '../state/transactions/hooks';
import { useAddPopup } from '../state/application/hooks';
import { toast } from 'react-toastify';

function useHandleTransactionReceipt(): (promise: Promise<TransactionResponse>, summary: string) => void {

    const addTransaction = useTransactionAdder();
    const addPopup = useAddPopup();

    let toastId: any;

    return useCallback(
        (promise: Promise<TransactionResponse>, summary: string) => {
            toastId = toast(summary, { autoClose: false });
            promise
                .then((tx) => {
                    addTransaction(tx, { summary })
                    toast.update(toastId, { render: "Transaction was successfully sent", type: toast.TYPE.INFO, autoClose: 2000 });
                })
                .catch((err) => {
                    toast.update(toastId, { render: "User declined transaction", type: toast.TYPE.ERROR, autoClose: 2000 });
                    if (err.message.includes('User denied')) {
                        //User denied transaction signature on MetaMask.
                        return;
                    }
                    const message = `Unable to ${summary[0].toLowerCase()}${summary.slice(1)}`;
                    addPopup({ error: { message, stack: err.message || err.stack } });
                });
        },
        [addPopup, addTransaction],
    );
}

export default useHandleTransactionReceipt;
