// One-off helper: create a test/admin account against the live Firebase project.
// Reads config from .env.local (never hardcode keys in committed files).
// Usage: node scripts/create-user.mjs <email> <password>
import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// minimal .env.local parser
function loadEnv() {
  const out = {};
  try {
    for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local */
  }
  return out;
}

const env = loadEnv();
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("No Firebase config found. Fill in .env.local first.");
  process.exit(1);
}

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error("Usage: node scripts/create-user.mjs <email> <password>");
  process.exit(1);
}

const auth = getAuth(initializeApp(firebaseConfig));
try {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: email.split("@")[0] });
  console.log("SUCCESS: created", cred.user.uid, email);
  process.exit(0);
} catch (e) {
  console.log("ERROR_CODE:", e.code, "-", e.message);
  process.exit(1);
}
