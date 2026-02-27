const { PrismaClient } = require('@prisma/client')

const regions = [
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
    'us-east-1', 'us-west-1', 'us-west-2',
    'ap-southeast-1', 'ap-northeast-1', 'ap-south-1',
    'sa-east-1', 'ca-central-1'
]

const password = '9rthLp90MWsDHIXX'
const ref = 'jjnpnazgsrgieyawcwtr'

async function tryAll() {
    for (const region of regions) {
        const url = `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres`
        const p = new PrismaClient({ datasources: { db: { url } } })
        try {
            await p.$connect()
            const count = await p.user.count()
            console.log(`✅ FOUND IT! IPv4 Region: ${region}, Port: 6543, Users: ${count}`)
            console.log(`   URL: ${url.replace(password, '***')}`)
            await p.$disconnect()
            return
        } catch (e) {
            const msg = e.message.split('\n')[0]
            if (!msg.includes('Tenant or user not found')) {
                console.log(`❓ ${region} - ${msg}`)
            }
            try { await p.$disconnect() } catch (x) { }
        }
    }
    console.log('\n❌ No working pooler region found')
}

tryAll()
