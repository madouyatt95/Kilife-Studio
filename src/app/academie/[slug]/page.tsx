"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlayCircle, CheckCircle2, ChevronLeft, Lock } from "lucide-react"

export default function CourseDetailPage() {
    const params = useParams()
    const router = useRouter()
    // Mock data for the static UI
    const course = {
        titre: "Jeu d'acteur face caméra",
        modules: [
            {
                id: "m1",
                titre: "Module 1: Les Fondamentaux",
                lessons: [
                    { id: "l1", titre: "Introduction au jeu face caméra", duration: "12:05", completed: true, isLocked: false },
                    { id: "l2", titre: "Différence entre théâtre et cinéma", duration: "18:30", completed: false, isLocked: false },
                    { id: "l3", titre: "Gérer le trac sur un plateau", duration: "09:15", completed: false, isLocked: true },
                ]
            },
            {
                id: "m2",
                titre: "Module 2: Techniques Avancées",
                lessons: [
                    { id: "l4", titre: "Le regard et l'axe caméra", duration: "15:40", completed: false, isLocked: true },
                    { id: "l5", titre: "La voix en prise de son directe", duration: "22:10", completed: false, isLocked: true },
                ]
            }
        ]
    }

    const [activeLessonId, setActiveLessonId] = useState("l2") // Mocking that user left off here

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-950">

            {/* Video Player Main Area */}
            <div className="flex-1 flex flex-col border-r border-white/10">
                <div className="bg-black aspect-video relative flex items-center justify-center">
                    {/* Mocking the Provider rendering */}
                    <video
                        src="https://www.w3schools.com/html/mov_bbb.mp4"
                        controls
                        className="w-full h-full"
                        poster="https://images.unsplash.com/photo-1542204637-e67bc7d41e48?q=80&w=2070&auto=format&fit=crop"
                    />
                    {/* Watermark/Logo */}
                    <div className="absolute top-4 right-4 text-white/30 font-bold text-xl pointer-events-none select-none drop-shadow-lg">
                        CINÉ SÉNÉGAL
                    </div>
                </div>

                <div className="p-6 md:p-10 space-y-6 flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground" onClick={() => router.push("/academie")}><ChevronLeft className="mr-1 h-4 w-4" /> Retour catalogue</Button>
                        <h1 className="text-3xl font-bold text-white">Différence entre théâtre et cinéma</h1>
                        <p className="text-primary font-medium">{course.titre} • Module 1</p>
                    </div>

                    <div className="prose prose-invert max-w-none prose-sm leading-relaxed text-slate-300">
                        <h3>Objectifs de la leçon</h3>
                        <p>Dans cette leçon, nous allons explorer les différences fondamentales de projection émotionnelle entre la scène et l'objectif de la caméra. Vous apprendrez comment "réduire" votre jeu sans perdre en intensité.</p>
                        <ul>
                            <li>Comprendre le cadre et la distance focale</li>
                            <li>Micro-expressions vs mouvements amples</li>
                            <li>L'intimité avec l'objectif</li>
                        </ul>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                        <Button className="w-full sm:w-auto"><CheckCircle2 className="mr-2 h-4 w-4" /> Marquer comme terminé</Button>
                        <Button variant="outline" className="w-full sm:w-auto">Télécharger les notes (PDF)</Button>
                    </div>
                </div>
            </div>

            {/* Sidebar - Course Content */}
            <div className="w-full md:w-[400px] shrink-0 bg-slate-900 flex flex-col max-h-[calc(100vh-4rem)]">
                <div className="p-6 border-b border-white/10 space-y-4">
                    <h2 className="font-bold text-lg text-white line-clamp-2">{course.titre}</h2>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progression</span>
                            <span>12%</span>
                        </div>
                        <Progress value={12} className="h-2 bg-slate-800" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {course.modules.map((mod) => (
                        <div key={mod.id} className="space-y-2">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 px-2">{mod.titre}</h3>
                            <div className="space-y-1">
                                {mod.lessons.map((lesson) => {
                                    const isActive = lesson.id === activeLessonId;
                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${isActive
                                                    ? "bg-primary/20 border border-primary/30 text-primary"
                                                    : lesson.isLocked
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "hover:bg-white/5 text-slate-300"
                                                }`}
                                            onClick={() => !lesson.isLocked && setActiveLessonId(lesson.id)}
                                        >
                                            <div className="mr-3 mt-0.5 whitespace-nowrap">
                                                {lesson.completed ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : lesson.isLocked ? (
                                                    <Lock className="h-5 w-5 text-slate-500" />
                                                ) : isActive ? (
                                                    <PlayCircle className="h-5 w-5 fill-primary text-secondary" />
                                                ) : (
                                                    <PlayCircle className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`text-sm font-medium leading-tight ${isActive ? "text-primary" : "text-white"}`}>
                                                    {lesson.titre}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">{lesson.duration}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
