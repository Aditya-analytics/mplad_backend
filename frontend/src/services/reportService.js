import apiClient from './apiClient';
import { environment } from '../config/environment';

export const reportService = {
  async generateReport(options = {}) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        reportId: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        generatedAt: new Date().toISOString(),
        options,
        status: 'SUCCESS',
      };
    }
    const response = await apiClient.post('/reports/generate', options);
    return response.data;
  },
};
