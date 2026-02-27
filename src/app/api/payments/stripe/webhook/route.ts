import { NextResponse } from "next/server"
import Stripe from "stripe"
import { PrismaClient } from "@prisma/client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-02-25.clover"
})

const prisma = new PrismaClient()
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
    const payload = await req.text()
    const signature = req.headers.get("stripe-signature")

    let event: Stripe.Event;

    try {
        if (!signature || !endpointSecret) {
            throw new Error("Missing Stripe signature or webhook secret")
        }
        event = stripe.webhooks.constructEvent(payload, signature, endpointSecret)
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ error: err.message }, { status: 400 })
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session

                // Fulfill the purchase based on metadata
                const metadata = session.metadata
                if (!metadata?.userId || !metadata?.productType) {
                    throw new Error("Missing metadata in checkout session")
                }

                const payment = await prisma.payment.create({
                    data: {
                        userId: metadata.userId,
                        provider: "STRIPE",
                        status: "COMPLETED",
                        amount: session.amount_total ? session.amount_total / 100 : 0,
                        currency: session.currency || "eur",
                        reference: session.id,
                        productType: metadata.productType
                    }
                })

                if (metadata.productType === "ACTOR_PREMIUM") {
                    // Upgrade actor to premium (pseudo-code depending on your exact model fields)
                    // await prisma.user.update({ where: { id: metadata.userId }, data: { isPremium: true }})
                } else if (metadata.productType.includes("SUBSCRIPTION")) {
                    await prisma.subscription.create({
                        data: {
                            userId: metadata.userId,
                            plan: metadata.productType,
                            stripeSubId: session.subscription as string,
                            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 month rough mock
                        }
                    })
                }

                console.log(`Payment ${payment.id} fulfilled for user ${metadata.userId}`)
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription
                await prisma.subscription.updateMany({
                    where: { stripeSubId: subscription.id },
                    data: { validUntil: new Date() } // Expire it now
                })
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        console.error(`Webhook processing error: ${error.message}`)
        return NextResponse.json({ error: "Webhook processing error" }, { status: 500 })
    }
}
