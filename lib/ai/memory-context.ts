import { MemoryRecord } from "@/types/memory";

export function buildMemoryContext(
  memories: MemoryRecord[]
) {
  return memories
    .slice(0, 20)
    .map(
      (memory) =>
        `[${memory.type}] ${memory.title}: ${memory.content}`
    )
    .join("\n");
}