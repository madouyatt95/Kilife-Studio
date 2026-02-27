import Stripe from "stripe"
import { PaymentRequest, PaymentResult } from "./index"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-11-20.acacia"
})

export async function createStripeCheckoutSession(request: PaymentRequest): Promise<PaymentResult> {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: request.productType.includes("SUBSCRIPTION") ? "subscription" : "payment",
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: formatProductName(request.productType),
                    },
                    unit_amount: request.amount * 100, // Stripe expects cents
                    ...(request.productType.includes("SUBSCRIPTION") && {
                        recurring: { interval: "month" }
                    })
                },
                quantity: 1,
            },
        ],
        metadata: {
            userId: request.userId,
            productType: request.productType,
            ...request.metadata
        },
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=cancelled`,
    })

    return {
        checkoutUrl: session.url || "",
        reference: session.id
    }
}

function formatProductName(type: string): string {
    const maps: Record<string, string> = {
        "ACTOR_PREMIUM": "Ciné Sénégal - Profil Acteur Premium",
        "PRO_SUBSCRIPTION": "Ciné Sénégal - Abonnement PRO",
        "ACADEMY_SUBSCRIPTION": "Académie - Accès Illimité",
        "COURSE_ONE_TIME": "Académie - Achat de Cours",
        "PROFILE_BOOST": "Ciné Sénégal - Boost Profil"
    }
    return maps[type] || "Ciné Sénégal Service"
}
