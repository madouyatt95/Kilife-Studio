"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardApplicationsPage() {
    const { data: session } = useSession()

    if (session?.user?.roles && !session.user.roles.includes("ACTOR")) {
        return <div className="p-8 text-center text-red-500">Accès réservé aux talents et acteurs.</div>
    }

    // Dans la réalité: on fetch() /api/applications/me
    const mockApplications: any[] = []

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Mes Candidatures</h1>
                <p className="text-muted-foreground">Suivez vos postulations aux appels à casting.</p>
            </div>

            <div className="space-y-4">
                {mockApplications.length === 0 ? (
                    <Card className="bg-slate-900 border-white/5 border-dashed border-2">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <p>Vous n'avez pas encore postulé à un casting.</p>
                            <p className="text-sm mt-2">Visitez la page "Castings" pour trouver une opportunité.</p>
                        </CardContent>
                    </Card>
                ) : (
                    mockApplications.map((app, i) => (
                        <Card key={i} className="bg-slate-900 border-white/10">
                            <CardHeader className="py-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">{app.casting.titre}</CardTitle>
                                    <Badge variant="outline">{app.status}</Badge>
                                </div>
                                <CardDescription>Envoyé le {new Date(app.createdAt).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
