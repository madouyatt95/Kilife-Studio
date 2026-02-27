import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("category")
        const search = searchParams.get("search")

        const articles = await prisma.article.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(search && {
                    titre: { contains: search, mode: "insensitive" }
                })
            },
            include: {
                author: {
                    select: { email: true, avatarUrl: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(articles)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }
}
