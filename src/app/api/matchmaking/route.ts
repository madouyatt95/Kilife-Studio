import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await auth()
        const url = new URL(req.url)
        const castingId = url.searchParams.get("castingId")

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const roles = session.user.roles as unknown as string[]

        if (!roles.includes("PRO")) {
            return NextResponse.json({ error: "Accès refusé - Rôle PRO requis" }, { status: 403 })
        }

        if (!castingId) {
            return NextResponse.json({ error: "ID de casting manquant" }, { status: 400 })
        }

        // Vérifier que le Pro possède ce casting
        const proProfile = await prisma.proProfile.findUnique({
            where: { userId: session.user.id }
        })

        if (!proProfile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 })

        const casting = await prisma.casting.findFirst({
            where: { id: castingId, proId: proProfile.id }
        })

        if (!casting) {
            return NextResponse.json({ error: "Casting introuvable ou non autorisé" }, { status: 404 })
        }

        // Récupérer et parser les critères
        let criteres: any = {}
        try {
            if (casting.criteres) criteres = JSON.parse(casting.criteres)
        } catch (e) {
            console.warn("Erreur de parsing des critères pour le casting:", castingId)
        }

        const { ageMin, ageMax, ville, competences = [] } = criteres

        // Construire la requête pour trouver les acteurs correspondants
        const whereClause: any = { status: "APPROVED" } // Idéalement, on ne suggère que les profils approuvés

        if (ageMin || ageMax) {
            whereClause.age = {}
            if (ageMin) whereClause.age.gte = parseInt(ageMin as string)
            if (ageMax) whereClause.age.lte = parseInt(ageMax as string)
        }

        if (ville) {
            // mode: insensitive is not universally supported depending on DB config, using simple contains
            whereClause.ville = { contains: ville, mode: "insensitive" }
        }

        if (competences && competences.length > 0) {
            // Acteurs ayant au moins une de ces compétences
            whereClause.competences = { hasSome: competences }
        }

        // Exécuter la recherche
        const matchedActors = await prisma.actorProfile.findMany({
            where: whereClause,
            include: {
                user: {
                    select: { name: true, email: true } // Name will be handled if needed, DB only has email right now natively or via Agent
                },
                endorsements: {
                    select: { rating: true }
                }
            },
            take: 20 // Limiter à 20 suggestions
        })

        // On classe les résultats de findMany avec un algorithme "MatchScore"
        const scoredMatches = matchedActors.map((actor: any) => {
            let score = 0

            // Si la ville match parfaitement
            if (ville && actor.ville?.toLowerCase().includes((ville as string).toLowerCase())) score += 30

            // Si l'âge est validé
            if (ageMin && ageMax && actor.age && actor.age >= parseInt(ageMin as string) && actor.age <= parseInt(ageMax as string)) score += 40

            // Ratio de compétences
            const matchedSkills = actor.competences?.filter((c: string) => competences.includes(c)).length || 0
            if (competences && competences.length > 0) {
                score += (matchedSkills / competences.length) * 30
            }

            // Bonus d'activité / Qualité de profil
            if (actor.completenessScore) score += (actor.completenessScore / 100) * 10
            // if (actor.endorsements && actor.endorsements.length > 0) score += 10

            return {
                ...actor,
                matchScore: Math.min(Math.round(score), 100) // Max 100%
            }
        })

        // Trier par meilleur score d'abord
        scoredMatches.sort((a, b) => b.matchScore - a.matchScore)

        return NextResponse.json(scoredMatches)

    } catch (error) {
        console.error("Erreur API Matchmaking:", error)
        return NextResponse.json(
            { error: "Une erreur est survenue lors de l'algorithme de suggestion." },
            { status: 500 }
        )
    }
}
