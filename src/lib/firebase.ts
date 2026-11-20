"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let _app: FirebaseApp | undefined;
function app() {
  if (!_app) _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

/* Lazy getters so the site still builds/renders before .env is filled in. */
export const fbAuth = (): Auth => getAuth(app());
export const fbDb = (): Firestore => getFirestore(app());
export const fbStorage = (): FirebaseStorage => getStorage(app());

const MAX_MB = 5;

/** Upload an image to Firebase Storage and return its public download URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed");
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`Each image must be under ${MAX_MB} MB`);
  const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-60);
  const r = ref(fbStorage(), `${folder}/${Date.now()}-${safe}`);
  await uploadBytes(r, file, { contentType: file.type });
  return getDownloadURL(r);
}

/** fetch() wrapper that attaches the signed-in user's Firebase ID token. */
export async function authedFetch(input: string, init: RequestInit = {}) {
  const user = fbAuth().currentUser;
  if (!user) throw new Error("Please log in first");
  const token = await user.getIdToken();
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}), Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}
