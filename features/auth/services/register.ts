import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";

export async function registerUser(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Firestore user profile automation: every new account gets a profile
  // document immediately, so Settings/Admin/Retention all have real data
  // to read from the moment someone signs up.
  await setDoc(doc(db, COLLECTIONS.USERS, credential.user.uid), {
    email,
    createdAt: new Date().toISOString(),
  });

  // Every new account starts as a plain "member" — roles are elevated
  // manually by a super_admin from the Admin panel.
  await setDoc(doc(db, COLLECTIONS.ROLES, credential.user.uid), {
    role: "member",
  });

  return credential;
}
