import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Clapperboard, GraduationCap, ArrowRight, Play, Film, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1485846234645-a62644ef7467?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale" />
        </div>

        <div className="container relative z-10 px-4 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary animate-pulse">
            <Star className="h-4 w-4 fill-primary" />
            <span className="text-xs font-bold tracking-widest uppercase italic">Le Futur du Studio Sénégalais</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
            L'EXCELLENCE DE <br />
            <span className="text-primary italic">KILIFE STUDIO</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 font-light leading-relaxed">
            Rejoignez la plateforme officielle des professionnels du cinéma.
            Talents, producteurs et passionnés réunis au cœur de la création.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full group bg-primary hover:bg-primary/90 text-black" asChild>
              <Link href="/register">
                Commencer l'Aventure <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-full border-white/20 text-white hover:bg-white/5 bg-transparent" asChild>
              <Link href="/media">
                <Play className="mr-2 h-5 w-5 fill-current" /> Voir le Showreel
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Overlay Visual */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-black border-y border-white/5">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-primary/20 transition-colors group">
              <Search className="h-12 w-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-4 italic">Registre des Talents</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Un annuaire national complet regroupant acteurs, techniciens et créatifs. Soyez visible partout.
              </p>
              <Button variant="link" className="p-0 text-primary font-bold hover:no-underline flex items-center group-hover:translate-x-1 transition-transform uppercase text-xs tracking-widest" asChild>
                <Link href="/talents">Découvrir <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-primary/20 transition-colors group">
              <Clapperboard className="h-12 w-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-4 italic">Appels à Casting</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Accédez aux meilleures opportunités de tournage au Sénégal et à l'international. Postulez en un clic.
              </p>
              <Button variant="link" className="p-0 text-primary font-bold hover:no-underline flex items-center group-hover:translate-x-1 transition-transform uppercase text-xs tracking-widest" asChild>
                <Link href="/castings">Postuler <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-primary/20 transition-colors group">
              <GraduationCap className="h-12 w-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-4 italic">Académie & Masterclass</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Perfectionnez votre art avec les plus grands noms du cinéma sénégalais. Formations certifiantes.
              </p>
              <Button variant="link" className="p-0 text-primary font-bold hover:no-underline flex items-center group-hover:translate-x-1 transition-transform uppercase text-xs tracking-widest" asChild>
                <Link href="/academie">Se Former <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quote / Vision Section */}
      <section className="py-24 bg-gradient-to-b from-black to-slate-950">
        <div className="container px-4 text-center max-w-4xl">
          <Film className="h-12 w-12 text-primary/30 mx-auto mb-8" />
          <blockquote className="text-3xl md:text-4xl font-light italic text-white leading-snug">
            "Kilife Studio n'est pas seulement une image, c'est l'essence d'une vision racontée à travers le cinéma."
          </blockquote>
          <p className="mt-8 text-primary font-bold tracking-widest uppercase">- Kilife Studio</p>
        </div>
      </section>
    </div>
  )
}
