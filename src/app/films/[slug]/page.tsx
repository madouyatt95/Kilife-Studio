import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { PlayCircle, Calendar, Users, Film as FilmIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Allow dynamic params
export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const film = await prisma.film.findUnique({
        where: { slug: params.slug },
        select: { titre: true, synopsis: true, affiche: true }
    })

    if (!film) return { title: "Film introuvable - Ciné Sénégal" }

    return {
        title: `${film.titre} | Ciné Sénégal`,
        description: film.synopsis,
        openGraph: film.affiche ? { images: [film.affiche] } : undefined
    }
}

export default async function FilmDetailPage({ params }: { params: { slug: string } }) {
    const film = await prisma.film.findUnique({
        where: { slug: params.slug, isPublished: true },
        include: {
            acteurs: {
                include: { user: { select: { id: true } } }
            },
            equipeTechnique: {
                include: { user: { select: { id: true } } }
            }
        }
    })

    if (!film) return notFound()

    return (
        <div className="bg-slate-950 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full">
                {film.affiche && (
                    <Image
                        src={film.affiche}
                        alt={`Affiche de ${film.titre}`}
                        fill
                        className="object-cover opacity-40 blur-sm"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

                <div className="absolute inset-0 flex items-end">
                    <div className="container max-w-7xl mx-auto px-4 pb-12">
                        <div className="flex flex-col md:flex-row gap-8 items-end">
                            {/* Poster Thumbnail */}
                            <div className="hidden md:block w-64 aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 shrink-0">
                                {film.affiche ? (
                                    <Image src={film.affiche} alt="Affiche détaillée" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                        <FilmIcon className="w-12 h-12 text-slate-500" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-4">
                                <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10">
                                    <Calendar className="w-3 h-3 mr-1" /> {film.annee}
                                </Badge>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2">
                                    {film.titre}
                                </h1>

                                <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
                                    {film.synopsis}
                                </p>

                                <div className="flex items-center gap-4 pt-4">
                                    {film.trailerUrl && (
                                        <Button asChild size="lg" className="rounded-full gap-2">
                                            <a href={film.trailerUrl} target="_blank" rel="noopener noreferrer">
                                                <PlayCircle className="w-5 h-5" /> Bande Annonce
                                            </a>
                                        </Button>
                                    )}
                                    <div className="flex items-center text-sm text-slate-400">
                                        <span className="font-semibold text-white mr-2">Réalisateur :</span>
                                        {film.realisateur}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Casting Section */}
            <div className="container max-w-7xl mx-auto px-4 py-16 space-y-16">

                {film.acteurs.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-2">
                            <Users className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold tracking-tight">Casting (Acteurs)</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {film.acteurs.map((acteur) => (
                                <Link key={acteur.id} href={`/talents/${acteur.id}`}>
                                    <div className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col items-center p-3">
                                        <div className="w-24 h-24 relative rounded-full overflow-hidden mb-3 border-2 border-slate-800 group-hover:border-primary transition-colors">
                                            {acteur.photo ? (
                                                <Image src={acteur.photo} alt="Photo talent" fill className="object-cover" sizes="96px" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs">No Photo</div>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-sm text-center line-clamp-2">
                                            Profil Cine
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Technical Crew Section */}
                {film.equipeTechnique.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-2">
                            <FilmIcon className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold tracking-tight">Équipe Technique</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {film.equipeTechnique.map((crew) => (
                                <Link key={crew.id} href={`/talents/crew/${crew.id}`}>
                                    <div className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col items-center p-3">
                                        <div className="w-20 h-20 relative rounded-full overflow-hidden mb-3 border-2 border-slate-800 transition-colors">
                                            {crew.photo ? (
                                                <Image src={crew.photo} alt="Photo crew" fill className="object-cover" sizes="80px" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs">No Photo</div>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-sm text-center">Profil Technique</h3>
                                        <span className="text-xs text-slate-500 mt-1">{crew.professions[0] || 'Technicien'}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}


            </div>
        </div>
    )
}
