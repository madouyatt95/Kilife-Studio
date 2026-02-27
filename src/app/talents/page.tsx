"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Video } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function TalentsPage() {
    const [talents, setTalents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchTalents()
    }, [search])

    const fetchTalents = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/actors?query=${search}`)
            if (res.ok) {
                const data = await res.json()
                setTalents(data)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col space-y-4 md:flex-row md:items-end md:justify-between md:space-y-0">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-white">Registre National des Talents</h1>
                    <p className="text-muted-foreground">Découvrez les profils validés du cinéma sénégalais.</p>
                </div>
                <div className="flex w-full items-center space-x-2 md:w-auto">
                    <Input
                        type="search"
                        placeholder="Rechercher un talent..."
                        className="md:w-[300px] bg-slate-900 border-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button variant="secondary" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden bg-slate-900 border-white/5">
                            <Skeleton className="h-48 w-full" />
                            <CardHeader className="p-4"><Skeleton className="h-6 w-2/3" /></CardHeader>
                            <CardContent className="p-4 pt-0"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3 mt-2" /></CardContent>
                        </Card>
                    ))
                ) : talents.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        Aucun talent trouvé pour cette recherche.
                    </div>
                ) : (
                    talents.map((talent) => (
                        <Card key={talent.id} className="overflow-hidden bg-slate-900/50 border-white/10 hover:border-primary/50 transition-colors group">
                            <div className="aspect-[4/5] relative overflow-hidden bg-slate-800">
                                {talent.photo ? (
                                    <img src={talent.photo} alt="Photo" className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={talent.user.avatarUrl} />
                                            <AvatarFallback className="text-3xl bg-slate-700">{talent.user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                                {talent.isVerified && (
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-primary text-primary-foreground font-semibold"><Star className="h-3 w-3 mr-1" /> Vérifié</Badge>
                                    </div>
                                )}
                                {talent.demoVideoId && (
                                    <div className="absolute bottom-2 left-2">
                                        <Badge variant="outline" className="bg-slate-950/80 backdrop-blur"><Video className="h-3 w-3 mr-1" /> Bande démo</Badge>
                                    </div>
                                )}
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="line-clamp-1">{talent.user.name || talent.user.email.split("@")[0]}</CardTitle>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {talent.ville || "Dakar, Sénégal"}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {talent.competences?.slice(0, 3).map((comp: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">{comp}</Badge>
                                    ))}
                                    {talent.competences?.length > 3 && <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{talent.competences.length - 3}</Badge>}
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full" variant="outline" asChild>
                                    <Link href={`/talents/${talent.id}`}>Voir le profil</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
