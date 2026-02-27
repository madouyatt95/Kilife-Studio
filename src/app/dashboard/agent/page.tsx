"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Plus, Trash2, Building2, Mail, MapPin } from "lucide-react"
import { toast } from "sonner"

interface Talent {
    id: string
    bio: string | null
    ville: string | null
    competences: string[]
    photo: string | null
    user?: { email: string }
}

export default function AgentDashboardPage() {
    const { data: session } = useSession()
    const [talents, setTalents] = useState<Talent[]>([])
    const [agencyName, setAgencyName] = useState("")
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newEmail, setNewEmail] = useState("")
    const [newBio, setNewBio] = useState("")
    const [newVille, setNewVille] = useState("")
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        fetchTalents()
    }, [])

    const fetchTalents = async () => {
        try {
            const res = await fetch("/api/agents/talents")
            if (res.ok) {
                const data = await res.json()
                setTalents(data.talents || [])
                setAgencyName(data.agencyName || "")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const addTalent = async () => {
        if (!newEmail) return toast.error("L'email est obligatoire")
        setAdding(true)
        try {
            const res = await fetch("/api/agents/talents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    newTalent: { email: newEmail, bio: newBio, ville: newVille }
                })
            })
            const data = await res.json()
            if (res.ok) {
                toast.success("Talent ajouté avec succès !")
                setNewEmail("")
                setNewBio("")
                setNewVille("")
                setShowAddForm(false)
                fetchTalents()
            } else {
                toast.error(data.error || "Erreur lors de l'ajout")
            }
        } catch (e) {
            toast.error("Erreur réseau")
        } finally {
            setAdding(false)
        }
    }

    const removeTalent = async (actorProfileId: string) => {
        try {
            const res = await fetch("/api/agents/talents", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actorProfileId })
            })
            if (res.ok) {
                toast.success("Talent retiré de votre agence")
                fetchTalents()
            } else {
                const data = await res.json()
                toast.error(data.error || "Erreur")
            }
        } catch (e) {
            toast.error("Erreur réseau")
        }
    }

    if (session?.user?.roles && !session.user.roles.includes("AGENT")) {
        return <div className="p-8 text-center text-red-500">Accès réservé aux Agents artistiques.</div>
    }

    return (
        <div className="container py-12 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-xl">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">{agencyName || "Mon Agence"}</h1>
                            <p className="text-muted-foreground">Tableau de bord Agent</p>
                        </div>
                    </div>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "outline" : "default"}>
                    <Plus className="w-4 h-4 mr-2" />
                    {showAddForm ? "Annuler" : "Ajouter un talent"}
                </Button>
            </div>

            {/* Add Talent Form */}
            {showAddForm && (
                <Card className="border-primary/30 bg-card/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-lg">Nouveau Talent</CardTitle>
                        <CardDescription>Créez un profil acteur rattaché à votre agence.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm text-muted-foreground">Email *</label>
                                <Input placeholder="talent@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-muted-foreground">Bio</label>
                                <Input placeholder="Ex: Acteur, 25 ans, bilingue" value={newBio} onChange={e => setNewBio(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-muted-foreground">Ville</label>
                                <Input placeholder="Dakar" value={newVille} onChange={e => setNewVille(e.target.value)} />
                            </div>
                        </div>
                        <Button onClick={addTalent} disabled={adding}>
                            {adding ? "Ajout en cours..." : "Créer le profil"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Talents Grid */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-white">Mes Talents ({talents.length})</h2>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">Chargement...</div>
                ) : talents.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-muted-foreground">Aucun talent sous votre gestion pour le moment.</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">Cliquez sur "Ajouter un talent" pour commencer.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {talents.map((talent) => (
                            <Card key={talent.id} className="group hover:border-primary/50 transition-colors">
                                <CardContent className="pt-6 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                {talent.bio?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white text-sm">
                                                    {talent.bio?.split("\n")[0]?.substring(0, 30) || "Profil incomplet"}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {talent.user?.email || "—"}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500"
                                            onClick={() => removeTalent(talent.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {talent.ville && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {talent.ville}
                                        </p>
                                    )}

                                    {talent.competences?.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {talent.competences.slice(0, 4).map((c, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
