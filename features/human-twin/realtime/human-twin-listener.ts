import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db }
from "@/lib/firebase/firestore";

export function subscribeHumanTwin(

  userId: string,

  callback: (
    data: any
  ) => void

) {

  return onSnapshot(

    doc(
      db,
      "humanTwins",
      userId
    ),

    (snapshot) => {

      callback(
        snapshot.data()
      );

    }

  );
}