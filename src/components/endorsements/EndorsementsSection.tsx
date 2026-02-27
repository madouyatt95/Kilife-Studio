"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Send, Building2 } from "lucide-react"
import { toast } from "sonner"

interface EndorsementData {
    id: string
    rating: number
    comment: string | null
    createdAt: string
    pro: { companyName: string; isVerified: boolean }
}

interface EndorsementsSectionProps {
    actorProfileId: string
}

export default function EndorsementsSection({ actorProfileId }: EndorsementsSectionProps) {
    const { data: session } = useSession()
    const [endorsements, setEndorsements] = useState<EndorsementData[]>([])
    const [averageRating, setAverageRating] = useState(0)
    const [showForm, setShowForm] = useState(false)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchEndorsements()
    }, [actorProfileId])

    const fetchEndorsements = async () => {
        try {
            const res = await fetch(`/api/endorsements?actorProfileId=${actorProfileId}`)
            if (res.ok) {
                const data = await res.json()
                setEndorsements(data.endorsements || [])
                setAverageRating(data.averageRating || 0)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const submitEndorsement = async () => {
        setSubmitting(true)
        try {
            const res = await fetch("/api/endorsements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actorProfileId, rating, comment })
            })
            if (res.ok) {
                toast.success("Recommandation envoyée !")
                setShowForm(false)
                setComment("")
                fetchEndorsements()
            } else {
                const data = await res.json()
                toast.error(data.error || "Erreur")
            }
        } catch (e) {
            toast.error("Erreur réseau")
        } finally {
            setSubmitting(false)
        }
    }

    const isPro = session?.user?.roles?.includes("PRO")

    return (
        <div className="space-y-4">
            {/* Header with average rating */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">Recommandations Professionnelles</h3>
                    {endorsements.length > 0 && (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-bold text-yellow-400">{averageRating}</span>
                            <span className="text-xs text-muted-foreground">({endorsements.length})</span>
                        </div>
                    )}
                </div>
                {isPro && (
                    <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
                        <Send className="w-3 h-3 mr-1" />
                        {showForm ? "Annuler" : "Recommander"}
                    </Button>
                )}
            </div>

            {/* Endorsement Form (Pro only) */}
            {showForm && (
                <Card className="border-primary/30 bg-card/50">
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <label className="text-sm text-muted-foreground block mb-2">Note</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setRating(n)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${n <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground block mb-1">Commentaire (optionnel)</label>
                            <textarea
                                className="w-full bg-background border border-border rounded-lg p-3 text-sm text-white resize-none"
                                rows={3}
                                placeholder="Ex : Professionnel, ponctuel, excellent jeu d'acteur..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                        </div>
                        <Button onClick={submitEndorsement} disabled={submitting}>
                            {submitting ? "Envoi..." : "Publier la recommandation"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Endorsements List */}
            {endorsements.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">Aucune recommandation pour le moment.</p>
            ) : (
                <div className="space-y-3">
                    {endorsements.map(e => (
                        <Card key={e.id} className="bg-card/30">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                                        <Building2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm text-white">{e.pro.companyName}</span>
                                            {e.pro.isVerified && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">Vérifié</span>
                                            )}
                                            <div className="flex items-center gap-0.5 ml-auto">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < e.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {e.comment && <p className="text-sm text-muted-foreground">{e.comment}</p>}
                                        <p className="text-xs text-muted-foreground/50 mt-1">
                                            {new Date(e.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
                                        </p>
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
