# Ciné Sénégal PWA — MVP Déploiement

Cette application est une Progressive Web App (PWA) construite avec Next.js 14, Prisma (PostgreSQL), NextAuth v5, et TailwindCSS (Shadcn/ui).

## Variables d'environnement requises (.env)

```env
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="générer-au-hasard-32-chars"

# Vidéo (Optionnel, MOCK par défaut)
NEXT_PUBLIC_VIDEO_PROVIDER="MOCK" # ou CLOUDFLARE, MUX, VIMEO

# Paiements (Optionnel)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Push Notifications (Optionnel, générer avec npx web-push generate-vapid-keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY="B..."
VAPID_PRIVATE_KEY="..."
```

## Instructions de lancement

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Base de données**
   ```bash
   npx prisma generate
   npx prisma db push
   # ou npx prisma migrate dev --name init
   ```

3. **Lancement local**
   ```bash
   npm run dev
   ```

## Note sur la PWA
Le `next-pwa` génère les Service Workers de Workbox et gère le cache hors-ligne. Push API activé via `src/app/api/push/subscribe`. L'installation sur mobile est gérée nativement par le navigateur grâce au `manifest.json`.
