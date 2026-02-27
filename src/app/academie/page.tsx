"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, PlayCircle, Clock, Award, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function AcademiePage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchCourses()
    }, [search])

    const fetchCourses = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/courses?query=${search}`)
            if (res.ok) {
                const data = await res.json()
                setCourses(data)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-secondary/30 border border-white/10 p-8 sm:p-16 flex flex-col md:flex-row items-center gap-10">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                <div className="z-10 flex-1 space-y-6">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-sm py-1">Apprentissage Premium</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                        Maîtrisez l'Art <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">du Cinéma</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-xl">
                        Développez vos compétences avec les meilleurs professionnels du Sénégal. Certifications reconnues par le Registre National.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="font-semibold px-8 shadow-lg shadow-primary/20">Explorer les Masterclasses</Button>
                        <Button size="lg" variant="outline" className="border-white/20 bg-black/20 backdrop-blur">Voir mes certificats</Button>
                    </div>
                </div>
                <div className="hidden md:block flex-1 z-10">
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 flex items-center justify-center">
                            <PlayCircle className="h-16 w-16 text-white/80 group-hover:text-primary transition-colors group-hover:scale-110 duration-300" />
                        </div>
                        <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop" alt="Cinema" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="space-y-6">
                <div className="flex flex-col space-y-4 md:flex-row md:items-end md:justify-between md:space-y-0">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Catalogue des Formations</h2>
                    <div className="flex w-full items-center space-x-2 md:w-auto">
                        <Input
                            type="search"
                            placeholder="Rechercher un cours..."
                            className="md:w-[300px] bg-slate-900 border-white/10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="secondary" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="bg-slate-900 border-white/5 overflow-hidden">
                                <Skeleton className="h-40 w-full" />
                                <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /></CardHeader>
                            </Card>
                        ))
                    ) : courses.length === 0 ? (
                        // Affichage statique de démo si la BDD est vide
                        [
                            { slug: "acting-camera", titre: "Jeu d'acteur face caméra", modules: 5, time: "4h 30m", rating: 4.8 },
                            { slug: "realisation", titre: "Les bases de la réalisation", modules: 8, time: "6h 15m", rating: 4.9 },
                            { slug: "scenarisation", titre: "Écrire un scénario court", modules: 4, time: "3h 00m", rating: 4.7 }
                        ].map((course, i) => (
                            <Card key={i} className="bg-slate-900/50 border-white/10 hover:border-primary/50 transition-colors flex flex-col group overflow-hidden">
                                <div className="aspect-[16/9] bg-slate-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                    <img src={`https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop&sig=${i}`} alt="Course" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute bottom-2 right-2 z-20">
                                        <Badge className="bg-black/80 text-white border-none backdrop-blur"><Clock className="mr-1 h-3 w-3" /> {course.time}</Badge>
                                    </div>
                                </div>
                                <CardHeader className="flex-1">
                                    <div className="flex items-center space-x-1 text-primary text-xs font-medium mb-2">
                                        <Star className="h-3 w-3 fill-primary" /> <span>{course.rating}</span> <span className="text-muted-foreground ml-1"> (124 avis)</span>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2 leading-tight">{course.titre}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-slate-400">
                                    <div className="flex items-center"><Award className="mr-2 h-4 w-4" /> Certification incluse</div>
                                    <div className="flex items-center mt-1"><PlayCircle className="mr-2 h-4 w-4" /> {course.modules} modules vidéo</div>
                                </CardContent>
                                <CardFooter className="pt-4 border-t border-white/5 mt-auto">
                                    <Button className="w-full relative overflow-hidden" asChild>
                                        <Link href={`/academie/${course.slug}`}>
                                            <span className="relative z-10">Commencer</span>
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        // Dynamic render if courses exist in DB
                        courses.map((course) => (
                            <Card key={course.id}>{/* Render real course Card similar to above */}</Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
