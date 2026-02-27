"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, FileText, Download, ShieldCheck, Lock } from "lucide-react"
import { toast } from "sonner"

export default function ProDocumentsPage() {
    const { data: session } = useSession()
    const [generating, setGenerating] = useState<string | null>(null)
    const [isPremium, setIsPremium] = useState<boolean | null>(null)

    useEffect(() => {
        const checkPremium = async () => {
            try {
                const res = await fetch("/api/auth/session")
                const data = await res.json()
                // Assuming session.user will include subscriptionPlan correctly when fetched fresh
                // In a real Server Component this would be `await prisma.user...`
                // But since "use client", we fetch profile or depend on session if updated.
                // For demonstration, we simulate checking user subscription:
                setIsPremium(session?.user?.subscriptionPlan === "PRO_SUBSCRIPTION")
            } catch (e) {
                console.error(e)
            }
        }
        if (session) checkPremium()
    }, [session])

    if (session?.user?.roles && !session.user.roles.includes("PRO")) {
        return <div className="p-8 text-center text-red-500">Accès réservé aux Professionnels.</div>
    }

    if (isPremium === false) {
        return (
            <div className="container py-24 max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-primary/20 flex items-center justify-center rounded-full">
                    <Lock className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Fonctionnalité Premium</h1>
                <p className="text-muted-foreground max-w-xl text-lg">
                    Le générateur automatisé de contrats d'engagement et de cessions de droit à l'image est un outil exclusif réservé aux abonnés PRO Premium.
                </p>
                <Button size="lg" className="mt-4" onClick={() => window.location.href = "/dashboard/profile"}>
                    Mettre à niveau (10 000 FCFA/mois)
                </Button>
            </div>
        )
    }

    // Mock data for demonstration - in reality, fetch applicants with SHORTLISTED/ACCEPTED status for the Pro's castings
    const applicants = [
        {
            id: "fake_app_1",
            actorName: "Moussa Diop",
            castingTitle: "Série Les Bracelets Rouges",
            role: "Rôle Principal (Kader)",
            status: "ACCEPTED",
        },
        {
            id: "fake_app_2",
            actorName: "Awa Fall",
            castingTitle: "Court-Métrage - Le Puits",
            role: "Figuration",
            status: "SHORTLISTED",
        }
    ]

    const handleGeneratePDF = async (applicationId: string, type: "ENGAGEMENT" | "IMAGE_RIGHTS") => {
        try {
            setGenerating(`${applicationId}-${type}`)

            const req = await fetch("/api/pro/documents/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId, type })
            })

            if (!req.ok) {
                const errorData = await req.json()
                throw new Error(errorData.error || "Erreur de génération")
            }

            // Convert Response to Blob to trigger download in browser
            const blob = await req.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `CineSenegal_${type}_${applicationId}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)

            toast.success("Document généré avec succès")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setGenerating(null)
        }
    }

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                        Générateur de Contrats
                    </h1>
                    <p className="text-muted-foreground">
                        Sécurisez vos productions juridiquement. Générez des contrats d'engagement et des cessions de droit à l'image pré-remplis en un clic.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Talents Sélectionnés ({applicants.length})</h2>

                {applicants.map((app) => (
                    <Card key={app.id} className="bg-slate-900 border-white/10">
                        <CardHeader className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg text-primary">{app.actorName}</CardTitle>
                                <CardDescription className="mt-1">
                                    <span className="font-semibold text-slate-300">{app.castingTitle}</span>
                                    <br />Pour le rôle : {app.role}
                                </CardDescription>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGeneratePDF(app.id, "IMAGE_RIGHTS")}
                                    disabled={generating === `${app.id}-IMAGE_RIGHTS`}
                                    className="w-full sm:w-auto text-xs"
                                >
                                    {generating === `${app.id}-IMAGE_RIGHTS` ? "Création..." : (
                                        <><FileText className="w-4 h-4 mr-2" /> Droit à l'Image</>
                                    )}
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleGeneratePDF(app.id, "ENGAGEMENT")}
                                    disabled={generating === `${app.id}-ENGAGEMENT`}
                                    className="w-full sm:w-auto text-xs"
                                >
                                    {generating === `${app.id}-ENGAGEMENT` ? "Création..." : (
                                        <><Download className="w-4 h-4 mr-2" /> Contrat d'Engagement</>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-12 flex items-start gap-4">
                <Mail className="w-8 h-8 text-primary shrink-0" />
                <div>
                    <h3 className="font-semibold text-white">Signature Électronique</h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Pour l'instant, les documents doivent être imprimés, signés puis scannés. La signature électronique via YouSign arrivera prochainement pour les comptes PRO Premium.
                    </p>
                </div>
            </div>
        </div>
    )
}
