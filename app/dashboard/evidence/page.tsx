"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";

import { db } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";

export default function EvidencePage() {
  const [stats, setStats] = useState({
    users: 0,
    journalEntries: 0,
    assessments: 0,
    recommendCount: 0,
    feedbackCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [users, journals, assessments, feedbackDocs] = await Promise.all([
        getCountFromServer(collection(db, COLLECTIONS.USERS)),
        getCountFromServer(collection(db, COLLECTIONS.JOURNALS)),
        getCountFromServer(collection(db, COLLECTIONS.ASSESSMENTS)),
        getDocs(collection(db, COLLECTIONS.FEEDBACK)),
      ]);

      const recommendCount = feedbackDocs.docs.filter(
        (d) => d.data().wouldRecommend === true
      ).length;

      setStats({
        users: users.data().count,
        journalEntries: journals.data().count,
        assessments: assessments.data().count,
        recommendCount,
        feedbackCount: feedbackDocs.size,
      });
      setIsLoading(false);
    }

    load();
  }, []);

  const recommendRate =
    stats.feedbackCount > 0
      ? Math.round((stats.recommendCount / stats.feedbackCount) * 100)
      : null;

  const metrics = [
    { label: "People using TIIF", value: stats.users },
    { label: "Journal entries written", value: stats.journalEntries },
    { label: "Assessments completed", value: stats.assessments },
    {
      label: "Would recommend to a friend",
      value: recommendRate === null ? "—" : `${recommendRate}%`,
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Evidence & Impact</h1>
        <p className="mt-1 text-slate-400">Real numbers, pulled live from the platform.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 text-slate-500">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-3xl font-bold text-white">{m.value}</p>
              <p className="mt-1 text-sm text-slate-400">{m.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
