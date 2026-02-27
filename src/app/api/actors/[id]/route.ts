import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const actor = await prisma.actorProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        avatarUrl: true,
                        email: true,
                    }
                }
            }
        })

        if (!actor) {
            return NextResponse.json({ error: "Actor not found" }, { status: 404 })
        }

        if (actor.status !== "APPROVED") {
            // Might allow if it's the user themselves, but this is a public endpoint
            return NextResponse.json({ error: "Profile not public yet" }, { status: 403 })
        }

        return NextResponse.json(actor)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch actor" }, { status: 500 })
    }
}
