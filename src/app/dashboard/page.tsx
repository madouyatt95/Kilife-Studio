"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, ClipboardList, Clapperboard, ChevronRight, Star } from "lucide-react"

export default function DashboardPage() {
    const { data: session } = useSession()

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Bienvenue, <span className="text-primary">{session?.user?.email?.split('@')[0]}</span>
                </h1>
                <p className="text-muted-foreground">
                    Gérez vos projets, vos candidatures et votre profil professionnel.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-slate-900 border-white/5 hover:border-primary/50 transition-colors group">
                    <CardHeader>
                        <User className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>Mon Profil</CardTitle>
                        <CardDescription>Mettez à jour vos informations et votre bande démo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href="/dashboard/profile">
                                Modifier le profil <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-white/5 hover:border-primary/50 transition-colors group">
                    <CardHeader>
                        <ClipboardList className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>Candidatures</CardTitle>
                        <CardDescription>Suivez l'état de vos postulations aux castings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href="/dashboard/applications">
                                Mes postulations <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-white/5 hover:border-primary/50 transition-colors group">
                    <CardHeader>
                        <Clapperboard className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>Castings Pro</CardTitle>
                        <CardDescription>Publiez et gérez vos propres appels à casting.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href="/dashboard/castings">
                                Gérer mes castings <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Star className="h-32 w-32 text-primary" />
                </div>
                <CardHeader>
                    <CardTitle className="text-xl">Conseil du Moment</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                    <p className="text-slate-300 max-w-2xl">
                        Un profil complété à 100% avec une bande démo de qualité augmente vos chances d'être sélectionné par 40%. Prenez le temps de soigner votre présentation vidéo !
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
