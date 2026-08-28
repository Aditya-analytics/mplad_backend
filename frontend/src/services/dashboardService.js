import apiClient from './apiClient';
import { environment } from '../config/environment';

export const dashboardService = {
  async getSummary() {
    const response = await apiClient.get('/stats/overview');
    const data = response.data;
    
    // Convert total_disbursed (which is in Rupees) to Crores (1 Crore = 10,000,000)
    const disbursedInCr = data.total_disbursed / 10000000;
    
    return {
      totalProjects: data.total_projects,
      flaggedProjects: data.total_duplicates + data.total_cost_anomalies + data.total_delayed,
      criticalAlerts: data.total_compliance_violations,
      totalDisbursed: `₹${disbursedInCr.toFixed(1)} Cr`,
    };
  },

  async getRiskDistribution() {
    const response = await apiClient.get('/stats/overview');
    return response.data.risk_distribution || [];
  },

  async getStateMetrics() {
    const response = await apiClient.get('/stats/overview');
    return response.data.state_metrics || [];
  },
  
  async getGeospatialData() {
    const response = await apiClient.get('/stats/overview');
    return response.data.geospatial_data || [];
  },

  async getNationalRisk() {
    const response = await apiClient.get('/stats/overview');
    return response.data.national_risk || { overall_score: 0, financial_score: 0, delay_score: 0, duplicate_score: 0 };
  }
};
