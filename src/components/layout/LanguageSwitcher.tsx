"use client"

import { useI18n, localeNames, localeFlags, type Locale } from "@/lib/i18n-context"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const locales: Locale[] = ["fr", "wo", "en"]

export function LanguageSwitcher() {
    const { locale, setLocale } = useI18n()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                    <span className="text-base">{localeFlags[locale]}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
                {locales.map((loc) => (
                    <DropdownMenuItem
                        key={loc}
                        onClick={() => setLocale(loc)}
                        className={locale === loc ? "bg-primary/10 text-primary font-semibold" : ""}
                    >
                        <span className="mr-2 text-base">{localeFlags[loc]}</span>
                        {localeNames[loc]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
