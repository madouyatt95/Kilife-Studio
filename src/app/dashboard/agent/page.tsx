"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus, Star, Mail, MapPin } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AgentDashboard() {
    const { data: session } = useSession()
    const [isAddTalentOpen, setIsAddTalentOpen] = useState(false)
    const [newTalentEmail, setNewTalentEmail] = useState("")

    // Fetch agent's talents
    const { data: talents, isLoading, refetch } = useQuery({
        queryKey: ['agent-talents'],
        queryFn: async () => {
            const res = await fetch('/api/agents/talents')
            if (!res.ok) throw new Error('Erreur réseau')
            return res.json()
        },
        enabled: !!session?.user,
    })

    const handleAddTalent = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/agents/talents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newTalentEmail })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Erreur lors de l'ajout")
            }

            toast.success("Talent ajouté avec succès")
            setNewTalentEmail("")
            setIsAddTalentOpen(false)
            refetch()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    if (!session || !(session.user.roles as string[]).includes("AGENT")) {
        return (
            <div className="container py-8 text-center">
                <h1 className="text-2xl font-bold text-destructive">Accès Refusé</h1>
                <p className="text-muted-foreground mt-2">Cette page est réservée aux Agences de Talents.</p>
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Star className="h-8 w-8 text-primary" />
                        Mon Agence
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez vos artistes, leurs candidatures et leurs profils centralisés.
                    </p>
                </div>

                <Dialog open={isAddTalentOpen} onOpenChange={setIsAddTalentOpen}>
                    <DialogTrigger asChild>
                        <Button className="shrink-0">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Ajouter un talent
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleAddTalent}>
                            <DialogHeader>
                                <DialogTitle>Lier un talent existant</DialogTitle>
                                <DialogDescription>
                                    Entrez l'adresse email professionnelle du talent. S'il est inscrit sur la plateforme, il recevra une demande de liaison à votre agence.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email de l'acteur</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="talent@exemple.com"
                                        value={newTalentEmail}
                                        onChange={(e) => setNewTalentEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Envoyer la demande</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="bg-slate-900 border-white/5 animate-pulse h-[250px]" />
                    ))}
                </div>
            ) : talents?.length === 0 ? (
                <Card className="bg-slate-900 border-white/5 py-12 text-center">
                    <CardContent className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserPlus className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>Aucun talent pour le moment</CardTitle>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            Votre agence ne gère encore aucun profil sur la plateforme. Commencez par ajouter vos talents existants.
                        </p>
                        <Button variant="outline" onClick={() => setIsAddTalentOpen(true)}>
                            Ajouter mon premier talent
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {talents?.map((talent: any) => (
                        <Card key={talent.id} className="bg-slate-900 border-white/5 overflow-hidden flex flex-col">
                            <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 relative">
                                <Avatar className="h-20 w-20 border-4 border-slate-900 absolute -bottom-10 left-6">
                                    <AvatarImage src={talent.galerie?.[0] || `https://api.dicebear.com/7.x/initials/svg?seed=${talent.user.name}`} className="object-cover" />
                                    <AvatarFallback>{talent.user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardHeader className="pt-12 pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{talent.user.name}</CardTitle>
                                        <p className="text-sm text-primary font-medium">{talent.age ? `${talent.age} ans` : "Âge non défini"}</p>
                                    </div>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        Actif
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 flex-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {talent.ville || "Lieu non précisé"}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span className="truncate">{talent.user.email}</span>
                                </div>
                                {talent.competences?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {talent.competences.slice(0, 3).map((comp: string, idx: number) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">{comp}</Badge>
                                        ))}
                                        {talent.competences.length > 3 && (
                                            <Badge variant="secondary" className="text-xs">+{talent.competences.length - 3}</Badge>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-4 bg-slate-950/50">
                                <Button variant="outline" className="w-full text-xs h-8">
                                    Voir le profil complet
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
