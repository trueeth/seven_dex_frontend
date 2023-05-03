import { LanguageContext } from '@/context/Localization'
import { useContext } from 'react'

export const useCurrentLanguage = () => {
    let language
    if (LanguageContext) {
        const { currentLanguage } = useContext(LanguageContext)
        language = currentLanguage
    }
    return language?.locale || 'en-US'
}
