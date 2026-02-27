const { execSync } = require('child_process')
const fs = require('fs')

// Read the Vercel token from the auth file
const authPath = require('path').join(process.env.APPDATA || '', 'com.vercel.cli', 'Data', 'auth.json')
let token
try {
    const auth = JSON.parse(fs.readFileSync(authPath, 'utf-8'))
    token = auth.token
    console.log('Auth token found')
} catch (e) {
    console.error('Could not find Vercel auth token at', authPath)
    process.exit(1)
}

// Get project ID from .vercel/project.json
const projPath = require('path').join(__dirname, '.vercel', 'project.json')
const proj = JSON.parse(fs.readFileSync(projPath, 'utf-8'))
const projectId = proj.projectId
const orgId = proj.orgId

console.log('Project ID:', projectId)
console.log('Org ID:', orgId)

const envVars = [
    {
        key: 'DATABASE_URL',
        value: 'postgresql://postgres.jjnpnazgsrgieyawcwtr:9rthLp90MWsDHIXX@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
        target: ['production', 'preview', 'development'],
        type: 'encrypted'
    },
    {
        key: 'DIRECT_URL',
        value: 'postgresql://postgres.jjnpnazgsrgieyawcwtr:9rthLp90MWsDHIXX@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
        target: ['production', 'preview', 'development'],
        type: 'encrypted'
    },
    {
        key: 'NEXTAUTH_SECRET',
        value: 'super-secret-key-for-dev-only',
        target: ['production', 'preview', 'development'],
        type: 'encrypted'
    },
    {
        key: 'NEXTAUTH_URL',
        value: 'https://kilife-studio.vercel.app',
        target: ['production'],
        type: 'plain'
    }
]

async function addEnvVars() {
    for (const env of envVars) {
        const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env?teamId=${orgId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(env)
        })
        const data = await res.json()
        if (res.ok) {
            console.log(`✅ ${env.key} added successfully`)
        } else {
            console.error(`❌ ${env.key} failed:`, data.error?.message || JSON.stringify(data))
        }
    }
}

addEnvVars()
