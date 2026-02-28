"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n-context"

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { t } = useI18n()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const role = formData.get("role") as string

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }),
            })

            if (res.ok) {
                toast.success("Compte créé avec succès")
                // Automatic sign in after registration
                await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                })
                router.push("/dashboard")
                router.refresh()
            } else {
                const data = await res.json()
                toast.error(data.message || "Erreur d'inscription")
            }
        } catch (err) {
            toast.error("Une erreur est survenue")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        {t("auth.registerTitle")}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t("auth.registerSubtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("auth.email")}</Label>
                            <Input id="email" name="email" type="email" placeholder="m.diop@exemple.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t("auth.password")}</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">{t("auth.role")}</Label>
                            <Select name="role" required defaultValue="ACTOR">
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisissez votre profil" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTOR">Talent (Acteur, Figurant)</SelectItem>
                                    <SelectItem value="CREW">Technicien (Réal, Son, Image...)</SelectItem>
                                    <SelectItem value="PRO">Professionnel (Production, Casting)</SelectItem>
                                    <SelectItem value="AGENT">Agent Artistique / Agence</SelectItem>
                                    <SelectItem value="STUDENT">Étudiant (Académie)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? t("common.loading") : t("auth.registerSubmit")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center justify-center">
                    <span className="text-sm text-slate-500">
                        {t("auth.hasAccount")}{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            {t("nav.login")}
                        </Link>
                    </span>
                </CardFooter>
            </Card>
        </div>
    )
}
