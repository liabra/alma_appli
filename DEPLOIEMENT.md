# 🚀 Guide de déploiement Railway — Alma

## Prérequis
- Compte Railway : railway.app
- Compte Google AI Studio : aistudio.google.com (pour la clé Gemini)

---

## Étape 1 — Créer le projet Railway

1. Va sur [railway.app](https://railway.app) → **New Project**
2. Choisis **Deploy from GitHub repo**
3. Sélectionne `liabra/alma_appli`

---

## Étape 2 — Service Backend

1. Dans ton projet Railway → **Add Service** → **GitHub Repo**
2. Sélectionne `alma_appli`, **Root Directory** : `backend`
3. Railway détecte automatiquement Python

**Variables d'environnement à ajouter :**
```
SECRET_KEY=        (génère avec : python3 -c "import secrets; print(secrets.token_hex(32))")
GEMINI_API_KEY=    (depuis aistudio.google.com → Get API key)
CORS_ORIGINS=      (laisse vide pour l'instant, à remplir après avoir le domaine frontend)
ENVIRONMENT=production
```

4. **Add Plugin** → **PostgreSQL** → Railway génère automatiquement `DATABASE_URL`

---

## Étape 3 — Service Frontend

1. **Add Service** → **GitHub Repo** → `alma_appli`, **Root Directory** : `frontend`

**Variables d'environnement :**
```
VITE_API_URL=   (l'URL de ton backend Railway, ex: https://alma-backend-prod.up.railway.app)
```

---

## Étape 4 — Relier les deux services

1. Copie l'URL du frontend Railway
2. Retourne dans le backend → Variables → `CORS_ORIGINS` → colle l'URL frontend
2. Redéploie le backend

---

## Étape 5 — Domaine personnalisé (optionnel)

Dans chaque service Railway → **Settings** → **Domains** → **Custom Domain**

---

## Étape 6 — Clé Gemini Flash (gratuit)

1. Va sur [aistudio.google.com](https://aistudio.google.com)
2. **Get API key** → **Create API key**
3. Colle dans Railway backend → `GEMINI_API_KEY`

Le plan gratuit Gemini Flash offre :
- 15 requêtes/minute
- 1 million de tokens/jour
- Largement suffisant pour Alma

---

## Étape 7 — CI/CD automatique

1. GitHub → ton repo → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** → `RAILWAY_TOKEN`
3. Récupère le token : Railway → **Account Settings** → **Tokens**

À chaque push sur `main`, GitHub Actions buildе et déploie automatiquement.

---

## URLs finales

| Service | URL exemple |
|---------|-------------|
| Frontend | `https://alma-frontend.up.railway.app` |
| Backend API | `https://alma-backend.up.railway.app` |
| API Docs | `https://alma-backend.up.railway.app/docs` |

