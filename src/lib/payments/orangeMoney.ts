import { PaymentRequest, PaymentResult } from "./index"

/**
 * MOCK Implementation for Orange Money Sénégal.
 */
export async function createOrangeMoneyMockSession(request: PaymentRequest): Promise<PaymentResult> {
    const mockReference = `OM_MOCK_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const checkoutUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/mock-payment?provider=orangemoney&ref=${mockReference}&amount=${request.amount}`

    return {
        checkoutUrl,
        reference: mockReference
    }
}
