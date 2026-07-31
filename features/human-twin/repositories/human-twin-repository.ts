import {

 doc,

 setDoc,

 getDoc,

} from "firebase/firestore";

import { db }
from "@/lib/firebase/firestore";

export class HumanTwinRepository {

 static async create(

  twin:any

 ){

  await setDoc(

   doc(
    db,
    "humanTwins",
    twin.userId
   ),

   twin

  );

 }

 static async get(

  userId:string

 ){

  const snapshot=
  await getDoc(

   doc(
    db,
    "humanTwins",
    userId
   )

  );

  return snapshot.data();

 }

}