import { HumanTwin } from "@/types/human-twin";

export function calculateBurnoutRisk(
  twin: HumanTwin
) {

  let risk = 0;

  if (
    twin.lifeDomains.career < 50
  ) {
    risk += 25;
  }

  if (
    twin.lifeDomains.physical < 50
  ) {
    risk += 25;
  }

  if (
    twin.lifeDomains.emotional < 50
  ) {
    risk += 25;
  }

  if (
    twin.wellbeingScore < 50
  ) {
    risk += 25;
  }

  return Math.min(
    risk,
    100
  );
}