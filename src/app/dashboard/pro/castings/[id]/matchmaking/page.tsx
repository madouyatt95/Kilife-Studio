"use client"

import { useState, useEffect, use } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Star, MapPin, CheckCircle, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface SuggestedProfile {
    id: string
    userId: string
    bio: string | null
    photo: string | null
    age: number | null
    ville: string | null
    competences: string[]
    langues: string[]
    isVerified: boolean
    matchScore: number
    matchDetails: string[]
    user?: { email: string }
}

export default function MatchmakingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: castingId } = use(params)
    const { data: session } = useSession()
    const [suggestions, setSuggestions] = useState<SuggestedProfile[]>([])
    const [castingInfo, setCastingInfo] = useState<{ titre: string; lieu: string } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await fetch(`/api/matchmaking?castingId=${castingId}`)
                if (res.ok) {
                    const data = await res.json()
                    setSuggestions(data.suggestions || [])
                    setCastingInfo(data.casting)
                } else {
                    const err = await res.json()
                    toast.error(err.error || "Erreur de chargement")
                }
            } catch (e) {
                toast.error("Erreur réseau")
            } finally {
                setLoading(false)
            }
        }
        fetchSuggestions()
    }, [castingId])

    if (session?.user?.roles && !session.user.roles.includes("PRO")) {
        return <div className="p-8 text-center text-red-500">Accès réservé aux Professionnels.</div>
    }

    const getScoreColor = (score: number) => {
        if (score >= 60) return "text-green-400"
        if (score >= 30) return "text-yellow-400"
        return "text-muted-foreground"
    }

    return (
        <div className="container py-12 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <Link href="/dashboard/castings" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Retour aux castings
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center rounded-xl">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Matchmaking Intelligent</h1>
                        {castingInfo && (
                            <p className="text-muted-foreground">
                                Suggestions pour <span className="text-primary font-medium">{castingInfo.titre}</span> — {castingInfo.lieu}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center py-16">
                    <Sparkles className="w-8 h-8 text-purple-400 animate-pulse mx-auto mb-4" />
                    <p className="text-muted-foreground">Analyse des profils en cours...</p>
                </div>
            ) : suggestions.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Aucun talent correspondant n'a été trouvé pour les critères de ce casting.</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">Vérifiez que vos critères sont bien renseignés dans le champ "Critères" du casting.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{suggestions.length} talent(s) trouvé(s), classés par pertinence</p>
                    {suggestions.map((profile, index) => (
                        <Card key={profile.id} className="hover:border-primary/50 transition-colors">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    {/* Rank & Avatar */}
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
                                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                            {profile.photo ? (
                                                <img src={profile.photo} alt="" className="w-14 h-14 rounded-full object-cover" />
                                            ) : (
                                                profile.bio?.charAt(0)?.toUpperCase() || "?"
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-white">
                                                {profile.bio?.split("\n")[0]?.substring(0, 40) || profile.user?.email || "Profil"}
                                            </h3>
                                            {profile.isVerified && (
                                                <CheckCircle className="w-4 h-4 text-blue-400" />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            {profile.ville && (
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.ville}</span>
                                            )}
                                            {profile.age && <span>{profile.age} ans</span>}
                                            {profile.langues.length > 0 && <span>{profile.langues.join(", ")}</span>}
                                        </div>

                                        {/* Match Details Tags */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {profile.matchDetails.map((detail, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                                    {detail}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Skills */}
                                        {profile.competences.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {profile.competences.slice(0, 6).map((c, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Score & Action */}
                                    <div className="flex flex-col items-end gap-2">
                                        <div className={`text-2xl font-bold ${getScoreColor(profile.matchScore)}`}>
                                            {profile.matchScore}
                                            <span className="text-xs font-normal text-muted-foreground ml-1">pts</span>
                                        </div>
                                        <Link href={`/talents/${profile.userId}`}>
                                            <Button size="sm" variant="outline" className="text-xs">
                                                Voir Profil
                                            </Button>
                                        </Link>
                                        <Button size="sm" className="text-xs">
                                            <Send className="w-3 h-3 mr-1" /> Inviter
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
