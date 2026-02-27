import { DefaultSession, DefaultUser } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            roles: Role[]
            subscriptionPlan?: string | null
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        roles: Role[]
        subscriptionPlan?: string | null
    }
}
