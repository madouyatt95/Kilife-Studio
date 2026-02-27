import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"


// GET /api/matchmaking?castingId=xxx
// Returns actor profiles ranked by relevance to the casting criteria
export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.roles?.includes("PRO")) {
            return NextResponse.json({ error: "Accès réservé aux Professionnels." }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const castingId = searchParams.get("castingId")

        if (!castingId) {
            return NextResponse.json({ error: "castingId requis" }, { status: 400 })
        }

        // Fetch the casting and its criteria
        const casting = await prisma.casting.findUnique({
            where: { id: castingId },
            include: { proProfile: true }
        })

        if (!casting) {
            return NextResponse.json({ error: "Casting introuvable" }, { status: 404 })
        }

        // Verify the Pro owns this casting
        if (casting.proProfile.userId !== session.user.id) {
            return NextResponse.json({ error: "Ce casting ne vous appartient pas." }, { status: 403 })
        }

        // Parse casting criteria - expects JSON like { ville, ageMin, ageMax, competences[], langues[] }
        let criteres: {
            ville?: string
            ageMin?: number
            ageMax?: number
            competences?: string[]
            langues?: string[]
        } = {}

        if (casting.criteres) {
            try {
                criteres = JSON.parse(casting.criteres)
            } catch {
                // If criteres is a plain string, use it as a ville filter
                criteres = { ville: casting.criteres }
            }
        }

        // Get actors who haven't already applied to this casting
        const existingApplications = await prisma.castingApplication.findMany({
            where: { castingId },
            select: { actorId: true }
        })
        const alreadyAppliedIds = existingApplications.map(a => a.actorId)

        // Build the query filter
        const where: any = {
            status: "APPROVED",
            user: {
                id: { notIn: alreadyAppliedIds }
            }
        }

        if (criteres.ville) {
            where.ville = { contains: criteres.ville, mode: "insensitive" }
        }

        if (criteres.ageMin || criteres.ageMax) {
            where.age = {}
            if (criteres.ageMin) where.age.gte = criteres.ageMin
            if (criteres.ageMax) where.age.lte = criteres.ageMax
        }

        // Fetch matching profiles
        const profiles = await prisma.actorProfile.findMany({
            where,
            include: {
                user: { select: { email: true } },
                endorsements: { select: { rating: true } }
            },
            take: 50
        })

        // Score each profile based on criteria match
        const scored = profiles.map(profile => {
            let score = 0
            let matchDetails: string[] = []

            // City match (+30 points)
            if (criteres.ville && profile.ville?.toLowerCase().includes(criteres.ville.toLowerCase())) {
                score += 30
                matchDetails.push("Ville ✓")
            }

            // Age match (+20 points)
            if (profile.age) {
                if (criteres.ageMin && criteres.ageMax && profile.age >= criteres.ageMin && profile.age <= criteres.ageMax) {
                    score += 20
                    matchDetails.push("Âge ✓")
                }
            }

            // Skills match (+10 points per matching skill)
            if (criteres.competences && criteres.competences.length > 0) {
                const matchingSkills = profile.competences.filter(c =>
                    criteres.competences!.some(cc => c.toLowerCase().includes(cc.toLowerCase()))
                )
                score += matchingSkills.length * 10
                if (matchingSkills.length > 0) matchDetails.push(`${matchingSkills.length} compétence(s) ✓`)
            }

            // Language match (+10 per matching language)
            if (criteres.langues && criteres.langues.length > 0) {
                const matchingLang = profile.langues.filter(l =>
                    criteres.langues!.some(cl => l.toLowerCase().includes(cl.toLowerCase()))
                )
                score += matchingLang.length * 10
                if (matchingLang.length > 0) matchDetails.push(`${matchingLang.length} langue(s) ✓`)
            }

            // Profile completeness bonus (+5 per 20% completeness)
            score += Math.floor(profile.completenessScore / 20) * 5

            // Endorsement bonus (+5 per endorsement, capped at 25)
            const endorsementBonus = Math.min(profile.endorsements.length * 5, 25)
            score += endorsementBonus
            if (profile.endorsements.length > 0) {
                const avgRating = profile.endorsements.reduce((s, e) => s + e.rating, 0) / profile.endorsements.length
                matchDetails.push(`${avgRating.toFixed(1)}★ (${profile.endorsements.length} avis)`)
            }

            // Verified profile bonus (+10)
            if (profile.isVerified) {
                score += 10
                matchDetails.push("Vérifié ✓")
            }

            return {
                ...profile,
                matchScore: score,
                matchDetails
            }
        })

        // Sort by score descending
        scored.sort((a, b) => b.matchScore - a.matchScore)

        return NextResponse.json({
            casting: { id: casting.id, titre: casting.titre, lieu: casting.lieu },
            suggestions: scored,
            totalFound: scored.length
        })

    } catch (error) {
        console.error("Matchmaking error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
