import apiClient from './apiClient';
import { environment } from '../config/environment';

const MOCK_ALERTS = [
  { id: 'ALT-101', title: 'Critical Anomaly Detected', location: 'Pune, Maharashtra', severity: 'CRITICAL', time: '10 mins ago', message: 'Potential duplicate asset work flags triggered across 2 district grants.' },
  { id: 'ALT-102', title: 'Delay Threshold Exceeded', location: 'Lucknow, Uttar Pradesh', severity: 'HIGH', time: '2 hours ago', message: 'Hospital project delayed by 74 days past scheduled completion.' },
  { id: 'ALT-103', title: 'Unusual Expenditure Spike', location: 'Kolkata, West Bengal', severity: 'HIGH', time: '5 hours ago', message: '95% of total sanctioned budget disbursed while physical progress is below 40%.' },
];

export const alertService = {
  async getAlerts() {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ALERTS;
    }
    const response = await apiClient.get('/alerts');
    return response.data;
  },

  async dismissAlert(id) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true, id };
    }
    const response = await apiClient.post(`/alerts/${id}/dismiss`);
    return response.data;
  },
};
