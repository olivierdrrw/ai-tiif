import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { CommunityPost, CommunityComment } from "../types/post";
import type { CommunityGroup } from "../types/group";
import type { Challenge } from "../types/challenge";

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export async function getPosts(): Promise<CommunityPost[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.COMMUNITY_POSTS),
      orderBy("createdAt", "desc")
    )
  );

  return snapshot.docs.map(
    (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as CommunityPost)
  );
}

export async function createPost(
  authorId: string,
  content: string
): Promise<void> {
  await addDoc(collection(db, COLLECTIONS.COMMUNITY_POSTS), {
    authorId,
    content,
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
  });
}

export async function likePost(postId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.COMMUNITY_POSTS, postId), {
    likes: increment(1),
  });
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export async function getComments(postId: string): Promise<CommunityComment[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.COMMUNITY_POSTS, postId, "comments"),
      orderBy("createdAt", "asc")
    )
  );

  return snapshot.docs.map(
    (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as CommunityComment)
  );
}

export async function addComment(
  postId: string,
  authorId: string,
  content: string
): Promise<void> {
  await addDoc(collection(db, COLLECTIONS.COMMUNITY_POSTS, postId, "comments"), {
    postId,
    authorId,
    content,
    createdAt: new Date().toISOString(),
  });

  await updateDoc(doc(db, COLLECTIONS.COMMUNITY_POSTS, postId), {
    comments: increment(1),
  });
}

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

export async function getGroups(): Promise<CommunityGroup[]> {
  const snapshot = await getDocs(collection(db, COLLECTIONS.COMMUNITY_GROUPS));

  return snapshot.docs.map(
    (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as CommunityGroup)
  );
}

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------

export async function getChallenges(): Promise<Challenge[]> {
  const snapshot = await getDocs(collection(db, COLLECTIONS.COMMUNITY_CHALLENGES));

  return snapshot.docs.map(
    (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Challenge)
  );
}
