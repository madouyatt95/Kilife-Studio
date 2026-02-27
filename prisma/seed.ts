// @ts-nocheck
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

    console.log('✨ Injecting comprehensive realistic demo data for Kilife Studio...')
    const passwordHash = await bcrypt.hash('Test1234!', 10)

    // --- 1. ADMIN ACCOUNT ---
    const userAdmin = await prisma.user.create({
        data: {
            email: 'admin@kilife.com',
            passwordHash,
            roles: ['ADMIN'],
            name: 'Kilife Admin'
        }
    })

    // --- 2. PRODUCER ACCOUNTS ---
    const pro1: any = await prisma.user.create({
        data: {
            email: 'pro@kilife.com',
            passwordHash,
            roles: ['PRO'],
            name: 'Ousmane Fall',
            proProfile: {
                create: {
                    companyName: 'Wakar Production',
                    siteWeb: 'https://wakar-prod.sn',
                    isVerified: true
                }
            }
        },
        include: { proProfile: true }
    })

    const pro2: any = await prisma.user.create({
        data: {
            email: 'cinema@marodi.com',
            passwordHash,
            roles: ['PRO'],
            name: 'Awa Ndiaye',
            proProfile: {
                create: {
                    companyName: 'Marodi TV',
                    siteWeb: 'https://marodi.tv',
                    isVerified: true
                }
            }
        },
        include: { proProfile: true }
    })

    // --- 3. AGENT ACCOUNTS ---
    const agent1: any = await prisma.user.create({
        data: {
            email: 'agent@kilife.com',
            passwordHash,
            roles: ['AGENT'],
            name: 'Cheikh Diop',
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

    const agent2: any = await prisma.user.create({
        data: {
            email: 'contact@sunucasting.sn',
            passwordHash,
            roles: ['AGENT'],
            name: 'Fatou Sow',
            agentProfile: {
                create: {
                    agencyName: 'Sunu Casting Agency',
                    bio: 'Spécialisés dans le casting sauvage et la représentation de visages authentiques pour le cinéma indépendant.',
                    siteWeb: 'https://sunucasting.sn',
                }
            }
        },
        include: { agentProfile: true }
    })

    // --- 4. ACTORS (WITH AND WITHOUT AGENT) ---
    // A function to generate random Unsplash portrait IDs for variety
    const malePortraits = [
        '1506794778202-cad84cf45f1d', // Black man with dreads
        '1531427186611-ecfd6d936c79', // Black man
        '1507003211169-0a1dd7228f2d', // Black man smiling
        '1492562080023-ab3db95bfbce', // Black man side profile
        '1504257432389-523431eaaa6c', // Black man
        '1519085360753-af0119f7cbe7'  // Black man
    ]
    const femalePortraits = [
        '1531123897727-8f129e1bf98c', // Black woman
        '1534528741775-53994a69daeb', // Black woman smiling
        '1494790108377-be9c29b29330', // Black woman portrait
        '1517841905240-472988babdf9', // Black woman
        '1489424731084-a5d8b219a5bb', // Black woman close up
        '1438761681033-6461ffad8d80'  // Black woman
    ]

    const actorsData = [
        { email: 'acteur1@kilife.com', name: 'Mamadou Ba', gender: 'M', age: 26, ville: 'Dakar', agentId: agent1.agentProfile!.id, competences: ['Arts Martiaux', 'Wolof', 'Français'], photo: `https://images.unsplash.com/photo-${malePortraits[0]}?w=800&q=80` },
        { email: 'actrice1@kilife.com', name: 'Ndeye Fatou Faye', gender: 'F', age: 31, ville: 'Saint-Louis', agentId: agent1.agentProfile!.id, competences: ['Danse Contemporaine', 'Chant', 'Wolof', 'Pulaar', 'Français'], photo: `https://images.unsplash.com/photo-${femalePortraits[0]}?w=800&q=80` },
        { email: 'omar.sy.local@gmail.com', name: 'Omar Sy', gender: 'M', age: 44, ville: 'Dakar', agentId: null, competences: ['Français', 'Anglais', 'Comédie', 'Stand-up'], photo: `https://images.unsplash.com/photo-${malePortraits[1]}?w=800&q=80` },
        { email: 'aissatou.drame@yahoo.fr', name: 'Aïssatou Dramé', gender: 'F', age: 22, ville: 'Thiès', agentId: agent2.agentProfile!.id, competences: ['Sérère', 'Wolof', 'Chant', 'Mannequinat'], photo: `https://images.unsplash.com/photo-${femalePortraits[1]}?w=800&q=80` },
        { email: 'ibrahima.ndour@hotmail.com', name: 'Ibrahima Ndour', gender: 'M', age: 35, ville: 'Ziguinchor', agentId: agent2.agentProfile!.id, competences: ['Cascades', 'Pulaar', 'Conduite Moto', 'Français'], photo: `https://images.unsplash.com/photo-${malePortraits[2]}?w=800&q=80` },
        { email: 'khadija.sow@gmail.com', name: 'Khadija Sow', gender: 'F', age: 28, ville: 'Dakar', agentId: null, competences: ['Wolof', 'Anglais courant', 'Equitation', 'Théâtre classique'], photo: `https://images.unsplash.com/photo-${femalePortraits[2]}?w=800&q=80` },
        { email: 'mouhamed.fall@gmail.com', name: 'Mouhamed Fall', gender: 'M', age: 19, ville: 'Rufisque', agentId: agent1.agentProfile!.id, competences: ['Breakdance', 'Wolof', 'Street Workout'], photo: `https://images.unsplash.com/photo-${malePortraits[3]}?w=800&q=80` },
        { email: 'fatimata.diallo@live.fr', name: 'Fatimata Diallo', gender: 'F', age: 45, ville: 'Dakar', agentId: null, competences: ['Pulaar', 'Wolof', 'Français', 'Cuisine classique'], photo: `https://images.unsplash.com/photo-${femalePortraits[3]}?w=800&q=80` },
    ]

    const actorUsers = []
    for (const data of actorsData) {
        const createData: any = {
            bio: `Comédien(ne) passionné(e) basé(e) à ${data.ville}. Ouvert(e) aux courts et longs métrages.`,
            age: data.age,
            ville: data.ville,
            competences: data.competences,
            langues: data.competences.filter(c => ['Wolof', 'Français', 'Anglais', 'Pulaar', 'Sérère'].includes(c)),
            photo: data.photo,
            galerie: [data.photo, `https://images.unsplash.com/photo-${data.gender === 'M' ? malePortraits[4] : femalePortraits[4]}?w=800&q=80`],
            completenessScore: Math.floor(Math.random() * 40) + 60, // 60-100%
            status: 'APPROVED',
            isVerified: Math.random() > 0.3
        }

        if (data.agentId) {
            createData.agent = { connect: { id: data.agentId } }
        }

        const actor = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                passwordHash,
                roles: ['ACTOR'],
                actorProfile: {
                    create: createData
                }
            }
        })
        actorUsers.push(actor)
    }

    // --- 5. CREW ---
    const crewUsers = []
    const crewData = [
        { email: 'crew@kilife.com', name: 'Cheikh Bamba', professions: ['Chef Opérateur', 'DOP'], ville: 'Dakar', photo: `https://images.unsplash.com/photo-${malePortraits[5]}?w=800&q=80` },
        { email: 'son@kilife.com', name: 'Aminata Gaye', professions: ['Ingénieur du Son', 'Perchiste'], ville: 'Thiès', photo: `https://images.unsplash.com/photo-${femalePortraits[5]}?w=800&q=80` },
        { email: 'makeup@kilife.com', name: 'Binta Diop', professions: ['Maquilleuse SFX', 'Coiffeuse'], ville: 'Dakar', photo: `https://images.unsplash.com/photo-${femalePortraits[4]}?w=800&q=80` },
    ]

    for (const data of crewData) {
        const crew = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                passwordHash,
                roles: ['CREW'],
                crewProfile: {
                    create: {
                        professions: data.professions,
                        bio: `Technicien(ne) expérimenté(e) basé(e) à ${data.ville}.`,
                        experiences: '5 ans d\'expérience sur des plateaux locaux et internationaux.',
                        portfolioUrl: 'https://vimeo.com',
                        photo: data.photo,
                        isVerified: true
                    }
                }
            }
        })
        crewUsers.push(crew)
    }

    // --- 6. CASTINGS & APPLICATIONS ---
    const casting1 = await prisma.casting.create({
        data: {
            proId: pro1.proProfile!.id,
            titre: 'Long Métrage : L\'Héritage',
            projet: 'Film',
            lieu: 'Dakar & Alentours',
            remuneration: 'Rémunéré (Tarif Syndical)',
            dates: 'Mai - Juin 2026',
            roles: { "description": "Nous cherchons l'acteur principal (25-30 ans) pour un drame social tourné à Dakar. Le personnage est un jeune diplômé ambitieux confronté au chômage." },
            deadline: new Date('2026-04-01'),
            status: 'PUBLISHED',
            criteres: JSON.stringify({ ageMin: 23, ageMax: 32, gender: "Masculin", ville: "Dakar", competences: ["Wolof", "Permis B"] })
        }
    })

    const casting2 = await prisma.casting.create({
        data: {
            proId: pro2.proProfile!.id,
            titre: 'Série TV "Quartier Chic"',
            projet: 'Série TV',
            lieu: 'Dakar',
            remuneration: 'Rémunéré',
            dates: 'Mars 2026',
            roles: { "description": "Recherche actrice pour jeune cadre dynamique (env 30 ans) pour une nouvelle série Marodi TV." },
            deadline: new Date('2026-02-28'),
            status: 'PUBLISHED',
            criteres: JSON.stringify({ ageMin: 25, ageMax: 35, gender: "Féminin", ville: "Dakar", competences: ["Français courant"] })
        }
    })

    const casting3 = await prisma.casting.create({
        data: {
            proId: pro1.proProfile!.id,
            titre: 'Publicité Télécom',
            projet: 'Publicité',
            lieu: 'Saly Portudal',
            remuneration: 'Très bien rémunéré (Cession de droits sur 2 ans)',
            dates: '15 Avril 2026',
            roles: { "description": "Recherchons jeunes danseurs acrobatiques (18-25) pour spot publicitaire dynamique." },
            deadline: new Date('2026-03-30'),
            status: 'PUBLISHED',
            criteres: JSON.stringify({ ageMin: 18, ageMax: 25, competences: ["Danse Contemporaine", "Breakdance", "Cascades"] })
        }
    })

    // Fetch actor profiles for relations
    const aProfiles = await prisma.actorProfile.findMany()

    // Add applications
    // Casting 1 applications (Young Male Lead)
    const youngMales = aProfiles.filter(p => p.age && p.age >= 20 && p.age <= 30)
    for (const actor of youngMales) {
        await prisma.castingApplication.create({
            data: {
                castingId: casting1.id,
                actorId: actor.userId,
                status: actor.id === aProfiles[0].id ? 'SHORTLISTED' : 'PENDING',
                selftapeUrl: actor.id === aProfiles[0].id ? 'https://example.com/video.mp4' : null
            }
        })
    }

    // Casting 2 applications (Female Lead)
    const females = aProfiles.filter(p => !p.competences.includes('Arts Martiaux') && p.age && p.age > 20) // simplistic gender filter for seed
    for (const actor of females.slice(0, 3)) {
        await prisma.castingApplication.create({
            data: {
                castingId: casting2.id,
                actorId: actor.userId,
                status: 'ACCEPTED',
            }
        })
    }

    // --- 7. IMDB VITRINE : FILMS ---
    const filmDataList = [
        {
            titre: 'Saloum',
            slug: 'saloum',
            annee: 2021,
            realisateur: 'Jean Luc Herbulot',
            synopsis: 'Fuyant un coup d\'état en Guinée-Bissau, les Hyènes de Bangui, un trio de mercenaires d\'élite, se réfugient au Sine-Saloum au Sénégal. Ils emmènent avec eux un baron de la drogue mexicain et son or.',
            affiche: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800&q=80',
            isPublished: true,
            trailerUrl: 'https://youtube.com/watch?v=xxx',
            cast: aProfiles.slice(0, 3)
        },
        {
            titre: 'Atlantique',
            slug: 'atlantique',
            annee: 2019,
            realisateur: 'Mati Diop',
            synopsis: 'Dans une banlieue populaire de Dakar, des ouvriers sans salaire décident de fuir par l\'océan pour un avenir meilleur. Parmi eux se trouve Souleiman, l\'amant d\'Ada, promise à un autre homme.',
            affiche: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&q=80',
            isPublished: true,
            cast: [aProfiles[1], aProfiles[5]]
        },
        {
            titre: 'Tirailleurs',
            slug: 'tirailleurs',
            annee: 2022,
            realisateur: 'Mathieu Vadepied',
            synopsis: '1917. Bakary Diallo s\'enrôle dans l\'armée française pour rejoindre Thierno, son fils de 17 ans, qui a été recruté de force. Envoyés sur le front, père et fils vont devoir affronter la guerre ensemble.',
            affiche: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=800&q=80',
            isPublished: true,
            cast: [aProfiles[2], aProfiles[4]] // Omar Sy is here
        },
        {
            titre: 'Banel & Adama',
            slug: 'banel-et-adama',
            annee: 2023,
            realisateur: 'Ramata-Toulaye Sy',
            synopsis: 'Banel et Adama s\'aiment passionnément. Mais leur amour absolu va se heurter aux conventions de leur village en pleine sécheresse dans le Nord du Sénégal.',
            affiche: 'https://images.unsplash.com/photo-1506501139174-099022df5260?w=800&q=80',
            isPublished: true,
            cast: [aProfiles[3], aProfiles[6]]
        },
        {
            titre: 'Karma (Série)',
            slug: 'karma-serie',
            annee: 2020,
            realisateur: 'Marodi TV',
            synopsis: 'L\'histoire complexe et entrelacée de plusieurs familles dakaroises, entre trahisons, amour, et conséquences de leurs actes passés.',
            affiche: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
            isPublished: true,
            cast: aProfiles.slice(1, 5)
        }
    ]

    for (const fd of filmDataList) {
        // filter out undefined actors (since we sliced a limited array and they might not exist)
        const validCast = fd.cast.filter(c => c && c.id);

        await prisma.film.create({
            data: {
                titre: fd.titre,
                slug: fd.slug,
                annee: fd.annee,
                realisateur: fd.realisateur,
                synopsis: fd.synopsis,
                affiche: fd.affiche,
                isPublished: fd.isPublished,
                trailerUrl: fd.trailerUrl,
                ...(validCast.length > 0 && {
                    acteurs: {
                        connect: validCast.map(c => ({ id: c.id }))
                    }
                })
            }
        })
    }

    // --- 8. ENDORSEMENTS ---
    // Make sure we have enough profiles to endorse
    if (aProfiles.length >= 2) {
        await prisma.endorsement.create({
            data: {
                proId: pro1.proProfile!.id,
                actorProfileId: aProfiles[0].id,
                rating: 5,
                comment: "Acteur extrêmement professionnel. A tout donné sur le set de L'Héritage. Je recommande vivement !"
            }
        })

        await prisma.endorsement.create({
            data: {
                proId: pro2.proProfile!.id,
                actorProfileId: aProfiles[1].id,
                rating: 4,
                comment: "Très bonne actrice d'improvisation, parfaite pour des scènes intenses."
            }
        })
    }

    console.log('✅ Base de données initialisée avec succès avec les données de démonstration !')
    console.log('----------------------------------------------------')
    console.log('Comptes de Test Créés :')
    console.log('1. Admin       : admin@kilife.com     / Test1234!')
    console.log('2. Prod/Pro 1  : pro@kilife.com       / Test1234!')
    console.log('3. Prod/Pro 2  : cinema@marodi.com    / Test1234!')
    console.log('4. Agence 1    : agent@kilife.com     / Test1234!')
    console.log('5. Agence 2    : contact@sunucasting.sn / Test1234!')
    console.log('6. Acteur(M)   : acteur1@kilife.com   / Test1234!')
    console.log('7. Actrice(F)  : actrice1@kilife.com  / Test1234!')
    console.log('8. Technicien  : crew@kilife.com      / Test1234!')
    console.log('   (et 6 autres faux comptes acteurs générés)')
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
