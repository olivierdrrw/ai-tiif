import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db }
from "@/lib/firebase/firestore";

export async function saveHumanTwin(
  userId: string,
  twin: unknown
) {
  await setDoc(
    doc(
      db,
      "human_twins",
      userId
    ),
    twin
  );
}

export async function getHumanTwin(
  userId: string
) {
  const snapshot =
    await getDoc(
      doc(
        db,
        "human_twins",
        userId
      )
    );

  return snapshot.data();
}