import apiClient from './apiClient';
import { environment } from '../config/environment';
import { MOCK_DASHBOARD_DATA } from '../mocks/dashboard';

export const dashboardService = {
  async getSummary() {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_DASHBOARD_DATA.summary;
    }
    const response = await apiClient.get('/dashboard/summary');
    return response.data;
  },

  async getRiskDistribution() {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_DASHBOARD_DATA.riskDistribution;
    }
    const response = await apiClient.get('/dashboard/risk-distribution');
    return response.data;
  },

  async getStateMetrics() {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return MOCK_DASHBOARD_DATA.stateMetrics;
    }
    const response = await apiClient.get('/dashboard/state-metrics');
    return response.data;
  },
};
