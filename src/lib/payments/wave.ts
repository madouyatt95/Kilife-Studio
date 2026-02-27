import { PaymentRequest, PaymentResult } from "./index"

/**
 * MOCK Implementation for Wave Sénégal.
 * In production, you would use an aggregator API (like TouchPay, PayDunya, Kkiapay) 
 * or the official Wave Business API if available.
 */
export async function createWaveMockSession(request: PaymentRequest): Promise<PaymentResult> {
    const mockReference = `WAVE_MOCK_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Here you would normally do an HTTP POST to the aggregator
    // const res = await fetch("https://api.aggregator.sn/v1/payment", { ... })
    // const data = await res.json()

    // For this mock, we redirect to a local mock checkout page
    const checkoutUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/mock-payment?provider=wave&ref=${mockReference}&amount=${request.amount}`

    return {
        checkoutUrl,
        reference: mockReference
    }
}
