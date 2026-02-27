import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        // Vérifier si l'utilisateur est bien un AGENT
        // workaround for TypeScript type Role mismatch in session
        const roles = session.user.roles as unknown as string[]

        if (!roles.includes("AGENT")) {
            return NextResponse.json({ error: "Accès refusé - Rôle AGENT requis" }, { status: 403 })
        }

        // Trouver le profil Agent lié à cet utilisateur
        const agentProfile = await prisma.agentProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                talents: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        })

        if (!agentProfile) {
            return NextResponse.json({ error: "Profil Agent introuvable" }, { status: 404 })
        }

        return NextResponse.json(agentProfile.talents)

    } catch (error) {
        console.error("Erreur API Agents/Talents:", error)
        return NextResponse.json(
            { error: "Une erreur est survenue lors de la récupération des talents." },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const roles = session.user.roles as unknown as string[]

        if (!roles.includes("AGENT")) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
        }

        const body = await req.json()
        const { email } = body

        if (!email) {
            return NextResponse.json({ error: "L'email est requis" }, { status: 400 })
        }

        // Trouver le profil Agent
        const agentProf = await prisma.agentProfile.findUnique({
            where: { userId: session.user.id }
        })

        if (!agentProf) {
            return NextResponse.json({ error: "Profil Agent introuvable" }, { status: 404 })
        }

        // Chercher l'utilisateur ciblé par email
        const targetUser = await prisma.user.findUnique({
            where: { email },
            include: { actorProfile: true }
        })

        if (!targetUser) {
            return NextResponse.json({ error: "Aucun utilisateur trouvé avec cet email. Il doit d'abord s'inscrire." }, { status: 404 })
        }

        // Vérifier s'il a déjà un profil Acteur
        if (!targetUser.actorProfile) {
            return NextResponse.json({ error: "Cet utilisateur n'a pas encore créé de profil Acteur." }, { status: 400 })
        }

        if (targetUser.actorProfile.agentId === agentProf.id) {
            return NextResponse.json({ error: "Ce talent est déjà dans votre agence." }, { status: 400 })
        }

        // Lier l'acteur à l'agence
        await prisma.actorProfile.update({
            where: { id: targetUser.actorProfile.id },
            data: { agentId: agentProf.id }
        })

        return NextResponse.json({ message: "Talent lié avec succès" })

    } catch (error) {
        console.error("Erreur API Agents POST:", error)
        return NextResponse.json(
            { error: "Erreur lors de l'ajout du talent." },
            { status: 500 }
        )
    }
}
