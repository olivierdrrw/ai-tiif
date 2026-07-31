export type MemoryType =
  | "journal"
  | "conversation"
  | "assessment"
  | "goal"
  | "milestone"
  | "reflection"
  | "mood";

export interface MemoryRecord {
  id: string;

  type: MemoryType;

  title: string;

  content: string;

  createdAt: string;

  importance: number;

  tags: string[];
}