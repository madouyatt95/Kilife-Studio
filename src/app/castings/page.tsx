"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, Briefcase, Clock, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CastingsPage() {
    const [castings, setCastings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchCastings()
    }, [search])

    const fetchCastings = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/castings?query=${search}`)
            if (res.ok) {
                const data = await res.json()
                setCastings(data)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col space-y-4 md:flex-row md:items-end md:justify-between md:space-y-0">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-white">Appels à Casting</h1>
                    <p className="text-muted-foreground">Postulez aux dernières opportunités de tournages au Sénégal.</p>
                </div>
                <div className="flex w-full items-center space-x-2 md:w-auto">
                    <Input
                        type="search"
                        placeholder="Rechercher par titre..."
                        className="md:w-[300px] bg-slate-900 border-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button variant="secondary" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="bg-slate-900 border-white/5">
                            <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                            <CardContent className="space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></CardContent>
                        </Card>
                    ))
                ) : castings.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        Aucun casting trouvé pour le moment.
                    </div>
                ) : (
                    castings.map((casting) => (
                        <Card key={casting.id} className="bg-slate-900 border-white/10 hover:border-primary/50 transition-colors flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="text-primary border-primary/30 mb-2">
                                        {casting.projet}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(casting.publishedAt).toLocaleDateString("fr-FR")}
                                    </span>
                                </div>
                                <CardTitle className="text-xl line-clamp-2">{casting.titre}</CardTitle>
                                <CardDescription className="text-slate-400 font-medium">
                                    {casting.proProfile.companyName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-3 text-sm text-slate-300">
                                <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-slate-500" /> {casting.lieu}</div>
                                <div className="flex items-center"><Calendar className="mr-2 h-4 w-4 text-slate-500" /> {casting.dates}</div>
                                <div className="flex items-center"><Users className="mr-2 h-4 w-4 text-slate-500" /> {casting.roles?.length || 0} rôle(s) recherché(s)</div>
                                {casting.remuneration && (
                                    <div className="flex items-center text-green-400/90"><Briefcase className="mr-2 h-4 w-4" /> {casting.remuneration}</div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-4 border-t border-white/5 mt-auto">
                                <Button className="w-full" asChild>
                                    <Link href={`/castings/${casting.id}`}>Voir les détails & Postuler</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
