export interface HumanTwin {
  id: string;

  identityScore: number;

  wellbeingScore: number;

  resilienceScore: number;

  purposeScore: number;

  growthScore: number;

  dominantEmotion:
    | "calm"
    | "happy"
    | "stressed"
    | "sad"
    | "hopeful";

  lastUpdated: string;
}