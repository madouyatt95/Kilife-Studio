"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Camera, Video as VideoIcon, Upload, Loader2, Save } from "lucide-react"

export default function EditActorProfilePage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)

    useEffect(() => {
        // In a real app we'd fetch the private profile data from an API like /api/actors/me
        // Since we don't have that yet, let's assume we have it or create the API next.
        const fetchProfile = async () => {
            if (session?.user?.id) {
                // Mock fetch for now, or imagine we created GET /api/actors/me
                setProfile({ photo: null, bio: "", ville: "", competences: "", demoVideoId: "", completenessScore: 0 })
            }
        }
        fetchProfile()
    }, [session])

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            bio: formData.get("bio") as string,
            ville: formData.get("ville") as string,
            demoVideoId: formData.get("demoVideoId") as string,
            competences: (formData.get("competences") as string).split(",").map(c => c.trim()).filter(Boolean),
        }

        try {
            const res = await fetch("/api/actors", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                toast.success("Profil mis à jour avec succès")
                const updated = await res.json()
                setProfile(updated)
            } else {
                toast.error("Erreur lors de la mise à jour")
            }
        } catch {
            toast.error("Erreur réseau")
        } finally {
            setLoading(false)
        }
    }

    if (!profile) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>

    return (
        <div className="container py-8 max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Mon Profil Talent</h1>
                <p className="text-muted-foreground">Complétez votre profil pour être visible par les directeurs de casting.</p>
            </div>

            <Card className="bg-slate-900 border-white/5">
                <CardHeader>
                    <CardTitle className="text-xl">Score de Complétude</CardTitle>
                    <CardDescription>
                        Atteignez 80% pour soumettre votre profil à la validation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Progress value={profile.completenessScore} className="h-4" />
                    <div className="flex justify-between text-sm">
                        <span>{profile.completenessScore}%</span>
                        <span className="text-primary font-medium">Objectif: 80%</span>
                    </div>
                </CardContent>
            </Card>

            <form onSubmit={onSubmit}>
                <div className="grid gap-8 md:grid-cols-3">

                    <div className="space-y-6 md:col-span-1">
                        <Card className="bg-slate-900 border-white/5">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="relative h-40 w-40 rounded-full overflow-hidden bg-slate-800 border-4 border-slate-950 flex items-center justify-center group cursor-pointer">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <Camera className="h-10 w-10 text-slate-500" />
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-sm font-medium text-white flex items-center"><Upload className="h-4 w-4 mr-1" /> Modifier photo</span>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Format JPG, PNG. Max 5MB. Partagé publiquement.
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-white/5">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center"><VideoIcon className="mr-2 h-4 w-4 text-primary" /> Bande Démo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="demoVideoId">ID Vidéo (Cloudflare/Mux)</Label>
                                    <Input id="demoVideoId" name="demoVideoId" placeholder="ex: 8b7d9...2f1" defaultValue={profile.demoVideoId} className="bg-slate-950" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <Card className="bg-slate-900 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-xl">Informations Personnelles</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                <div className="space-y-2">
                                    <Label htmlFor="ville">Ville de résidence</Label>
                                    <Input id="ville" name="ville" placeholder="Dakar..." defaultValue={profile.ville} className="bg-slate-950" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biographie / Présentation</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        placeholder="Parlez de votre parcours et de vos passions..."
                                        className="h-32 bg-slate-950 resize-none"
                                        defaultValue={profile.bio}
                                    />
                                    <p className="text-xs text-muted-foreground">Une bio détaillée augmente vos chances d'être repéré.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="competences">Compétences (séparées par des virgules)</Label>
                                    <Input
                                        id="competences"
                                        name="competences"
                                        placeholder="Cascadeur, Équitation, Danse contemporaine..."
                                        defaultValue={profile.competences ? profile.competences.join(", ") : ""}
                                        className="bg-slate-950"
                                    />
                                </div>

                            </CardContent>
                            <CardFooter className="bg-slate-950/50 border-t border-white/5 py-4">
                                <Button type="submit" className="ml-auto min-w-[120px]" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    {loading ? "Sauvegarde..." : "Enregistrer"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                </div>
            </form>
        </div>
    )
}
