import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET: List talents managed by the authenticated agent
export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.roles?.includes("AGENT")) {
            return NextResponse.json({ error: "Accès réservé aux Agents." }, { status: 401 })
        }

        const agentProfile = await prisma.agentProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                talents: {
                    include: { user: { select: { email: true } } }
                }
            }
        })

        if (!agentProfile) {
            return NextResponse.json({ error: "Profil agent introuvable." }, { status: 404 })
        }

        return NextResponse.json({ talents: agentProfile.talents, agencyName: agentProfile.agencyName })
    } catch (error) {
        console.error("Agent talents GET error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

// POST: Link an existing actor to the agent, or create a new actor profile under the agent
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.roles?.includes("AGENT")) {
            return NextResponse.json({ error: "Accès réservé aux Agents." }, { status: 401 })
        }

        const agentProfile = await prisma.agentProfile.findUnique({
            where: { userId: session.user.id }
        })

        if (!agentProfile) {
            return NextResponse.json({ error: "Profil agent introuvable." }, { status: 404 })
        }

        const { actorProfileId, newTalent } = await req.json()

        // Option 1: Link an existing actor profile
        if (actorProfileId) {
            const updated = await prisma.actorProfile.update({
                where: { id: actorProfileId },
                data: { agentId: agentProfile.id }
            })
            return NextResponse.json({ success: true, talent: updated })
        }

        // Option 2: Create a brand new actor user + profile under this agent
        if (newTalent?.email) {
            const existingUser = await prisma.user.findUnique({ where: { email: newTalent.email } })
            if (existingUser) {
                return NextResponse.json({ error: "Un utilisateur avec cet email existe déjà." }, { status: 409 })
            }

            const newUser = await prisma.user.create({
                data: {
                    email: newTalent.email,
                    roles: ["ACTOR"],
                    actorProfile: {
                        create: {
                            bio: newTalent.bio || "",
                            ville: newTalent.ville || "",
                            competences: newTalent.competences || [],
                            agentId: agentProfile.id
                        }
                    }
                },
                include: { actorProfile: true }
            })

            return NextResponse.json({ success: true, talent: newUser.actorProfile }, { status: 201 })
        }

        return NextResponse.json({ error: "Fournissez un actorProfileId ou un objet newTalent." }, { status: 400 })
    } catch (error) {
        console.error("Agent talents POST error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

// DELETE: Unlink an actor profile from the agent
export async function DELETE(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.roles?.includes("AGENT")) {
            return NextResponse.json({ error: "Accès réservé aux Agents." }, { status: 401 })
        }

        const { actorProfileId } = await req.json()

        const agentProfile = await prisma.agentProfile.findUnique({
            where: { userId: session.user.id }
        })

        if (!agentProfile) {
            return NextResponse.json({ error: "Profil agent introuvable." }, { status: 404 })
        }

        // Verify the actor belongs to this agent before unlinking
        const actor = await prisma.actorProfile.findFirst({
            where: { id: actorProfileId, agentId: agentProfile.id }
        })

        if (!actor) {
            return NextResponse.json({ error: "Ce talent n'est pas sous votre gestion." }, { status: 403 })
        }

        await prisma.actorProfile.update({
            where: { id: actorProfileId },
            data: { agentId: null }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Agent talents DELETE error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
