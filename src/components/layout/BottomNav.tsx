"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Clapperboard, GraduationCap, LayoutDashboard } from "lucide-react"

export function BottomNav() {
    const pathname = usePathname()

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
    if (isAuthPage) return null

    const navItems = [
        { label: "Accueil", href: "/", icon: Home },
        { label: "Talents", href: "/talents", icon: Search },
        { label: "Castings", href: "/castings", icon: Clapperboard },
        { label: "Académie", href: "/academie", icon: GraduationCap },
        { label: "Gérer", href: "/dashboard", icon: LayoutDashboard },
    ]

    return (
        <div className="fixed bottom-0 z-50 w-full border-t border-white/10 glass sm:hidden pb-safe">
            <nav className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
