import {
    DashboardIntelligence,
  } from "@/types/dashboard-intelligence";
  
  import {
    getDashboardCounts,
  } from "@/repositories/dashboard-intelligence-repository";
  
  export async function
  getDashboardIntelligence():
  Promise<DashboardIntelligence> {
  
    const counts =
      await getDashboardCounts();
  
    return {
      totalUsers:
        counts.totalUsers,
  
      activeUsers:
        counts.totalUsers,
  
      aiSessions:
        counts.aiSessions,
  
      riskAlerts: 0,
  
      averageWellnessScore:
        0,
  
      highRiskUsers: 0,
  
      dominantEmotion:
        "calm",
  
      totalHumanTwins:
        counts.totalHumanTwins,
  
      totalInstitutions:
        counts.totalInstitutions,
  
      totalSchools:
        counts.totalSchools,
  
      lastUpdated:
        new Date()
          .toISOString(),
    };
  }