"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, FileVideo, GraduationCap, DollarSign, Activity, FileText } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/login")
        }
    })

    if (status === "loading") {
        return <div className="p-8 text-center">Chargement...</div>
    }

    if (session?.user?.roles && !session.user.roles.includes("ADMIN")) {
        redirect("/")
    }

    const menu = [
        { name: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
        { name: "Utilisateurs & Profils", href: "/admin/users", icon: Users },
        { name: "Castings", href: "/admin/castings", icon: FileVideo },
        { name: "Académie", href: "/admin/academy", icon: GraduationCap },
        { name: "Finance & Abonnements", href: "/admin/finance", icon: DollarSign },
        { name: "Actualités & Films", href: "/admin/media", icon: FileText },
        { name: "Logs d'Audit", href: "/admin/audit", icon: Activity },
    ]

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-950">
            {/* Sidebar Admin */}
            <aside className="w-full md:w-64 bg-slate-900 border-r border-white/10 shrink-0">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-white tracking-tight">Back-Office Admin</h2>
                    <p className="text-xs text-muted-foreground mt-1">Gouvernance Ciné Sénégal</p>
                </div>
                <nav className="space-y-1 px-3">
                    {menu.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <Icon className="mr-3 h-5 w-5 opacity-70" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
