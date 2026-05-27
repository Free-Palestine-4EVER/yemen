# منفذ · Manfath

**Your gateway from Yemen to Europe.** A bilingual (English + Arabic / RTL) platform
that turns the maze of study- and work-abroad applications into one guided process for
Yemeni graduates — register, build one profile, choose a European country, pay a flat
fee, and track responses. The operator verifies payments and sends embassy/employer
outreach from an admin console.

| | |
|---|---|
| **Student track** | $30 / application |
| **Job-seeker track** | $80 / application |
| **Payments** | Manual bank transfer, admin-verified |
| **Outreach** | Auto-drafted email, admin-reviewed before sending |

## Features

- 🌍 Full **English + Arabic** with right-to-left mirroring and Arabic typography
- 🎨 Institutional, embassy-grade design with Framer Motion throughout
- 🧭 8-step **application wizard** with passport/photo uploads and autosave
- 💳 **Payment flow** — bank details, receipt upload, manual verification
- 📊 Applicant **dashboard** — status timeline, documents, embassy/job responses
- 🛡️ **Admin console** — verify payments, generate & send outreach, post updates
- 🔐 Firebase Auth + Firestore + Storage with locked-down security rules

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

The site runs without configuration (marketing site fully usable). To enable
accounts, data, uploads, payments, and admin — **see [`SETUP.md`](./SETUP.md)** for
the full Firebase + Vercel walkthrough.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion ·
Firebase · Resend.

## Project layout

```
src/
  app/            routes: / · /register · /login · /apply · /dashboard · /admin · /api/send-email
  components/     site, landing, auth, apply, dashboard, admin, ui
  lib/            firebase/ · i18n/ · data, config, email-template, utils
firestore.rules   storage.rules
```

See [`SETUP.md`](./SETUP.md) to go live.
