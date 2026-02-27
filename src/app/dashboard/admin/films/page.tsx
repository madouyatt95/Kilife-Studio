"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Film, PlusCircle, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function AdminFilmsDashboard() {
    const { data: session } = useSession()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        titre: "",
        annee: new Date().getFullYear().toString(),
        realisateur: "",
        synopsis: "",
        affiche: "",
        trailerUrl: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch('/api/admin/films', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Erreur lors de la soumission du film")
            }

            toast.success(data.message)
            setFormData({
                titre: "",
                annee: new Date().getFullYear().toString(),
                realisateur: "",
                synopsis: "",
                affiche: "",
                trailerUrl: ""
            })

            // Redirect or refresh
            router.refresh()

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!session || !(session.user.roles as string[]).includes("ADMIN")) {
        return (
            <div className="container py-8 text-center">
                <h1 className="text-2xl font-bold text-destructive">Accès Refusé</h1>
                <p className="text-muted-foreground mt-2">Cette page est strictement réservée à l'Administration.</p>
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-4xl mx-auto space-y-8">
            <div>
                <Button variant="ghost" className="mb-2 -ml-4" onClick={() => router.push(`/dashboard`)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Film className="h-8 w-8 text-primary" />
                    Registre IMDB Sénégalais
                </h1>
                <p className="text-muted-foreground mt-1">
                    Ajoutez ou modifiez les fiches des films référencés sur Kilife Studio.
                </p>
            </div>

            <Card className="bg-slate-900 border-white/5">
                <CardHeader>
                    <CardTitle>Ajouter un film au catalogue</CardTitle>
                    <CardDescription>
                        Les films publiés ici apparaîtront publiquement dans la section "Films" de la plateforme.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="titre">Titre de l'œuvre</Label>
                                <Input
                                    id="titre"
                                    placeholder="Ex: Tirailleurs"
                                    required
                                    value={formData.titre}
                                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="annee">Année de sortie</Label>
                                <Input
                                    id="annee"
                                    type="number"
                                    min="1900"
                                    max="2100"
                                    required
                                    value={formData.annee}
                                    onChange={(e) => setFormData({ ...formData, annee: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="realisateur">Réalisateur(s)</Label>
                            <Input
                                id="realisateur"
                                placeholder="Nom du réalisateur"
                                required
                                value={formData.realisateur}
                                onChange={(e) => setFormData({ ...formData, realisateur: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="synopsis">Synopsis</Label>
                            <Textarea
                                id="synopsis"
                                placeholder="Résumé du film..."
                                className="min-h-[120px]"
                                required
                                value={formData.synopsis}
                                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="affiche">URL de l'affiche (Optionnel)</Label>
                                <Input
                                    id="affiche"
                                    type="url"
                                    placeholder="https://..."
                                    value={formData.affiche}
                                    onChange={(e) => setFormData({ ...formData, affiche: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="trailerUrl">URL de la Bande Annonce (Optionnel)</Label>
                                <Input
                                    id="trailerUrl"
                                    type="url"
                                    placeholder="https://youtube.com/..."
                                    value={formData.trailerUrl}
                                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-950/50 border-t border-white/5 pt-6 flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="animate-pulse">Publication en cours...</span>
                            ) : (
                                <>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Publier ce film
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
