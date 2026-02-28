"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

import fr from "@/locales/fr.json"
import wo from "@/locales/wo.json"
import en from "@/locales/en.json"

export type Locale = "fr" | "wo" | "en"

const dictionaries: Record<Locale, Record<string, any>> = { fr, wo, en }

export const localeNames: Record<Locale, string> = {
    fr: "Français",
    wo: "Wolof",
    en: "English"
}

export const localeFlags: Record<Locale, string> = {
    fr: "🇫🇷",
    wo: "🇸🇳",
    en: "🇬🇧"
}

interface I18nContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
}

const I18nContext = createContext<I18nContextType>({
    locale: "fr",
    setLocale: () => { },
    t: (key: string) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("fr")

    useEffect(() => {
        const saved = localStorage.getItem("kilife-lang") as Locale | null
        if (saved && dictionaries[saved]) {
            setLocaleState(saved)
            document.documentElement.lang = saved
        }
    }, [])

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem("kilife-lang", newLocale)
        document.documentElement.lang = newLocale
    }, [])

    const t = useCallback((key: string): string => {
        const keys = key.split(".")
        let value: any = dictionaries[locale]
        for (const k of keys) {
            value = value?.[k]
        }
        if (typeof value === "string") return value
        // Fallback to French
        let fallback: any = dictionaries["fr"]
        for (const k of keys) {
            fallback = fallback?.[k]
        }
        return typeof fallback === "string" ? fallback : key
    }, [locale])

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useI18n() {
    return useContext(I18nContext)
}
