import {
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";

async function ensureUserProfile(credential: UserCredential) {
  await setDoc(
    doc(db, COLLECTIONS.USERS, credential.user.uid),
    {
      email: credential.user.email,
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );
  return credential;
}

/**
 * Social sign-in. Each provider must be enabled in the Firebase Console
 * (Authentication → Sign-in method) before it will work — this code is
 * ready to go the moment that's turned on, no further changes needed.
 */
export async function loginWithGoogle() {
  return ensureUserProfile(await signInWithPopup(auth, new GoogleAuthProvider()));
}

export async function loginWithGithub() {
  return ensureUserProfile(await signInWithPopup(auth, new GithubAuthProvider()));
}

export async function loginWithFacebook() {
  return ensureUserProfile(await signInWithPopup(auth, new FacebookAuthProvider()));
}

export async function loginWithApple() {
  return ensureUserProfile(await signInWithPopup(auth, new OAuthProvider("apple.com")));
}
