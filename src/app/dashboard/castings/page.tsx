"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { PlusCircle, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardCastingsPage() {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [castings, setCastings] = useState<any[]>([]) // Mocked, ideally fetched

    if (session?.user?.roles && !session.user.roles.includes("PRO")) {
        return <div className="p-8 text-center text-red-500">Accès réservé aux professionnels.</div>
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            titre: formData.get("titre"),
            projet: formData.get("projet"),
            dates: formData.get("dates"),
            lieu: formData.get("lieu"),
            remuneration: formData.get("remuneration"),
            deadline: formData.get("deadline"),
            criteres: formData.get("criteres"),
            roles: [] // Complex nested array form omitted for brevity
        }

        try {
            const res = await fetch("/api/castings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                toast.success("Casting publié avec succès !")
                e.currentTarget.reset()
            } else {
                toast.error("Erreur lors de la création")
            }
        } catch {
            toast.error("Erreur réseau")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Gestion des Castings</h1>
                    <p className="text-muted-foreground">Créez et gérez vos annonces, suivez les candidatures.</p>
                </div>
            </div>

            <Tabs defaultValue="mes-annonces" className="space-y-6">
                <TabsList className="bg-slate-900 border border-white/10">
                    <TabsTrigger value="mes-annonces">Mes Annonces</TabsTrigger>
                    <TabsTrigger value="nouveau">Nouvelle Annonce</TabsTrigger>
                </TabsList>

                <TabsContent value="mes-annonces">
                    {castings.length === 0 ? (
                        <Card className="bg-slate-900 border-white/5 border-dashed border-2">
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                <p>Oups, vous n'avez pas encore publié d'annonce de casting.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        // Liste des annonces PRO
                        <div className="space-y-4">
                            {/* Affichage des castings PRO (à charger via API GET /api/castings/pro) */}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="nouveau">
                    <Card className="bg-slate-900 border-white/5">
                        <CardHeader>
                            <CardTitle>Publier un nouvel appel à casting</CardTitle>
                            <CardDescription>Remplissez les détails pour attirer les meilleurs talents.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="projet">Nom du Projet</Label>
                                        <Input id="projet" name="projet" required placeholder="Ex: Série 'Sakho & Mangane'" className="bg-slate-950" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="titre">Titre de l'annonce</Label>
                                        <Input id="titre" name="titre" required placeholder="Cherche acteur principal..." className="bg-slate-950" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lieu">Lieu du casting / tournage</Label>
                                        <Input id="lieu" name="lieu" required placeholder="Dakar, Plateau" className="bg-slate-950" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dates">Dates prévues</Label>
                                        <Input id="dates" name="dates" required placeholder="Mai - Juin 2026" className="bg-slate-950" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="remuneration">Rémunération (Optionnel)</Label>
                                        <Input id="remuneration" name="remuneration" placeholder="Payé selon charte..." className="bg-slate-950" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deadline">Date de clôture des candidatures</Label>
                                        <Input id="deadline" name="deadline" type="date" required className="bg-slate-950" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="criteres">Critères et instructions supplémentaires</Label>
                                    <Textarea id="criteres" name="criteres" className="h-24 bg-slate-950" placeholder="Envoyer bande démo via lien YouTube..." />
                                </div>

                                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                    Publier l'annonce
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
