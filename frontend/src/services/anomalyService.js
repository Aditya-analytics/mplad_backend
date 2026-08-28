import apiClient from './apiClient';
import { environment } from '../config/environment';
import { MOCK_ANOMALIES } from '../mocks/anomalies';

export const anomalyService = {
  async getAnomalies(filters = {}) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let result = [...MOCK_ANOMALIES];
      if (filters.type && filters.type !== 'ALL') {
        result = result.filter((a) => a.type === filters.type);
      }
      return result;
    }
    const response = await apiClient.get('/anomalies', { params: filters });
    return response.data;
  },

  async getAnomalyById(id) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const item = MOCK_ANOMALIES.find((a) => a.id === id);
      if (!item) throw new Error('Anomaly record not found');
      return item;
    }
    const response = await apiClient.get(`/anomalies/${id}`);
    return response.data;
  },

  async updateAnomalyStatus(id, status) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const anomaly = MOCK_ANOMALIES.find((a) => a.id === id);
      if (anomaly) {
        anomaly.status = status;
      }
      return { success: true, id, status };
    }
    const response = await apiClient.post(`/anomalies/${id}/review`, { status });
    return response.data;
  },
};
