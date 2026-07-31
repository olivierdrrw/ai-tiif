import { HumanTwin } from "@/types/human-twin";

export class HumanTwinEngine {
  static wellbeing(twin: HumanTwin) {
    return Math.round(
      (
        twin.identity +
        twin.resilience +
        twin.growth
      ) / 3
    );
  }

  static growthRate(previous: number, current: number) {
    return current - previous;
  }

  static confidence(identity: number, consistency: number) {
    return Math.round((identity + consistency) / 2);
  }
}