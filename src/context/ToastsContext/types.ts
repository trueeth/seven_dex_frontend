import { ReactNode } from "react"

export const types = {
    SUCCESS: "success",
    DANGER: "danger",
    WARNING: "warning",
    INFO: "info",
}

export type Types = (typeof types)[keyof typeof types];


export interface Toast {
    id: string;
    type: Types;
    title: string;
    description?: ReactNode;
}


type ToastSignature = (title: Toast['title'], description?: Toast['description']) => void

export interface ToastContextApi {
    toasts: Toast[]
    clear: () => void
    remove: (id: string) => void
    toastError: ToastSignature
    toastInfo: ToastSignature
    toastSuccess: ToastSignature
    toastWarning: ToastSignature
}
