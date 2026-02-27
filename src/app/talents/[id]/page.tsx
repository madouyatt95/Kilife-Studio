"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Star, Calendar, Ruler, Award, Languages, ArrowLeft, Video, Film, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TalentProfilePage() {
    const params = useParams()
    const router = useRouter()
    const [talent, setTalent] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTalent = async () => {
            try {
                const res = await fetch(`/api/actors/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setTalent(data)
                } else {
                    router.push("/talents")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchTalent()
    }, [params.id, router])

    if (loading) {
        return (
            <div className="container py-8 px-4 max-w-4xl mx-auto space-y-8">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <Skeleton className="h-10 w-48" />
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-[200px] col-span-1" />
                    <Skeleton className="h-[400px] col-span-2" />
                </div>
            </div>
        )
    }

    if (!talent) return null

    return (
        <div className="container py-8 px-4 sm:px-8 max-w-5xl mx-auto space-y-8">
            <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la liste
            </Button>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-secondary/30 border border-white/10 glass p-8 flex flex-col md:flex-row items-center md:items-start gap-8">

                <Avatar className="h-40 w-40 border-4 border-background sm:h-48 sm:w-48 shrink-0 shadow-2xl">
                    {talent.photo ? (
                        <AvatarImage src={talent.photo} className="object-cover" />
                    ) : (
                        <AvatarImage src={talent.user.avatarUrl} />
                    )}
                    <AvatarFallback className="text-5xl bg-slate-800 text-slate-400">
                        {talent.user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 space-y-4">
                    <div className="space-y-1 w-full">
                        <div className="flex items-center justify-center md:justify-start flex-wrap gap-2">
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2 md:mb-0">
                                {talent.user.email.split("@")[0]}
                            </h1>
                            {talent.isVerified && (
                                <Badge variant="secondary" className="bg-primary text-primary-foreground font-semibold px-2 py-0.5 ml-2 mt-1 md:mt-0">
                                    <Star className="h-3 w-3 mr-1" /> Vérifié
                                </Badge>
                            )}
                        </div>
                        <p className="text-xl text-primary font-medium">Acteur / Actrice</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground w-full">
                        <div className="flex items-center"><MapPin className="mr-1 h-4 w-4" /> {talent.ville || "Dakar, Sénégal"}</div>
                        {talent.age && <div className="flex items-center"><Calendar className="mr-1 h-4 w-4" /> {talent.age} ans</div>}
                        {talent.taille && <div className="flex items-center"><Ruler className="mr-1 h-4 w-4" /> {talent.taille} cm</div>}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button className="font-semibold"><Mail className="mr-2 h-4 w-4" /> Contacter (Pro)</Button>
                        {talent.cvUrl && (
                            <Button variant="outline"><Film className="mr-2 h-4 w-4" /> CV / Portfolio</Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column (Metadata) */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg"><Award className="mr-2 h-5 w-5 text-primary" /> Compétences</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {talent.competences?.length > 0 ? (
                                talent.competences.map((comp: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="bg-slate-800">{comp}</Badge>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">Non renseigné</span>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg"><Languages className="mr-2 h-5 w-5 text-primary" /> Langues</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {talent.langues?.length > 0 ? (
                                talent.langues.map((lang: string, i: number) => (
                                    <Badge key={i} variant="outline" className="border-white/10">{lang}</Badge>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">Non renseigné</span>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Content) */}
                <div className="md:col-span-2 space-y-8">

                    {/* Bio */}
                    {talent.bio && (
                        <Card className="bg-slate-900/50 border-white/5 shadow-none pb-4">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">À propos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {talent.bio}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Bande Démo */}
                    {talent.demoVideoId && (
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold flex items-center">
                                <Video className="h-5 w-5 mr-2 text-primary" /> Bande Démo
                            </h3>
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                                {/* Abstraction du video provider - ici un placeholder stylisé */}
                                <div className="text-center p-8">
                                    <Video className="h-12 w-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40">Vidéo ID: {talent.demoVideoId}</p>
                                    <p className="text-sm text-white/20">(Intégration Mux/Cloudflare à configurer)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Galerie */}
                    {talent.galerie?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold">Galerie</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {talent.galerie.map((img: string, i: number) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-800">
                                        <img src={img} alt={`Galerie ${i}`} className="object-cover w-full h-full hover:scale-105 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
