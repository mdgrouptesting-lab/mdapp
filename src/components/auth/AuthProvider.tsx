"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { fbAuth, fbDb, firebaseConfigured } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({ user: null, profile: null, loading: true, logout: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    let unsubProfile: (() => void) | undefined;
    const unsub = onAuthStateChanged(fbAuth(), (u) => {
      setUser(u);
      unsubProfile?.();
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      // live profile: subscription/verification changes appear instantly
      unsubProfile = onSnapshot(
        doc(fbDb(), "users", u.uid),
        (snap) => {
          setProfile(snap.exists() ? ({ uid: u.uid, ...snap.data() } as UserProfile) : null);
          setLoading(false);
        },
        () => setLoading(false),
      );
    });
    return () => {
      unsub();
      unsubProfile?.();
    };
  }, []);

  const logout = async () => {
    await signOut(fbAuth());
  };

  return <AuthContext.Provider value={{ user, profile, loading, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
