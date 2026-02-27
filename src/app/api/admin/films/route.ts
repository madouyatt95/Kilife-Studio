import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Utility pour transformer le titre en slug (ex: "Le Film" -> "le-film")
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const roles = session.user.roles as unknown as string[]

        // Seuls les Admins ou les Pros peuvent soumettre un film à la base de données IMDB
        if (!roles.includes("ADMIN") && !roles.includes("PRO")) {
            return NextResponse.json({ error: "Accès refusé - Réservé aux Pros et Admins" }, { status: 403 })
        }

        const body = await req.json()
        const { titre, annee, synopsis, realisateur, affiche, trailerUrl, acteurIds = [] } = body

        if (!titre || !annee || !synopsis || !realisateur) {
            return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
        }

        let baseSlug = slugify(titre)
        let slug = baseSlug
        let counter = 1

        // S'assurer que le slug est unique
        while (await prisma.film.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        // Création du film. isPublished à 'false' par défaut si c'est un PRO (nécessite validation admin)
        // isPublished à 'true' si c'est l'ADMIN directement
        const isPublished = roles.includes("ADMIN")

        const filmData: any = {
            titre,
            slug,
            annee: parseInt(annee),
            synopsis,
            realisateur,
            affiche: affiche || null,
            trailerUrl: trailerUrl || null,
            isPublished,
        }

        if (acteurIds && acteurIds.length > 0) {
            filmData.acteurs = {
                connect: acteurIds.map((id: string) => ({ id }))
            }
        }

        const newFilm = await prisma.film.create({
            data: filmData
        })

        return NextResponse.json(
            { message: isPublished ? "Film publié avec succès" : "Film soumis et en attente de modération", film: newFilm },
            { status: 201 }
        )

    } catch (error) {
        console.error("Erreur API Soumission Film:", error)
        return NextResponse.json(
            { error: "Une erreur est survenue lors de la soumission du film." },
            { status: 500 }
        )
    }
}
