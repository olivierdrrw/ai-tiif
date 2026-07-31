import {
    getInstitutions,
  } from "@/repositories/institution-repository";
  
  export async function
  getInstitutionAnalytics() {
    const institutions =
      await getInstitutions();
  
    return {
      totalInstitutions:
        institutions.length,
  
      totalUsers:
        institutions.reduce(
          (
            sum,
            institution
          ) =>
            sum +
            institution.activeUsers,
          0
        ),
  
      averageWellness:
        institutions.length === 0
          ? 0
          : Math.round(
              institutions.reduce(
                (
                  sum,
                  institution
                ) =>
                  sum +
                  institution.wellnessScore,
                0
              ) /
                institutions.length
            ),
    };
  }