import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const query = searchParams.get("query") || ""

        const castings = await prisma.casting.findMany({
            where: {
                status: "PUBLISHED",
                titre: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            include: {
                proProfile: {
                    select: { companyName: true }
                }
            },
            orderBy: {
                publishedAt: "desc"
            }
        })

        return NextResponse.json(castings)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch castings" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.roles?.includes("PRO")) {
            return NextResponse.json({ error: "Unauthorized. Must be PRO." }, { status: 403 })
        }

        const proProfile = await prisma.proProfile.findUnique({
            where: { userId: session.user.id }
        })

        if (!proProfile) {
            return NextResponse.json({ error: "PRO Profile not found" }, { status: 404 })
        }

        const data = await req.json()

        const casting = await prisma.casting.create({
            data: {
                proId: proProfile.id,
                titre: data.titre,
                projet: data.projet,
                dates: data.dates,
                lieu: data.lieu,
                roles: data.roles || [],
                criteres: data.criteres,
                remuneration: data.remuneration,
                deadline: new Date(data.deadline),
                status: "PUBLISHED",
                publishedAt: new Date()
            }
        })

        return NextResponse.json(casting, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create casting" }, { status: 500 })
    }
}
