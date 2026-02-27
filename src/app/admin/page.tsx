"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Video, GraduationCap, DollarSign, TrendingUp, AlertCircle } from "lucide-react"

export default function AdminDashboardPage() {

    // Dummy data for the V1 Demo
    const stats = [
        { title: "Talents Inscrits", value: "1,245", change: "+12%", icon: Users, alert: 45 },
        { title: "Appels à Casting", value: "34", change: "+4", icon: Video, alert: 0 },
        { title: "Étudiants Académie", value: "892", change: "+24%", icon: GraduationCap, alert: 0 },
        { title: "Revenus (Mensuel)", value: "2.4M CFA", change: "+8%", icon: DollarSign, alert: 0 },
    ]

    const recentProfiles = [
        { name: "Fatou Ndiaye", role: "Actrice", status: "PENDING_REVIEW", date: "Aujourd'hui" },
        { name: "Moussa Sène Studio", role: "PRO", status: "PENDING_REVIEW", date: "Hier" },
        { name: "Awa Fall", role: "Actrice", status: "APPROVED", date: "Hier" },
    ]

    return (
        <div className="space-y-8 max-w-6xl">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Tableau de Bord</h1>
                <p className="text-muted-foreground mt-1">Vue d'ensemble de l'activité sur Ciné Sénégal.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card key={i} className="bg-slate-900 border-white/5">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
                                <Icon className="h-4 w-4 text-slate-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="flex justify-between items-center mt-1 text-xs">
                                    <span className="text-green-500 flex items-center font-medium"><TrendingUp className="h-3 w-3 mr-1" />{stat.change}</span>
                                    {stat.alert > 0 && (
                                        <span className="text-orange-400 flex items-center font-medium"><AlertCircle className="h-3 w-3 mr-1" />{stat.alert} en attente</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                {/* Validations en attente */}
                <Card className="md:col-span-4 bg-slate-900 border-white/5">
                    <CardHeader>
                        <CardTitle>Profils en attente de validation</CardTitle>
                        <CardDescription>
                            Le Registre National requiert une validation manuelle des CV et vidéos de démo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentProfiles.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.role} • Inscrit {p.date}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {p.status === "PENDING_REVIEW" ? (
                                            <span className="inline-flex items-center rounded-full bg-orange-400/10 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
                                                À vérifier
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-500">
                                                Approuvé
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Dernières transactions */}
                <Card className="md:col-span-3 bg-slate-900 border-white/5">
                    <CardHeader>
                        <CardTitle>Activités Récentes</CardTitle>
                        <CardDescription>Paiements et abonnements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="space-y-1 flex-1">
                                        <p className="text-sm font-medium leading-none text-white">Abonnement PRO Premium</p>
                                        <p className="text-xs text-muted-foreground">Studio X a souscrit via Wave</p>
                                    </div>
                                    <div className="text-sm font-medium text-green-400">
                                        + 50k CFA
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
