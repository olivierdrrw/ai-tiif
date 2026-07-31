"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { UserRole } from "@/types/role";

export function useUserRole() {
  const user = useAuthStore((state) => state.user);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    getDoc(doc(db, COLLECTIONS.ROLES, user.uid)).then((snap) => {
      setRole((snap.data()?.role as UserRole) ?? "member");
      setIsLoading(false);
    });
  }, [user?.uid]);

  return { role, isLoading };
}
