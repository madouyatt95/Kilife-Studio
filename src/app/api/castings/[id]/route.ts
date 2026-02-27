import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const casting = await prisma.casting.findUnique({
            where: { id },
            include: {
                proProfile: {
                    select: { companyName: true, siteWeb: true }
                }
            }
        })

        if (!casting) {
            return NextResponse.json({ error: "Casting not found" }, { status: 404 })
        }

        if (casting.status !== "PUBLISHED") {
            return NextResponse.json({ error: "Casting non disponible" }, { status: 403 })
        }

        return NextResponse.json(casting)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch casting" }, { status: 500 })
    }
}
