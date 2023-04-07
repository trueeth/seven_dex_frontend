import { createContext } from "react"
import { DataContextApi } from "./types"
import axios from 'axios'
import { BACKEND_URL } from "src/config/constants"
import useSWR from 'swr'


export const DataContext = createContext<DataContextApi | undefined>(undefined)

export const DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const fetcher = async (url: string) => {
        const data = await axios.get(BACKEND_URL + url)
        return data
    }

    const { data: tokenPrices } = useSWR('api/getPrice', fetcher)

    return (
        <DataContext.Provider value={{ tokenPrices }}>
            {children}
        </DataContext.Provider>
    )
}