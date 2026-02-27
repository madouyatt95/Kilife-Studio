// src/lib/payments/index.ts
import { PaymentProvider } from "@prisma/client"
import { createStripeCheckoutSession } from "./stripe"
import { createWaveMockSession } from "./wave"
import { createOrangeMoneyMockSession } from "./orangeMoney"

export interface PaymentRequest {
    userId: string
    amount: number
    productType: "ACTOR_PREMIUM" | "PRO_SUBSCRIPTION" | "ACADEMY_SUBSCRIPTION" | "COURSE_ONE_TIME" | "PROFILE_BOOST"
    metadata?: Record<string, string>
}

export interface PaymentResult {
    checkoutUrl: string
    reference: string
}

export async function createPaymentSession(
    provider: PaymentProvider,
    request: PaymentRequest
): Promise<PaymentResult> {
    switch (provider) {
        case PaymentProvider.STRIPE:
            return createStripeCheckoutSession(request)
        case PaymentProvider.WAVE:
            return createWaveMockSession(request)
        case PaymentProvider.ORANGE_MONEY:
            return createOrangeMoneyMockSession(request)
        default:
            throw new Error(`Unsupported payment provider: ${provider}`)
    }
}
