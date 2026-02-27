import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"


// GET: List endorsements for a specific actor
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const actorProfileId = searchParams.get("actorProfileId")

        if (!actorProfileId) {
            return NextResponse.json({ error: "actorProfileId requis" }, { status: 400 })
        }

        const endorsements = await prisma.endorsement.findMany({
            where: { actorProfileId },
            include: {
                pro: { select: { companyName: true, isVerified: true } }
            },
            orderBy: { createdAt: "desc" }
        })

        const avgRating = endorsements.length > 0
            ? endorsements.reduce((sum, e) => sum + e.rating, 0) / endorsements.length
            : 0

        return NextResponse.json({
            endorsements,
            averageRating: Math.round(avgRating * 10) / 10,
            totalEndorsements: endorsements.length
        })
    } catch (error) {
        console.error("Endorsements GET error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

// POST: A Pro leaves an endorsement for an actor they worked with
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.roles?.includes("PRO")) {
            return NextResponse.json({ error: "Seuls les Professionnels peuvent laisser des recommandations." }, { status: 401 })
        }

        const proProfile = await prisma.proProfile.findUnique({
            where: { userId: session.user.id }
        })

        if (!proProfile) {
            return NextResponse.json({ error: "Profil professionnel introuvable." }, { status: 404 })
        }

        const { actorProfileId, rating, comment } = await req.json()

        if (!actorProfileId || !rating) {
            return NextResponse.json({ error: "actorProfileId et rating sont obligatoires." }, { status: 400 })
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Le rating doit être entre 1 et 5." }, { status: 400 })
        }

        // Check the actor profile exists
        const actorProfile = await prisma.actorProfile.findUnique({
            where: { id: actorProfileId }
        })

        if (!actorProfile) {
            return NextResponse.json({ error: "Profil acteur introuvable." }, { status: 404 })
        }

        // Upsert: update if already endorsed, create if new
        const endorsement = await prisma.endorsement.upsert({
            where: {
                proId_actorProfileId: {
                    proId: proProfile.id,
                    actorProfileId
                }
            },
            update: { rating, comment },
            create: {
                proId: proProfile.id,
                actorProfileId,
                rating,
                comment
            }
        })

        return NextResponse.json({ success: true, endorsement }, { status: 201 })
    } catch (error) {
        console.error("Endorsements POST error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
