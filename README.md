# 🌿 Alma

> Ton espace maternité — allaitement, bébé, post-partum.

PWA complète pour les nouvelles mamans. Gratuite, sans publicité, sans données personnelles.

---

## ✨ Ce que fait Alma

### Dashboard personnalisable
- Widgets drag & drop, masquables à volonté
- Configuration persistante par appareil

### 🤱 Alimentation
- Timer allaitement sein gauche/droit
- Suivi biberon (ml) et mode mixte
- Détection de problèmes (douleur, engorgement, grève du sein...)
- Alertes contextuelles avec conseils physiologiques
- Liens vers LLL France et consultantes IBCLC

### 🌙 Sommeil
- 1 tap pour noter dodo/réveil
- Chrono automatique
- Fenêtre de sommeil adaptée à l'âge exact de bébé
- Stats quotidiennes

### 🧷 Couches
- Suivi pipi/selle/mixte avec compteurs
- Historique horodaté

### 💬 Réseau de soutien
- Carnet d'alliées avec créneaux de disponibilité
- Tags de compétence (allaitement, DME, post-partum...)
- Appel ou WhatsApp en 1 tap
- Suggestions contextuelles selon les signaux actifs

### 🧠 Check-in quotidien
- Suivi du moral en 1 tap (5 niveaux)
- Texte libre optionnel
- Analyse douce par IA (Gemini Flash)
- Message d'encouragement personnalisé chaque matin

### 👶 Section Bébé
- Courbe de croissance (poids, taille, périmètre crânien)
- Calendrier vaccinal français 2024
- Développement par tranches d'âge (motricité libre)

### 🌸 Section Moi
- Récupération post-partum (périnée, cicatrice, reprise sport)
- Courbe d'humeur sur 7 jours
- Questionnaire d'humeur (inspiré Édimbourg)
- Nutrition post-partum et allaitement
- Ressources de soutien (Maman Blues, 3114)

### 📖 Bibliothèque
- 20+ fiches physiologiques
- Recherche par mot-clé
- 7 catégories : allaitement, sommeil, pleurs, portage, DME, post-partum, corps bébé
- Liens vers LLL France sur chaque fiche pertinente

### 📅 Carnet
- Rendez-vous médicaux avec notes et dates
- Notes libres horodatées pour le pédiatre
- Démarches admin post-naissance (CAF, déclaration, congés)

---

## 🔒 Vie privée

- **Compte anonyme** — aucun email, aucun nom réel
- **UUID généré localement** — tu n'es qu'un identifiant aléatoire
- **Offline-first** — tout fonctionne sans réseau
- **Données stockées sur ton appareil** — sync cloud optionnel
- **Aucune publicité, jamais**
- **Aucune vente de données, jamais**

---

## ⚠️ Disclaimer

Alma est un outil d'aide, **pas un dispositif médical**.
Pour toute inquiétude concernant ta santé ou celle de ton bébé, consulte toujours un professionnel de santé.
Les informations présentes dans l'app sont à titre indicatif et ne se substituent pas à un avis médical.

---

## 🏗 Stack

| Couche | Tech |
|--------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| State | Zustand (persist, offline-first) |
| Drag & drop | @dnd-kit |
| PWA | vite-plugin-pwa + Workbox |
| Routing | React Router v6 |
| Backend | FastAPI + SQLModel |
| Base de données | PostgreSQL (Railway) |
| IA | Google Gemini Flash |
| Déploiement | Railway |

---

## 🚀 Démarrage local

```bash
# Frontend
cd frontend
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
# → http://localhost:5173

# Backend (optionnel — l'app tourne offline sans lui)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Ajoute ta clé GEMINI_API_KEY
uvicorn app.main:app --reload
# → http://localhost:8000
```

---

## 🌍 Déploiement Railway

### 1. Créer deux services sur Railway
- Service `alma-frontend` → dossier `frontend`
- Service `alma-backend` → dossier `backend`

### 2. Variables d'environnement backend
```
DATABASE_URL=postgresql://...  (auto-généré par Railway PostgreSQL)
SECRET_KEY=une-clé-secrète-longue
GEMINI_API_KEY=ta-clé-gemini
CORS_ORIGINS=https://ton-frontend.up.railway.app
ENVIRONMENT=production
```

### 3. Variables d'environnement frontend
```
VITE_API_URL=https://ton-backend.up.railway.app
```

### 4. Ajouter le token Railway dans GitHub Secrets
`Settings → Secrets → RAILWAY_TOKEN`

---

## 📁 Structure

```
alma_appli/
├── frontend/src/
│   ├── components/
│   │   ├── widgets/        # Alimentation, Couches, Sommeil, Sante, Soutien
│   │   ├── checkin/        # CheckIn quotidien
│   │   └── ui/             # NavBar, Header
│   ├── sections/           # Dashboard, Bebe, Moi, Info, Carnet, Onboarding
│   ├── store/              # useUserStore, useBebeStore, useSessionStore, useShareStore
│   ├── hooks/              # useTimer, useSync
│   ├── lib/                # api.js, palette.js
│   └── data/               # allaitement.js, postpartum.js
└── backend/app/
    ├── routers/            # auth, bebe, checkin, encouragement, share
    ├── models/             # user, events
    ├── services/           # ia_service (Gemini Flash)
    └── core/               # config, database
```

---

## 👩‍💻 Développée par

[@liabra](https://github.com/liabra) — maman dev 🌿
