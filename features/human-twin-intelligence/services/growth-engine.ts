import { HumanTwin } from "@/types/human-twin";

export function calculateGrowthPotential(
  twin: HumanTwin
) {

  const average =

    (
      twin.identityScore +
      twin.growthScore +
      twin.purposeScore +
      twin.impactScore
    ) / 4;

  return Math.round(
    average
  );
}