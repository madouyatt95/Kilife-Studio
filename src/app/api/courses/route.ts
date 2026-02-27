import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const query = searchParams.get("query") || ""

        const courses = await prisma.course.findMany({
            where: {
                titre: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            include: {
                modules: {
                    include: { lessons: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(courses)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
    }
}
