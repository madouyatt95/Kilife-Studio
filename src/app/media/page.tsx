"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, ChevronRight, Newspaper, Film as FilmIcon } from "lucide-react"

export default function MediaPage() {
    const [search, setSearch] = useState("")

    // Mocked for UI Display
    const mockNews = [
        { id: 1, category: "Industrie", slug: "fespaco-2026-selection", title: "FESPACO 2026 : Le Sénégal en force avec 5 productions sélectionnées", date: "12 Mai 2026", img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2670&auto=format&fit=crop" },
        { id: 2, category: "Formation", slug: "nouvelle-ecole-dakar", title: "Une nouvelle école d'effets spéciaux ouvre ses portes à Dakar", date: "08 Mai 2026", img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2670&auto=format&fit=crop" },
        { id: 3, category: "Production", slug: "fonds-public-cinema", title: "Hausse de 30% du FOPICA pour l'année en cours", date: "02 Mai 2026", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop" },
    ]

    const mockFilms = [
        { slug: "banel-adama", title: "Banel & Adama", year: 2023, director: "Ramata-Toulaye Sy", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop" },
        { slug: "atlantique", title: "Atlantique", year: 2019, director: "Mati Diop", img: "https://images.unsplash.com/photo-1522026214227-2c1f964af332?q=80&w=2070&auto=format&fit=crop" },
        { slug: "xale", title: "Xalé, les blessures de l'enfance", year: 2022, director: "Moussa Sène Absa", img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop" },
    ]

    return (
        <div className="container py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col space-y-4 md:flex-row md:items-end md:justify-between md:space-y-0">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-white">Actualités & Répertoire</h1>
                    <p className="text-muted-foreground">Toute l'actualité de l'industrie cinématographique sénégalaise.</p>
                </div>
                <div className="flex w-full items-center space-x-2 md:w-auto">
                    <Input
                        type="search"
                        placeholder="Rechercher un article ou film..."
                        className="md:w-[300px] bg-slate-900 border-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button variant="secondary" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="actualites" className="space-y-8">
                <TabsList className="bg-slate-900 border border-white/10 p-1">
                    <TabsTrigger value="actualites" className="data-[state=active]:bg-slate-800"><Newspaper className="mr-2 h-4 w-4" /> Actualités</TabsTrigger>
                    <TabsTrigger value="repertoire" className="data-[state=active]:bg-slate-800"><FilmIcon className="mr-2 h-4 w-4" /> Répertoire des Films</TabsTrigger>
                </TabsList>

                <TabsContent value="actualites" className="space-y-8">
                    {/* Featured Article */}
                    {mockNews[0] && (
                        <Link href={`/media/${mockNews[0].slug}`} className="block group">
                            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10 glass">
                                <img src={mockNews[0].img} alt="A la une" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-3/4">
                                    <Badge className="bg-primary/90 text-primary-foreground mb-4">{mockNews[0].category}</Badge>
                                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">{mockNews[0].title}</h2>
                                    <p className="text-slate-300 flex items-center"><Calendar className="mr-2 h-4 w-4" /> {mockNews[0].date}</p>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Grid of articles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockNews.slice(1).map((news) => (
                            <Card key={news.id} className="bg-slate-900 border-white/10 hover:border-primary/50 transition-colors flex flex-col group overflow-hidden">
                                <div className="aspect-[16/9] relative overflow-hidden bg-slate-800">
                                    <img src={news.img} alt={news.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 left-2 z-20">
                                        <Badge variant="secondary" className="bg-black/60 backdrop-blur border-none">{news.category}</Badge>
                                    </div>
                                </div>
                                <CardHeader className="flex-1 p-5">
                                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                                        <Calendar className="mr-1 h-3 w-3" /> {news.date}
                                    </div>
                                    <CardTitle className="text-lg line-clamp-3 leading-snug group-hover:text-primary transition-colors">{news.title}</CardTitle>
                                </CardHeader>
                                <CardFooter className="p-5 pt-0">
                                    <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent hover:text-primary" asChild>
                                        <Link href={`/media/${news.slug}`}>
                                            Lire l'article <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="repertoire">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {mockFilms.map((film, i) => (
                            <Link key={i} href={`/films/${film.slug}`} className="group space-y-3">
                                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 border border-white/10 shadow-lg relative">
                                    <img src={film.img} alt={film.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="secondary" size="sm" className="rounded-full shadow-2xl">Voir détails</Button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white leading-tight group-hover:text-primary transition-colors line-clamp-1">{film.title}</h3>
                                    <p className="text-xs text-muted-foreground">{film.year} • {film.director}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
