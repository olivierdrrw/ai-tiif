"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";

import { db } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";

interface UserRow {
  id: string;
  createdAt?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export default function RetentionPage() {
  const [rates, setRates] = useState<{ d1: number; d7: number; d30: number } | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [usersSnap, journalsSnap, moodSnap] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.USERS)),
        getDocs(collection(db, COLLECTIONS.JOURNALS)),
        getDocs(collection(db, "moodEntries")),
      ]);

      const users: UserRow[] = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const activityByUser = new Map<string, string[]>();
      const addActivity = (userId: string, createdAt: string) => {
        if (!activityByUser.has(userId)) activityByUser.set(userId, []);
        activityByUser.get(userId)!.push(createdAt);
      };

      journalsSnap.docs.forEach((d) => {
        const data = d.data();
        if (data.userId && data.createdAt) addActivity(data.userId, data.createdAt);
      });
      moodSnap.docs.forEach((d) => {
        const data = d.data();
        if (data.userId && data.createdAt) addActivity(data.userId, data.createdAt);
      });

      const usersWithSignup = users.filter((u) => u.createdAt);

      function retentionAt(days: number) {
        const eligible = usersWithSignup.filter(
          (u) => Date.now() - new Date(u.createdAt!).getTime() >= days * DAY_MS
        );
        if (eligible.length === 0) return 0;

        const retained = eligible.filter((u) => {
          const activity = activityByUser.get(u.id) ?? [];
          const signupTime = new Date(u.createdAt!).getTime();
          return activity.some((a) => new Date(a).getTime() - signupTime >= days * DAY_MS);
        });

        return Math.round((retained.length / eligible.length) * 100);
      }

      setRates({ d1: retentionAt(1), d7: retentionAt(7), d30: retentionAt(30) });
      setTotalUsers(users.length);
      setIsLoading(false);
    }

    load();
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Retention</h1>
        <p className="mt-1 text-slate-400">
          Share of users still active N days after signing up ({totalUsers} total users).
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 text-slate-500">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Day 1", value: rates?.d1 },
            { label: "Day 7", value: rates?.d7 },
            { label: "Day 30", value: rates?.d30 },
          ].map((r) => (
            <div key={r.label} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-center">
              <p className="text-3xl font-bold text-white">{r.value}%</p>
              <p className="mt-1 text-sm text-slate-400">{r.label}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Target from your roadmap: D7 retention above 30%.
      </p>
    </div>
  );
}
