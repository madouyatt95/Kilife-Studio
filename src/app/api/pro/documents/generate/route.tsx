import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { renderToStream } from "@react-pdf/renderer"
import ContractTemplate from "./ContractTemplate"


export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user || !session.user.roles?.includes("PRO")) {
            return NextResponse.json({ error: "Unauthorized. Pro access required." }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                subscriptions: {
                    where: {
                        plan: "PRO_SUBSCRIPTION",
                        validUntil: { gt: new Date() }
                    }
                }
            }
        })

        if (!user || user.subscriptions.length === 0) {
            return NextResponse.json({ error: "Un abonnement PRO Premium actif est requis pour générer des contrats." }, { status: 403 })
        }

        const { applicationId, type } = await req.json()

        if (!applicationId || !type) {
            return NextResponse.json({ error: "Missing applicationId or document type" }, { status: 400 })
        }

        // Fetch application details to prefill the contract
        const application = await prisma.castingApplication.findUnique({
            where: { id: applicationId },
            include: {
                actor: {
                    include: { actorProfile: true }
                },
                casting: {
                    include: { proProfile: true }
                }
            }
        })

        if (!application) {
            return NextResponse.json({ error: "Casting application not found" }, { status: 404 })
        }

        // Ensure the Pro requesting the document is the owner of the casting
        if (application.casting.proProfile.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden. Not your casting." }, { status: 403 })
        }

        const data = {
            proName: application.casting.proProfile.companyName || "Production",
            proSiret: application.casting.proProfile.siret || "Non renseigné",
            actorName: application.actor.actorProfile?.bio?.split("\n")[0] || "Acteur", // Rough guess of name or use Email later
            actorEmail: application.actor.email,
            castingTitle: application.casting.titre,
            castingDates: application.casting.dates,
            castingLieu: application.casting.lieu,
            remuneration: application.casting.remuneration || "Non rémunéré",
            documentType: type // "ENGAGEMENT" or "IMAGE_RIGHTS"
        }

        const stream = await renderToStream(<ContractTemplate data={data} />)

        // Convert Node.js Stream to Web Stream for Next.js Response
        const webStream = new ReadableStream({
            start(controller) {
                stream.on("data", (chunk) => controller.enqueue(chunk))
                stream.on("end", () => controller.close())
                stream.on("error", (err) => controller.error(err))
            },
        })

        // Log the document generation in the database
        await prisma.document.create({
            data: {
                proId: application.casting.proId,
                castingId: application.castingId,
                applicationId: application.id,
                titre: `Contrat - ${data.actorName} - ${application.casting.titre}`,
                type: type,
                status: "GENERATED"
            }
        })

        return new NextResponse(webStream, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="contrat_${type}_${application.id}.pdf"`,
            },
        })

    } catch (error) {
        console.error("PDF generation error:", error)
        return NextResponse.json({ error: "Failed to generate document" }, { status: 500 })
    }
}
