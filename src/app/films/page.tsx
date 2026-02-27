import { Metadata } from "next"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"

const prisma = new PrismaClient()

export const metadata: Metadata = {
    title: "Films | Ciné Sénégal",
    description: "Découvrez les films, séries et courts-métrages réalisés au Sénégal.",
}

// Force dynamic rendering - DB not available at build time on Vercel
export const dynamic = "force-dynamic"

export default async function FilmsPage() {
    const films = await prisma.film.findMany({
        where: {
            isPublished: true
        },
        orderBy: {
            annee: 'desc'
        },
        include: {
            _count: {
                select: { acteurs: true }
            }
        }
    })

    return (
        <div className="container py-8 max-w-7xl mx-auto px-4">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Cinémathèque</h1>
                <p className="text-slate-400">
                    Découvrez les productions sénégalaises et leur casting.
                </p>
            </div>

            {films.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-lg border border-slate-800">
                    <p className="text-slate-400">Aucun film publié pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {films.map((film) => (
                        <Link key={film.id} href={`/films/${film.slug}`}>
                            <div className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors aspect-[2/3] flex flex-col">
                                {film.affiche ? (
                                    <div className="relative flex-1 w-full">
                                        <Image
                                            src={film.affiche}
                                            alt={`Affiche ${film.titre}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </div>
                                ) : (
                                    <div className="flex-1 w-full flex items-center justify-center bg-slate-900">
                                        <span className="text-slate-600 text-sm font-medium">Pas d'affiche</span>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="font-semibold text-white truncate">{film.titre}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-slate-300">{film.annee}</span>
                                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                            {film._count.acteurs} Acteurs
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
