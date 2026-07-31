import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  language?: string;
  timezone?: string;
  privacy?: "public" | "private";
  notificationsEnabled?: boolean;
  interests?: string[];
  skills?: string[];
  certificates?: string[];
  showOnLeaderboard?: boolean;
  [key: string]: unknown;
}

export async function getUsers() {
  const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.USERS, uid), data, { merge: true });
}
