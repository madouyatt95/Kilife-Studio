"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Film, User, Search, BookOpen, UserCircle, LogOut, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import { useI18n } from "@/lib/i18n-context"

export function TopBar() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const { t } = useI18n()

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")

    if (isAuthPage) return null

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 glass">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <Film className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
                            Kilife Studio
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
                        <Link href="/castings" className="text-slate-300 hover:text-white transition-colors">{t("nav.castings")}</Link>
                        <Link href="/talents" className="text-slate-300 hover:text-white transition-colors">{t("nav.talents")}</Link>
                        <Link href="/films" className="text-slate-300 hover:text-white transition-colors">{t("nav.films")}</Link>
                        <Link href="/academie" className="text-slate-300 hover:text-white transition-colors">{t("nav.academy")}</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <LanguageSwitcher />
                    <nav className="flex items-center space-x-2">
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10 border border-primary/20">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${session.user.email}`} alt={session.user.email || ""} />
                                            <AvatarFallback><UserCircle className="h-6 w-6" /></AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{t("nav.myAccount")}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard"><User className="mr-2 h-4 w-4" /> {t("nav.dashboard")}</Link>
                                    </DropdownMenuItem>
                                    {session.user.roles?.includes("ADMIN") && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin"><Settings className="mr-2 h-4 w-4" /> {t("nav.admin")}</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" /> {t("nav.logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex space-x-2">
                                <Button variant="ghost" asChild>
                                    <Link href="/login">{t("nav.login")}</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/register">{t("nav.register")}</Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
