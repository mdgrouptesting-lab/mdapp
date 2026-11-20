"use client";

import { useEffect, useState } from "react";
import { onSnapshot, type Query } from "firebase/firestore";
import { toDate } from "./utils";

/** Realtime list of documents for a Firestore query, newest first by createdAt. */
export function useLive<T extends { id: string }>(makeQuery: () => Query | null, deps: unknown[] = []) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const q = makeQuery();
    if (!q) return;
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as T);
        list.sort(
          (a, b) =>
            (toDate((b as unknown as { createdAt?: never }).createdAt)?.getTime() || 0) -
            (toDate((a as unknown as { createdAt?: never }).createdAt)?.getTime() || 0),
        );
        setData(list);
      },
      (e) => {
        setError(e.message);
        setData([]);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, error };
}
