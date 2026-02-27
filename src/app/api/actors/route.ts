import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const query = searchParams.get("query") || ""
        const competences = searchParams.getAll("competence")
        const gender = searchParams.get("gender")

        const actors = await prisma.actorProfile.findMany({
            where: {
                status: "APPROVED",
                user: {
                    email: {
                        contains: query, // Replace with proper name search if user model had names
                        mode: "insensitive"
                    }
                },
                ...(competences.length > 0 && {
                    competences: {
                        hasSome: competences
                    }
                })
            },
            include: {
                user: {
                    select: {
                        id: true,
                        avatarUrl: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                completenessScore: "desc"
            }
        })

        return NextResponse.json(actors)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch actors" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await req.json()

        // Enforce completeness score rules here maybe?
        let score = 0
        if (data.bio) score += 20
        if (data.photo) score += 20
        if (data.competences?.length > 0) score += 15
        if (data.demoVideoId) score += 25
        if (data.cvUrl) score += 20

        const profile = await prisma.actorProfile.update({
            where: { userId: session.user.id },
            data: {
                ...data,
                completenessScore: score,
                status: score >= 80 ? "PENDING_REVIEW" : "DRAFT"
            }
        })

        return NextResponse.json(profile)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
