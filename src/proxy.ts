import { auth } from "@/auth"
import { NextResponse } from "next/server"

const protectedRoutes = ["/dashboard", "/admin", "/castings", "/academie"]
const adminRoutes = ["/admin"]
const authRoutes = ["/login", "/register"]

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route))
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl))
    }

    if (isAdminRoute && isLoggedIn) {
        const roles = req.auth?.user?.roles || []
        // @ts-ignore
        if (!roles.includes("ADMIN")) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
