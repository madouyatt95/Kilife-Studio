import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Cleaning old demo data...')

    // Clean all data in the right order (due to foreign keys)
    await prisma.endorsement.deleteMany()
    await prisma.document.deleteMany()
    await prisma.auditionSlot.deleteMany()
    await prisma.castingApplication.deleteMany()
    await prisma.casting.deleteMany()
    await prisma.film.deleteMany()
    await prisma.actorProfile.deleteMany()
    await prisma.crewProfile.deleteMany()
    await prisma.agentProfile.deleteMany()
    await prisma.proProfile.deleteMany()
    await prisma.user.deleteMany()

    console.log('✨ Injecting realistic demo data for Kilife Studio...')
    const passwordHash = await bcrypt.hash('Test1234!', 10)

    // --- 1. PRODUCER ACCOUNT ---
    const userPro = await prisma.user.create({
        data: {
            email: 'pro@kilife.com',
            passwordHash,
            roles: ['PRO'],
            proProfile: {
                create: {
                    companyName: 'Wakar Production',
                    siteWeb: 'https://wakar-prod.sn',
                    isVerified: true,
                }
            }
        },
        include: { proProfile: true }
    })

    // --- 2. AGENT ACCOUNT ---
    const userAgent = await prisma.user.create({
        data: {
            email: 'agent@kilife.com',
            passwordHash,
            roles: ['AGENT'],
            agentProfile: {
                create: {
                    agencyName: 'Teranga Talents',
                    bio: 'La première agence de talents cinématographiques et mannequins d\'Afrique de l\'Ouest.',
                    siteWeb: 'https://terangatalents.com',
                }
            }
        },
        include: { agentProfile: true }
    })

    // --- 3. ACTORS (WITH AND WITHOUT AGENT) ---
    const userActor1 = await prisma.user.create({
        data: {
            email: 'acteur1@kilife.com',
            passwordHash,
            roles: ['ACTOR'],
            actorProfile: {
                create: {
                    bio: 'Jeune talent dynamique, passionné par les rôles dramatiques. Aisance devant la caméra, parfait pour les séries télévisées.',
                    age: 26,
                    ville: 'Dakar',
                    experiences: '- Rôle principal dans le court-métrage "La Rue"\n- Figuration "Saloum"',
                    competences: ['Arts Martiaux', 'Permis B', 'Wolof', 'Français'],
                    galerie: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80'],
                    demoVideoId: 'https://youtube.com',
                    agent: { connect: { id: userAgent.agentProfile!.id } }
                }
            }
        }
    })

    const userActor2 = await prisma.user.create({
        data: {
            email: 'actrice1@kilife.com',
            passwordHash,
            roles: ['ACTOR'],
            actorProfile: {
                create: {
                    bio: 'Actrice de théâtre reconvertie dans le cinéma d\'auteur. Grande palette émotionnelle.',
                    age: 31,
                    ville: 'Saint-Louis',
                    experiences: '- Théâtre National Daniel Sorano\n- Pub Orange Sénégal',
                    competences: ['Danse Contemporaine', 'Chant', 'Wolof', 'Pulaar', 'Français'],
                    galerie: ['https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?w=800&q=80'],
                    agentId: userAgent.agentProfile!.id
                }
            }
        }
    })

    // --- 4. CREW ---
    const userCrew = await prisma.user.create({
        data: {
            email: 'crew@kilife.com',
            passwordHash,
            roles: ['CREW'],
            crewProfile: {
                create: {
                    professions: ['Chef Opérateur', 'DOP'],
                    bio: 'Directeur de la photographie avec 10 ans d\'expérience sur des plateaux internationaux.',
                    experiences: 'RED V-Raptor, Arri Alexa, Eclairage Studio, Drone',
                    portfolioUrl: 'https://vimeo.com',
                    cvUrl: 'https://example.com/cv.pdf',
                }
            }
        }
    })

    // --- 5. CASTINGS & APPLICATIONS ---
    const casting1 = await prisma.casting.create({
        data: {
            proId: userPro.proProfile!.id,
            titre: 'Long Métrage : L\'Héritage',
            projet: 'Film',
            lieu: 'Dakar & Alentours',
            remuneration: 'Rémunéré (Tarif Syndical)',
            dates: 'Mai - Juin 2026',
            roles: {
                "description": "Nous cherchons l'acteur principal (25-30 ans) pour un drame social tourné à Dakar. Le personnage est un jeune diplômé ambitieux."
            },
            deadline: new Date('2026-04-01'),
            status: 'PUBLISHED',
            criteres: JSON.stringify({
                ageMin: 23,
                ageMax: 32,
                gender: "Masculin",
                skillsRequired: ["Wolof"]
            })
        }
    })

    const casting2 = await prisma.casting.create({
        data: {
            proId: userPro.proProfile!.id,
            titre: 'Série TV "Quartier Chic"',
            projet: 'Série TV',
            lieu: 'Dakar',
            remuneration: 'Rémunéré',
            dates: 'Mars 2026',
            roles: { "description": "Recherche actrice secondaire (env 30 ans) pour jouer une avocate tenace." },
            deadline: new Date('2026-02-28'),
            status: 'PUBLISHED',
        }
    })

    // Add applications
    const actor1Profile = await prisma.actorProfile.findUnique({ where: { userId: userActor1.id } })
    const actor2Profile = await prisma.actorProfile.findUnique({ where: { userId: userActor2.id } })

    await prisma.castingApplication.create({
        data: {
            castingId: casting1.id,
            actorId: userActor1.id,
            status: 'SHORTLISTED',
        }
    })

    await prisma.castingApplication.create({
        data: {
            castingId: casting2.id,
            actorId: userActor2.id,
            status: 'PENDING',
        }
    })

    // --- 6. IMDB VITRINE : FILMS ---
    await prisma.film.create({
        data: {
            titre: 'Saloum',
            slug: 'saloum',
            annee: 2021,
            realisateur: 'Jean Luc Herbulot',
            synopsis: 'Fuyant un coup d\'état en Guinée-Bissau, les Hyènes de Bangui, un trio de mercenaires d\'élite, se réfugient au Sine-Saloum au Sénégal.',
            affiche: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
        }
    })

    await prisma.film.create({
        data: {
            titre: 'Atlantique',
            slug: 'atlantique',
            annee: 2019,
            realisateur: 'Mati Diop',
            synopsis: 'Dans une banlieue populaire de Dakar, des ouvriers sans salaire décident de fuir par l\'océan pour un avenir meilleur.',
            affiche: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&q=80',
        }
    })

    console.log('✅ Base de données initialisée avec succès avec les données de démonstration !')
    console.log('----------------------------------------------------')
    console.log('Comptes de Test Créés :')
    console.log('1. Prod/Admin  : pro@kilife.com     / Test1234!')
    console.log('2. Agence      : agent@kilife.com   / Test1234!')
    console.log('3. Acteur(M)   : acteur1@kilife.com / Test1234!')
    console.log('4. Actrice(F)  : actrice1@kilife.com/ Test1234!')
    console.log('5. Technicien  : crew@kilife.com    / Test1234!')
    console.log('----------------------------------------------------')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
