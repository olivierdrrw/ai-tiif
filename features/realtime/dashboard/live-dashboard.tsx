"use client";

import {
  useHumanTwinStore,
} from "@/stores/human-twin-store";

export function LiveDashboard() {
  const twin =
    useHumanTwinStore(
      (state) =>
        state.twin
    );

  return (
    <div
      className="
      grid
      gap-6
      md:grid-cols-4
    "
    >

      <StatCard
        title="Identity"
        value={
          twin.identityScore
        }
      />

      <StatCard
        title="Growth"
        value={
          twin.growthScore
        }
      />

      <StatCard
        title="Wellbeing"
        value={
          twin.wellbeingScore
        }
      />

      <StatCard
        title="Purpose"
        value={
          twin.purposeScore
        }
      />

    </div>
  );
}