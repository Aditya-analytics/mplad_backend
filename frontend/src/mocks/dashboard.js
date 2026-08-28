export const MOCK_DASHBOARD_DATA = {
  summary: {
    totalProjects: 18642,
    totalSanctionedFunds: 48620000000, // 4,862 Cr
    totalUtilizedFunds: 39170000000,   // 3,917 Cr
    utilizationRate: 80.56,
    activeMonitoring: 12438,
    delayedProjects: 1284,
    flaggedAnomalies: 638,
    financialExposure: 846000000,      // 84.6 Cr
    nationalRiskScore: 72,
  },
  riskDistribution: [
    { name: 'Low Risk', value: 45, count: 8388, color: '#10B981' },
    { name: 'Moderate Risk', value: 30, count: 5592, color: '#D97706' },
    { name: 'High Risk', value: 18, count: 3355, color: '#EA580C' },
    { name: 'Critical Risk', value: 7, count: 1307, color: '#DC2626' },
  ],
  stateMetrics: [
    { name: 'Maharashtra', works: 2480, sanctioned: 6400000000, utilization: 82.4, delayed: 142, anomalies: 68, risk: 'HIGH' },
    { name: 'Uttar Pradesh', works: 3820, sanctioned: 9800000000, utilization: 76.1, delayed: 284, anomalies: 124, risk: 'CRITICAL' },
    { name: 'Karnataka', works: 1940, sanctioned: 5100000000, utilization: 84.8, delayed: 88, anomalies: 34, risk: 'MODERATE' },
    { name: 'Rajasthan', works: 1760, sanctioned: 4500000000, utilization: 89.2, delayed: 46, anomalies: 18, risk: 'LOW' },
    { name: 'West Bengal', works: 2310, sanctioned: 6100000000, utilization: 79.4, delayed: 154, anomalies: 76, risk: 'HIGH' },
  ],
};
