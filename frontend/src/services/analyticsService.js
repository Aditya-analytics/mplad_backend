import apiClient from './apiClient';
import { environment } from '../config/environment';
import { MOCK_ANALYTICS_DATA } from '../mocks/analytics';

export const analyticsService = {
  async getMonthlyExpenditure() {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return MOCK_ANALYTICS_DATA.monthlyExpenditure;
    }
    const response = await apiClient.get('/analytics/expenditure');
    return response.data;
  },

  async getCategoryBreakdown() {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_ANALYTICS_DATA.categoryBreakdown;
    }
    const response = await apiClient.get('/analytics/categories');
    return response.data;
  },

  async getRiskTrends() {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return MOCK_ANALYTICS_DATA.trendRisk;
    }
    const response = await apiClient.get('/analytics/trends');
    return response.data;
  },
};
