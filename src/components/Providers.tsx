"use client"

import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { I18nProvider } from "@/lib/i18n-context"

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <I18nProvider>
                    {children}
                </I18nProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
}
