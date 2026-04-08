# 🌿 Alma

> Ton espace maternité — allaitement, bébé, post-partum.

Application PWA complète pour les jeunes mamans. Paiement unique, aucune publicité, données anonymes.

---

## ✨ Fonctionnalités v1

- **Dashboard personnalisable** — widgets drag & drop, masquables à volonté
- **Alimentation** — timer allaitement (sein G/D), biberon, mixte, détection de problèmes
- **Sommeil** — 1 tap pour noter dodo/réveil, fenêtre de sommeil adaptée à l'âge
- **Couches** — suivi rapide pipi/selle/mixte
- **Santé** — suivi de température
- **Réseau de soutien** — alliées avec créneaux de disponibilité, tags de compétence, contact direct
- **Check-in quotidien** — suivi du moral, analyse douce par IA (Gemini Flash)
- **Encouragement IA** — message personnalisé chaque matin basé sur les données réelles
- **Onboarding** — 5 étapes, compte anonyme, aucun email requis
- **Offline-first** — PWA installable, fonctionne sans réseau

---

## 🏗 Stack

| Couche | Tech |
|--------|------|
| Frontend | React + Vite + Tailwind CSS |
| State | Zustand (persist) |
| Drag & drop | @dnd-kit |
| PWA | vite-plugin-pwa + Workbox |
| Routing | React Router v6 |
| Backend | FastAPI + SQLModel |
| Base de données | PostgreSQL (Railway) |
| IA | Google Gemini Flash |
| Paiement | Lemon Squeezy |
| Déploiement | Railway |

---

## 🚀 Démarrage local

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Remplir .env avec tes clés
uvicorn app.main:app --reload
```

---

## 📁 Structure

```
alma_appli/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── widgets/        # WidgetAlimentation, Couches, Sommeil, Sante, Soutien
│       │   ├── dashboard/      # Dashboard + DnD
│       │   ├── checkin/        # Check-in quotidien
│       │   └── ui/             # NavBar, Header
│       ├── sections/           # Accueil, Bébé, Moi, Info, Carnet
│       ├── store/              # Zustand stores (user, bebe, session)
│       ├── hooks/              # useTimer
│       ├── lib/                # api.js, palette.js
│       └── data/               # allaitement.js, postpartum.js
└── backend/
    └── app/
        ├── routers/            # auth, bebe
        ├── models/             # user, events
        ├── services/           # ia_service (Gemini)
        └── core/               # config, database
```

---

## 🗺 Roadmap

- **Phase 1** ✅ — Socle, PWA, widgets core, onboarding, IA check-in
- **Phase 2** — Sections Bébé, Moi, Info, Carnet complètes
- **Phase 3** — Sync cloud, partage co-parent
- **Phase 4** — Bibliothèque de contenu (allaitement, post-partum, DME…)
- **Phase 5** — Paiement Lemon Squeezy + déploiement production
- **Phase 6** — Communauté intégrée (v2)

---

## ⚠️ Disclaimer

Alma est un outil d'aide, pas un dispositif médical.
Pour toute inquiétude concernant ta santé ou celle de ton bébé, consulte toujours un professionnel de santé.

---

## 👩‍💻 Développée par

[@liabra](https://github.com/liabra) — maman dev 🌿
