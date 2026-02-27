"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            })

            if (res?.error) {
                toast.error("Identifiants incorrects")
            } else {
                toast.success("Connexion réussie")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            toast.error("Erreur de connexion")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        Connexion
                    </CardTitle>
                    <CardDescription className="text-center">
                        Entrez votre email pour vous connecter à Ciné Sénégal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m.diop@exemple.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Chargement..." : "Se connecter"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center justify-center">
                    <span className="text-sm text-slate-500">
                        Pas encore de compte ?{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            S'inscrire
                        </Link>
                    </span>
                </CardFooter>
            </Card>
        </div>
    )
}
