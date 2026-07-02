// ---------------------------------------------------------------------------
// FIREBASE SETUP
// ---------------------------------------------------------------------------
// This is the ONE place the whole app talks to Firebase. Everything the auth
// screen needs is exported from here.
//
// The config values are read from environment variables (see .env.example).
// In Vite, any variable prefixed with `VITE_` is exposed to the browser via
// `import.meta.env`. NEVER put secret server keys here — the Firebase web
// config is *meant* to be public; access is controlled by Firebase Security
// Rules, not by hiding these keys.
//
// TO MAKE THIS WORK:
//   1. Create a project at https://console.firebase.google.com
//   2. Add a Web App, copy its config values into a `.env.local` file
//      (use `.env.example` as the template).
//   3. In the console → Build → Authentication → Sign-in method, enable
//      "Email/Password", "Google", and "GitHub".
// ---------------------------------------------------------------------------

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Handy flag the UI can check so students still see the screen (with a gentle
// warning) before they've pasted their own Firebase keys.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey)

const app = initializeApp(firebaseConfig)

// `auth` is the object we call sign-in / sign-up methods on.
export const auth = getAuth(app)

// Pre-built providers for the social buttons.
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

// `db` is our Cloud Firestore handle — the actual database where we store a
// record for each user so the app can show a list of everyone who has signed up.
export const db = getFirestore(app)
