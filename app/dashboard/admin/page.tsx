"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer, doc, setDoc, getDocs } from "firebase/firestore";
import { Loader2, Plus } from "lucide-react";

import { db } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { getUsers } from "@/repositories/user-repository";
import { TherapyRepository } from "@/features/therapist/repositories/therapy-repository";
import { AdminRoute } from "@/features/auth/components/admin-route";
import { getExecutivePredictions } from "@/services/predictions/get-executive-predictions";
import type { Therapist } from "@/features/therapist/therapist.type";
import type { UserRole } from "@/types/role";

const ROLE_OPTIONS: UserRole[] = [
  "member",
  "therapist",
  "researcher",
  "institution_admin",
  "tenant_admin",
  "super_admin",
];

interface AdminUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminPageContent />
    </AdminRoute>
  );
}

function AdminPageContent() {
  const [counts, setCounts] = useState({
    users: 0,
    humanTwins: 0,
    assessments: 0,
    journals: 0,
  });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Record<string, UserRole>>({});
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [forecast, setForecast] = useState<{
    wellness: { predictedScore: number; status: string };
    risk: { predictedRisk: number; level: string };
  } | null>(null);
  const [newTherapistName, setNewTherapistName] = useState("");
  const [newTherapistSpecialization, setNewTherapistSpecialization] = useState("");
  const [isAddingTherapist, setIsAddingTherapist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [userCount, twinCount, assessmentCount, journalCount, usersList, therapistList, rolesSnap] =
        await Promise.all([
          getCountFromServer(collection(db, COLLECTIONS.USERS)),
          getCountFromServer(collection(db, COLLECTIONS.HUMAN_TWINS)),
          getCountFromServer(collection(db, COLLECTIONS.ASSESSMENTS)),
          getCountFromServer(collection(db, COLLECTIONS.JOURNALS)),
          getUsers(),
          TherapyRepository.getTherapists(),
          getDocs(collection(db, COLLECTIONS.ROLES)),
        ]);

      const roleMap: Record<string, UserRole> = {};
      rolesSnap.docs.forEach((d) => {
        roleMap[d.id] = d.data().role as UserRole;
      });
      setRoles(roleMap);

      setCounts({
        users: userCount.data().count,
        humanTwins: twinCount.data().count,
        assessments: assessmentCount.data().count,
        journals: journalCount.data().count,
      });
      setUsers(usersList as AdminUser[]);
      setTherapists(therapistList);

      const moodSnap = await getDocs(collection(db, "moodEntries"));
      const moodDocs = moodSnap.docs.map((d) => d.data());
      if (moodDocs.length > 0) {
        const wellnessScores = moodDocs.map((m: any) => m.energy ?? 50);
        const riskScores = moodDocs.map((m: any) => m.stress ?? 50);
        setForecast(await getExecutivePredictions(wellnessScores, riskScores));
      }

      setIsLoading(false);
    }

    load();
  }, []);

  async function handleRoleChange(userId: string, role: UserRole) {
    setRoles((prev) => ({ ...prev, [userId]: role }));
    await setDoc(doc(db, COLLECTIONS.ROLES, userId), { role });
  }

  async function handleAddTherapist() {
    if (!newTherapistName.trim() || !newTherapistSpecialization.trim()) return;
    setIsAddingTherapist(true);
    await TherapyRepository.addTherapist({
      fullName: newTherapistName.trim(),
      specialization: newTherapistSpecialization.trim(),
      licenseNumber: "",
    });
    setNewTherapistName("");
    setNewTherapistSpecialization("");
    const list = await TherapyRepository.getTherapists();
    setTherapists(list);
    setIsAddingTherapist(false);
  }

  const metrics = [
    { label: "Users", value: counts.users },
    { label: "Human Twins", value: counts.humanTwins },
    { label: "Assessments", value: counts.assessments },
    { label: "Journal Entries", value: counts.journals },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {metric.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {isLoading ? "—" : metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
          Users
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12 text-slate-500">
            <Loader2 className="animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No users yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-500">
                <th className="pb-3 font-normal">Name</th>
                <th className="pb-3 font-normal">Email</th>
                <th className="pb-3 font-normal">Joined</th>
                <th className="pb-3 font-normal">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 text-slate-300">
                  <td className="py-3">
                    {[u.firstName, u.lastName].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="py-3 text-slate-400">{u.email ?? "—"}</td>
                  <td className="py-3 text-slate-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3">
                    <select
                      defaultValue={roles[u.id] ?? "member"}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1 text-xs text-slate-300"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
          Population Forecast
        </h2>

        {!forecast ? (
          <p className="text-sm text-slate-500">Not enough aggregate data yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs text-slate-500">Predicted wellness trend</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {forecast.wellness.predictedScore}
              </p>
              <p className={`mt-1 text-xs capitalize ${forecast.wellness.status === "healthy" ? "text-navy-300" : "text-navy-300"}`}>
                {forecast.wellness.status}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs text-slate-500">Predicted risk trend</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {forecast.risk.predictedRisk}
              </p>
              <p className={`mt-1 text-xs capitalize ${forecast.risk.level === "low" ? "text-navy-300" : forecast.risk.level === "medium" ? "text-navy-300" : "text-rose-300"}`}>
                {forecast.risk.level}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
          Therapists
        </h2>

        <div className="mb-4 flex flex-wrap gap-2">
          <input
            value={newTherapistName}
            onChange={(e) => setNewTherapistName(e.target.value)}
            placeholder="Full name"
            className="input flex-1"
          />
          <input
            value={newTherapistSpecialization}
            onChange={(e) => setNewTherapistSpecialization(e.target.value)}
            placeholder="Specialization"
            className="input flex-1"
          />
          <button
            onClick={handleAddTherapist}
            disabled={isAddingTherapist}
            className="flex items-center gap-2 rounded-xl bg-navy-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-400 disabled:opacity-50"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        <div className="space-y-2">
          {therapists.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-white/5 px-4 py-2.5 text-sm text-slate-300"
            >
              <span>{t.fullName}</span>
              <span className="text-xs text-slate-500">{t.specialization}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
