import {
    collection,
    getCountFromServer,
  } from "firebase/firestore";
  
  import {
    db,
  } from "@/lib/firebase/firestore";
  
  import {
    COLLECTIONS,
  } from "@/lib/firebase/collections";
  
  export interface DashboardCounts {
    totalUsers: number;
    aiSessions: number;
    totalHumanTwins: number;
    totalSchools: number;
    totalInstitutions: number;
  }
  
  export async function
  getDashboardCounts():
  Promise<DashboardCounts> {
    try {
      const [
        usersSnapshot,
        sessionsSnapshot,
        twinsSnapshot,
        schoolsSnapshot,
        institutionsSnapshot,
      ] = await Promise.all([
        getCountFromServer(
          collection(
            db,
            COLLECTIONS.USERS
          )
        ),
  
        getCountFromServer(
          collection(
            db,
            COLLECTIONS.AI_SESSIONS
          )
        ),
  
        getCountFromServer(
          collection(
            db,
            COLLECTIONS.HUMAN_TWINS
          )
        ),
  
        getCountFromServer(
          collection(
            db,
            COLLECTIONS.SCHOOLS
          )
        ),
  
        getCountFromServer(
          collection(
            db,
            COLLECTIONS.INSTITUTIONS
          )
        ),
      ]);
  
      return {
        totalUsers:
          usersSnapshot
            .data()
            .count,
  
        aiSessions:
          sessionsSnapshot
            .data()
            .count,
  
        totalHumanTwins:
          twinsSnapshot
            .data()
            .count,
  
        totalSchools:
          schoolsSnapshot
            .data()
            .count,
  
        totalInstitutions:
          institutionsSnapshot
            .data()
            .count,
      };
    } catch (error) {
      console.error(
        "Failed to load dashboard counts:",
        error
      );
  
      return {
        totalUsers: 0,
        aiSessions: 0,
        totalHumanTwins: 0,
        totalSchools: 0,
        totalInstitutions: 0,
      };
    }
  }