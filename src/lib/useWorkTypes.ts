"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fbDb, firebaseConfigured } from "./firebase";
import { defaultWorkTypes } from "./workTypes";

/** Active work types from Firestore (Admin > Work Types), falling back to the default list. */
export function useWorkTypes() {
  const [types, setTypes] = useState<string[]>(defaultWorkTypes);
  useEffect(() => {
    if (!firebaseConfigured) return;
    getDocs(collection(fbDb(), "workTypes"))
      .then((snap) => {
        const list = snap.docs
          .map((d) => d.data() as { name: string; active?: boolean; order?: number })
          .filter((d) => d.active !== false && d.name)
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name))
          .map((d) => d.name);
        if (list.length) setTypes(list);
      })
      .catch(() => {});
  }, []);
  return types;
}
