const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        const user = await prisma.user.create({
            data: {
                email: 'test-local-' + Date.now() + '@test.com',
                passwordHash: 'testHash123',
                roles: ['ACTOR']
            }
        })
        console.log('User created:', user.id, user.email)

        const profile = await prisma.actorProfile.create({
            data: { userId: user.id }
        })
        console.log('Profile created:', profile.id)

        // Clean up
        await prisma.actorProfile.delete({ where: { id: profile.id } })
        await prisma.user.delete({ where: { id: user.id } })
        console.log('Cleanup done. DB connection works fine!')
    } catch (e) {
        console.error('ERROR:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
