import apiClient from './apiClient';

export const analyticsService = {
  async fetchMonthlyExpenditure() {
    try {
      const response = await apiClient.get('/analytics');
      return response.data.monthlyExpenditure || [];
    } catch (error) {
      console.error('Error fetching monthly expenditure:', error);
      return [];
    }
  },

  async fetchStateExpenditure() {
    try {
      const response = await apiClient.get('/analytics');
      return response.data.stateExpenditure || [];
    } catch (error) {
      console.error('Error fetching state expenditure:', error);
      return [];
    }
  },

  async fetchTrendRisk() {
    try {
      const response = await apiClient.get('/analytics');
      return response.data.trendRisk || [];
    } catch (error) {
      console.error('Error fetching trend risk:', error);
      return [];
    }
  }
};
