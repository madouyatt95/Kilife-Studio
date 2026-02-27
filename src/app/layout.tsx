import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { TopBar } from "@/components/layout/TopBar"
import { BottomNav } from "@/components/layout/BottomNav"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kilife Studio | Registre et Castings",
  description: "Plateforme nationale des professionnels du cinéma. Talents, Castings, et Académie.",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#101317", // Very dark background matching root globals.css
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} min-h-screen pb-16 sm:pb-0`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <TopBar />
            <main className="flex-1">
              {children}
            </main>
            <BottomNav />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
