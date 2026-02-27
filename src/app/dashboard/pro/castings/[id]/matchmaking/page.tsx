"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MapPin, Mail, ArrowLeft, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

export default function MatchmakingPage() {
    const { data: session } = useSession()
    const params = useParams()
    const router = useRouter()
    const castingId = params.id as string

    // Fetch suggested talents
    const { data: matches, isLoading } = useQuery({
        queryKey: ['casting-matchmaking', castingId],
        queryFn: async () => {
            const res = await fetch(`/api/matchmaking?castingId=${castingId}`)
            if (!res.ok) throw new Error('Erreur lors du calcul des correspondances')
            return res.json()
        },
        enabled: !!session?.user && !!castingId,
    })

    const handleInvite = async (actorId: string) => {
        // Dans une V2, ceci appellerait une API pour envoyer une notification ou un email à l'acteur
        toast.success("Invitation envoyée au profil")
    }

    if (!session || !(session.user.roles as string[]).includes("PRO")) {
        return (
            <div className="container py-8 text-center">
                <h1 className="text-2xl font-bold text-destructive">Accès Refusé</h1>
                <p className="text-muted-foreground mt-2">Cette page est réservée aux Professionnels vérifiés.</p>
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Button variant="ghost" className="mb-2 -ml-4" onClick={() => router.push(`/dashboard/castings`)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux castings
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-primary" />
                        Matchmaking IA
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Ces profils ont été automatiquement suggérés selon les critères de votre casting.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="bg-slate-900 border-white/5 animate-pulse h-[300px]" />
                    ))}
                </div>
            ) : matches?.length === 0 ? (
                <Card className="bg-slate-900 border-white/5 py-16 text-center">
                    <CardContent className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>Aucune correspondance exacte</CardTitle>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            Notre algorithme n'a pas trouvé de talents correspondant parfaitement à l'intégralité de vos critères (Age, Ville, Compétences). Essayez d'élargir vos critères de recherche.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {matches?.map((match: any) => (
                        <Card key={match.id} className="bg-slate-900 border-white/5 overflow-hidden flex flex-col relative group">
                            {/* Score visuel */}
                            <div className="absolute top-4 right-4 z-10 bg-slate-950/80 backdrop-blur border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="font-bold text-sm">{match.matchScore}% Match</span>
                            </div>

                            <div className="h-28 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                                <Avatar className="h-24 w-24 border-4 border-slate-900 absolute -bottom-12 left-6 z-20">
                                    <AvatarImage src={match.galerie?.[0] || `https://api.dicebear.com/7.x/initials/svg?seed=${match.user.name || match.user.email}`} className="object-cover" />
                                    <AvatarFallback>{(match.user.name || match.user.email)?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>

                            <CardHeader className="pt-14 pb-2">
                                <CardTitle className="text-lg truncate">{match.user.name || match.user.email.split('@')[0]}</CardTitle>
                                <p className="text-sm text-primary font-medium">{match.age ? `${match.age} ans` : "Âge non défini"}</p>
                            </CardHeader>

                            <CardContent className="space-y-4 flex-1">
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        {match.ville || "Lieu non précisé"}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground w-full">
                                        <Mail className="mr-2 h-4 w-4 shrink-0" />
                                        <span className="truncate">{match.user.email}</span>
                                    </div>
                                </div>

                                {match.competences?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {match.competences.slice(0, 4).map((comp: string, idx: number) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">{comp}</Badge>
                                        ))}
                                        {match.competences.length > 4 && (
                                            <Badge variant="secondary" className="text-xs">+{match.competences.length - 4}</Badge>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-1.5 pt-2 border-t border-white/5 mt-4">
                                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                        <span>Complétion profil</span>
                                        <span className="text-white">{match.completenessScore}%</span>
                                    </div>
                                    <Progress value={match.completenessScore} className="h-1.5 bg-slate-800" />
                                </div>
                            </CardContent>

                            <CardFooter className="border-t border-white/5 pt-4 pb-4 bg-slate-950/50 flex gap-2">
                                <Button
                                    className="w-full text-xs transition-transform active:scale-95"
                                    onClick={() => handleInvite(match.id)}
                                >
                                    <Send className="mr-2 h-3.5 w-3.5" />
                                    Inviter
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full text-xs transition-transform active:scale-95"
                                    onClick={() => router.push(`/talents/${match.user.id}`)}
                                >
                                    Profil
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
