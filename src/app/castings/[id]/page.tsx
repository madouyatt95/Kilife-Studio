"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar, Briefcase, Users, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function CastingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const [casting, setCasting] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const fetchCasting = async () => {
            try {
                const res = await fetch(`/api/castings/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setCasting(data)
                } else {
                    router.push("/castings")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchCasting()
    }, [params.id, router])

    const handleApply = async () => {
        setApplying(true)
        try {
            const res = await fetch(`/api/castings/${params.id}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, pieces: [] }),
            })
            if (res.ok) {
                toast.success("Candidature envoyée avec succès !")
                setMessage("")
            } else {
                const data = await res.json()
                toast.error(data.error || "Erreur lors de la candidature.")
            }
        } catch {
            toast.error("Erreur réseau.")
        } finally {
            setApplying(false)
        }
    }

    if (loading) {
        return (
            <div className="container py-8 px-4 max-w-4xl mx-auto space-y-8">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        )
    }

    if (!casting) return null

    const isActor = session?.user?.roles?.includes("ACTOR")

    return (
        <div className="container py-8 px-4 sm:px-8 max-w-4xl mx-auto space-y-8 ">
            <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux castings
            </Button>

            {/* Hero Section */}
            <div className="rounded-2xl bg-secondary/30 border border-white/10 p-8 space-y-6">
                <div className="space-y-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">{casting.projet}</Badge>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">{casting.titre}</h1>
                    <p className="text-lg text-slate-400 font-medium pb-2">Par {casting.proProfile.companyName}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                    <div className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" /> <span className="font-medium text-white mr-1">Lieu:</span> {casting.lieu}</div>
                    <div className="flex items-center"><Calendar className="mr-2 h-5 w-5 text-primary" /> <span className="font-medium text-white mr-1">Dates:</span> {casting.dates}</div>
                    {casting.remuneration && (
                        <div className="flex items-center text-green-400"><Briefcase className="mr-2 h-5 w-5" /> <span className="font-medium text-white mr-1">Rémunération:</span> {casting.remuneration}</div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <Card className="bg-slate-900/50 border-white/5 shadow-none pb-4">
                        <CardHeader>
                            <CardTitle className="text-xl">Profils recherchés (Rôles)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {casting.roles?.map((role: any, i: number) => (
                                <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                                    <h4 className="font-semibold text-lg text-white mb-2">{role.titre}</h4>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{role.description}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {role.gender && <Badge variant="outline">{role.gender}</Badge>}
                                        {role.ageMin && role.ageMax && <Badge variant="outline">{role.ageMin} - {role.ageMax} ans</Badge>}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {casting.criteres && (
                        <Card className="bg-slate-900 border-white/5">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">Critères spécifiques / Pièces demandées</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{casting.criteres}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-white/10 sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-lg">Intéressé(e) ?</CardTitle>
                            <CardDescription>
                                Clôture des candidatures le {new Date(casting.deadline).toLocaleDateString("fr-FR")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isActor ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full text-base py-6 shadow-lg shadow-primary/20"><Send className="mr-2 h-5 w-5" /> Postuler maintenant</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] border-white/10 bg-slate-950">
                                        <DialogHeader>
                                            <DialogTitle>Candidature: {casting.titre}</DialogTitle>
                                            <DialogDescription>
                                                Votre profil talent sera automatiquement joint à votre candidature. Vous pouvez ajouter un message personnalisé pour la production.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="message">Message au directeur de casting</Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="Ex: Bonjour, je suis très intéressé par le rôle de..."
                                                    className="h-32 bg-slate-900 border-white/10"
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleApply} disabled={applying} className="w-full">
                                                {applying ? "Envoi en cours..." : "Confirmer la candidature"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            ) : session ? (
                                <Button className="w-full" disabled variant="secondary">Connexion Acteur requise</Button>
                            ) : (
                                <Button className="w-full" asChild>
                                    <Link href={`/login?callbackUrl=/castings/${casting.id}`}>Se connecter pour postuler</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
