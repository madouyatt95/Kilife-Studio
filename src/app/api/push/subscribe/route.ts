import { NextResponse } from "next/server"
import webpush from "web-push"

// Normalement stocké en DB (Prisma)
const subscriptions: any[] = []

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const privateKey = process.env.VAPID_PRIVATE_KEY

if (publicKey && privateKey) {
    webpush.setVapidDetails(
        "mailto:contact@cinesenegal.sn",
        publicKey,
        privateKey
    )
}

export async function POST(req: Request) {
    try {
        const subscription = await req.json()

        // Check if subscription already exists, if not save to DB attached to the User (omitted for brevity)
        subscriptions.push(subscription)

        // Send a welcome notification
        const payload = JSON.stringify({
            title: "Ciné Sénégal",
            body: "Notifications activées ! Vous recevrez nos alertes de Casting.",
            icon: "/icons/icon-192x192.png"
        })

        await webpush.sendNotification(subscription, payload)

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }
}
