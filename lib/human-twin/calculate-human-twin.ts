import { calculateIdentity } from "./calculate-identity";
import { calculateGrowth } from "./calculate-growth";
import { calculateWellness } from "./calculate-wellness";
import { calculateResilience } from "./calculate-resilience";
import { calculatePurpose } from "./calculate-purpose";

export function calculateHumanTwin(
  signals: HumanTwinSignals
) {
  return {
    identityScore:
      calculateIdentity(signals),

    growthScore:
      calculateGrowth(signals),

    wellnessScore:
      calculateWellness(signals),

    resilienceScore:
      calculateResilience(signals),

    purposeScore:
      calculatePurpose(signals),
  };
}