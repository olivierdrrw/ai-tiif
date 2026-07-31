import {
    MemoryRecord,
  } from "@/types/memory";
  
  export function
  getDominantEmotion(
    memories:
      MemoryRecord[]
  ) {
    const counts:
      Record<
        string,
        number
      > = {};
  
    memories.forEach(
      (memory) => {
        counts[
          memory.emotion
        ] =
          (
            counts[
              memory.emotion
            ] ?? 0
          ) + 1;
      }
    );
  
    let emotion =
      "calm";
  
    let highest = 0;
  
    Object.entries(
      counts
    ).forEach(
      ([key, count]) => {
        if (
          count >
          highest
        ) {
          highest =
            count;
  
          emotion =
            key;
        }
      }
    );
  
    return emotion;
  }