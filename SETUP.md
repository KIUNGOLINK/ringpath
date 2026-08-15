# RingPath — mise en production

Ce dont j'ai besoin de ta part pour finir (je ne peux pas créer de comptes à ta place) :

## 1. Supabase (base de données + comptes)

1. Va sur [supabase.com](https://supabase.com), crée un compte/projet gratuit (nom au choix, ex. "ringpath").
2. Dans le dashboard du projet → **SQL Editor** → colle le contenu de
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) → **Run**.
   Ça crée toutes les tables (profiles, coaches, boxers, camps, sessions) et la sécurité (RLS).
3. Dans **Settings → API**, copie :
   - **Project URL**
   - **anon public key**
4. (Optionnel mais recommandé pour aller vite en démo) Dans **Authentication → Providers → Email**,
   désactive "Confirm email" pour l'instant — sinon chaque inscription doit valider un email avant de
   pouvoir se connecter. Tu pourras le réactiver avant l'ouverture officielle.
5. Donne-moi ces deux valeurs (URL + anon key) — elles ne sont pas secrètes, c'est normal de me les
   donner et de les mettre dans le code.

## 2. Déploiement (Vercel)

Option la plus simple : donne-moi un **token Vercel** (vercel.com → Account Settings → Tokens →
Create) et je déploie moi-même en autonomie via la CLI. Sinon, je peux te guider pour connecter le
repo GitHub toi-même dans le dashboard Vercel.

## 3. Identité git

Je ne touche jamais à la config git par sécurité — donne-moi juste un nom/email à utiliser pour les
commits de ce projet (ex. "Maxime Koumba" / ton email), et je configure ça en local uniquement pour ce
repo.

---

Une fois ces infos données, tout le reste (déploiement, tests, itérations) je le fais moi-même.
