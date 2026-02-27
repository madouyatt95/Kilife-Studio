import { NextResponse } from "next/server"
import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const { email, password, role } = await req.json()

        if (!email || !password || !role) {
            return NextResponse.json(
                { message: "Email, mot de passe et rôle sont obligatoires." },
                { status: 400 }
            )
        }

        if (!Object.values(Role).includes(role)) {
            return NextResponse.json({ message: "Rôle invalide." }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "Cet email est déjà utilisé." },
                { status: 409 }
            )
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                roles: [role],
            },
        })

        // Create empty profiles based on role
        if (role === Role.ACTOR) {
            await prisma.actorProfile.create({ data: { userId: user.id } })
        } else if (role === Role.PRO) {
            await prisma.proProfile.create({ data: { userId: user.id, companyName: "Nouveau Pro" } })
        } else if (role === Role.AGENT) {
            await prisma.agentProfile.create({ data: { userId: user.id, agencyName: "Nouvelle Agence" } })
        } else if (role === Role.CREW) {
            await prisma.crewProfile.create({ data: { userId: user.id } })
        }

        return NextResponse.json(
            { message: "Compte créé avec succès.", userId: user.id },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { message: "Une erreur est survenue lors de l'inscription." },
            { status: 500 }
        )
    }
}
