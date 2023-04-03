import useToast from 'src/hooks/useToast'
import { ToastContainer } from 'src/components/toast'


const ToastListener = () => {
    const { toasts, remove } = useToast()

    const handleRemove = (id: string) => remove(id)

    return <ToastContainer toasts={toasts} onRemove={handleRemove} />
}

export default ToastListener




