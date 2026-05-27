# Manfath — Setup & Deployment Guide

Manfath (منفذ, "gateway") is a bilingual (English + Arabic/RTL) platform that helps
Yemeni graduates apply to study or work in Europe. Applicants register, complete one
thorough profile (passport, education, experience, languages), choose a European
destination, pay a flat fee by manual bank transfer, and track responses. The
operator (your friend) verifies payments and sends outreach from an admin console.

- **Student track:** $30 · **Job-seeker track:** $80
- Payments: manual bank transfer, **verified by the admin** before outreach
- Embassy/employer emails: **drafted automatically, reviewed & sent by the admin**

---

## 1. Prerequisites

- Node.js 20+ and npm
- A Google account (for Firebase)
- A GitHub account + a Vercel account (for hosting)

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev      # http://localhost:3000
```

Until Firebase keys are added, the site runs in a friendly "not configured" mode —
the marketing site is fully usable; sign-in/saving are disabled with a notice.

---

## 2. Firebase setup (required for accounts, data, uploads)

1. Go to <https://console.firebase.google.com> → **Add project**.
2. In the project, **Build → Authentication → Get started → Email/Password → Enable**.
3. **Build → Firestore Database → Create database** (Production mode, region close to Yemen/Europe e.g. `eur3`).
4. **Build → Storage → Get started** (Production mode).
5. **Project settings (⚙) → General → Your apps → Web app (`</>`)**. Register an app and copy the config values.
6. Paste them into `.env.local` (copy from `.env.example`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
```

These `NEXT_PUBLIC_` values are **safe to expose** — they identify the project, not
secrets. Real protection comes from the security rules below.

### Deploy the security rules

The repo includes `firestore.rules` and `storage.rules`. Deploy them with the Firebase CLI:

```bash
npm i -g firebase-tools
firebase login
firebase use your-project
firebase deploy --only firestore:rules,storage:rules
```

(Or paste the file contents into Console → Firestore → Rules and Storage → Rules.)

These rules ensure each applicant can only read/write **their own** application and
documents, and only **admins** can read everyone's.

---

## 3. Make your friend an admin

Two steps:

1. **Edit `src/lib/config.ts`** and put his account email in `ADMIN_EMAILS`:
   ```ts
   export const ADMIN_EMAILS = ["mohammed@example.com"];
   ```
2. Have him **register** on the site with that exact email. His user profile is then
   created with `role: "admin"`, which both the UI and the Firestore rules respect.
   He'll land on `/admin` when he logs in.

> The admin email check is the source of truth for the UI. The Firestore rules trust
> the `role` field on the user document, which can only become `admin` for emails in
> this list (a user cannot self-promote).

---

## 4. Business details (bank account, contact)

Edit `src/lib/config.ts`:

```ts
export const PAYMENT = {
  accountNumber: "YEMEN828998397139713", // the account applicants transfer to
  beneficiary: "Manfath — Mohammed",
  bankName: "Yemen Bank",
  currency: "USD",
};

export const CONTACT = {
  whatsapp: "+967XXXXXXXXX",
  email: "hello@manfath.app",
};
```

Destinations and fees live in `src/lib/data.ts` (`DESTINATIONS`, `TRACK_FEE`).

---

## 5. Email outreach (optional but nice)

The admin console always lets your friend **Copy** the generated draft or **Open in
Gmail** to send it himself from his own inbox — this works with zero extra setup and
is how most embassies prefer to receive mail.

To also enable one-click sending from the app (via [Resend](https://resend.com)):

1. Create a Resend account, verify a sending domain, create an API key.
2. Add to `.env.local` (and to Vercel env vars):
   ```env
   RESEND_API_KEY=re_...
   EMAIL_FROM="Manfath <applications@yourdomain.com>"
   ```
3. To let the server confirm the sender is really an admin, add a Firebase **service
   account** (Console → Project settings → Service accounts → Generate new private key)
   as a single-line JSON env var:
   ```env
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account", ... }
   ```
   Without this, one-click send is disabled (the Copy/Gmail fallback still works).

---

## 6. Deploy to Vercel

1. Push this repo to GitHub (see below).
2. On <https://vercel.com> → **Add New → Project → Import** your GitHub repo.
3. Framework preset: **Next.js** (auto-detected). Build command/output: defaults.
4. **Environment Variables:** add every key from your `.env.local`
   (all the `NEXT_PUBLIC_FIREBASE_*`, and optionally `RESEND_API_KEY`,
   `EMAIL_FROM`, `FIREBASE_SERVICE_ACCOUNT`).
5. **Deploy.**
6. In Firebase → Authentication → Settings → **Authorized domains**, add your Vercel
   domain (e.g. `manfath.vercel.app`) so sign-in works in production.

### Push to GitHub

```bash
git add -A
git commit -m "Manfath platform"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

---

## 7. How the flow works (for the operator)

1. Applicant registers → completes the multi-step form → uploads passport/photo.
2. On submit they see the **payment popup** with the bank account and transfer
   reference, upload their receipt, and confirm. Status → *Verifying payment*.
3. Your friend opens **/admin**, finds the applicant, opens the receipt, and clicks
   **Mark verified** (or Reject). Status → *Payment verified*.
4. He clicks **Generate email draft** — a professional English letter to the embassy
   (students) or employers (jobs) is pre-filled with the applicant's data and their
   passport/photo attached. He edits, then **Copy / Gmail / Send**. Status → *Sent*.
5. When a reply comes, he posts an **update** (embassy reply / job lead) from the
   admin panel. The applicant sees it instantly on their **dashboard**.

---

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion ·
Firebase (Auth/Firestore/Storage) · Resend · next/font (Inter, Fraunces, IBM Plex
Sans Arabic).
