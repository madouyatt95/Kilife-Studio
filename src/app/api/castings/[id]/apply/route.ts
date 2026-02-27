import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth()
        if (!session?.user?.roles?.includes("ACTOR")) {
            return NextResponse.json({ error: "Unauthorized. Must be ACTOR." }, { status: 403 })
        }

        const { message, pieces } = await req.json()

        // Optionally check if actor already applied
        const existing = await prisma.castingApplication.findUnique({
            where: {
                castingId_actorId: {
                    castingId: params.id,
                    actorId: session.user.id
                }
            }
        })

        if (existing) {
            return NextResponse.json({ error: "Vous avez déjà postulé à ce casting." }, { status: 400 })
        }

        const application = await prisma.castingApplication.create({
            data: {
                castingId: params.id,
                actorId: session.user.id,
                message,
                pieces: pieces || [],
                status: "PENDING"
            }
        })

        return NextResponse.json(application, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to apply to casting" }, { status: 500 })
    }
}
