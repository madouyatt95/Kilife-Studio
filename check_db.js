const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const actors = await prisma.user.findMany({
        where: { roles: { has: 'ACTOR' } },
        include: { actorProfile: true }
    });
    console.log(`Found ${actors.length} actors`);

    if (actors.length > 0) {
        console.log("Sample Avatar:", actors[0].actorProfile?.photo);
        console.log("Sample Bio:", actors[0].actorProfile?.bio);
        console.log("Sample Name:", actors[0].name);
        console.log("Sample Email:", actors[0].email);
    }
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
