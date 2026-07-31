import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth }
from "@/lib/firebase/auth";

export class AuthService {

  static register(
    email: string,
    password: string
  ) {

    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  static login(
    email: string,
    password: string
  ) {

    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  static logout() {

    return signOut(auth);
  }
}