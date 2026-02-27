---
description: Étapes pour déployer l'application sur Git et Vercel
---

# Déploiement Kilife Studio

Suivez ces étapes pour mettre votre projet en ligne :

1. **Initialisation Git**
```powershell
git init
git add .
git commit -m "Kilife Studio ready"
```

2. **GitHub**
   - Créez un repo sur GitHub.
   - Liez-le : `git remote add origin [URL]`
   - Poussez : `git push -u origin main`

3. **Vercel**
   - Importez le repo sur Vercel.
   - Configurez les variables d'environnement (`DATABASE_URL`, `NEXTAUTH_SECRET`).
   - Déployez.
