import apiClient from './apiClient';
import { environment } from '../config/environment';
import { MOCK_ANOMALIES } from '../mocks/anomalies';

export const anomalyService = {
  async getDuplicates(filters = {}) {
    const response = await apiClient.get('/anomalies/duplicates', { params: { limit: 100 } });
    return (response.data.data || []).map(item => ({
      id: `DUP-${item.Project_1_ID}`,
      projectId: item.Project_1_ID,
      projectName: item.Project_1_Desc,
      matchedProjectId: item.Project_2_ID,
      matchedProjectName: item.Project_2_Desc,
      similarityScore: (item.Similarity_Score * 100).toFixed(1),
      state: item.State,
      constituency: item.Constituency,
      detectedAt: new Date().toISOString()
    }));
  },

  async getCosts(filters = {}) {
    const response = await apiClient.get('/anomalies/costs', { params: { limit: 100 } });
    return (response.data.data || []).map(item => ({
      id: `COST-${item.Project_ID}`,
      projectId: item.Project_ID,
      projectName: item['Work description'],
      recommendedAmount: item['RECOMMENDED AMOUNT   ( ₹ )'],
      categoryMean: item.Category_Mean_Cost,
      anomalyScore: (item.Anomaly_Score || -1),
      state: item.State,
      constituency: item.Constituency,
      category: item['Work category'] || 'General Work',
      detectedAt: new Date().toISOString()
    }));
  },

  async getDelays(filters = {}) {
    const response = await apiClient.get('/anomalies/delays', { params: { limit: 100 } });
    return (response.data.data || []).map(item => ({
      id: `DEL-${item.Project_ID}`,
      projectId: item.Project_ID,
      projectName: `Project ${item.Project_ID}`,
      daysOverdue: Math.floor(item.Days_Overdue),
      predictedDays: Math.floor(item.Predicted_Days),
      elapsedDays: Math.floor(item.Elapsed_Days || (item.Days_Overdue + item.Predicted_Days)),
      delayRisk: (item.Delay_Risk_Prob ? (item.Delay_Risk_Prob * 100).toFixed(1) : 85),
      state: item.State,
      constituency: item.Constituency,
      category: item['Work category'] || 'General Work',
      detectedAt: new Date().toISOString()
    }));
  },

  async getCompliance(filters = {}) {
    const response = await apiClient.get('/compliance', { params: { limit: 100 } });
    return (response.data.data || []).map(item => ({
      id: `COMP-${item.Project_ID}`,
      projectId: item.Project_ID,
      projectName: `Project ${item.Project_ID}`,
      violationType: item.Violation_Type,
      detail: item.Detail,
      amountInQuestion: item.Amount_In_Question,
      state: item.State,
      constituency: item.Constituency,
      detectedAt: new Date().toISOString()
    }));
  },

  async getAnomalyById(id) {
    if (id.startsWith('DUP-')) return (await this.getDuplicates()).find(a => a.id === id);
    if (id.startsWith('COST-')) return (await this.getCosts()).find(a => a.id === id);
    if (id.startsWith('DEL-')) return (await this.getDelays()).find(a => a.id === id);
    if (id.startsWith('COMP-')) return (await this.getCompliance()).find(a => a.id === id);
    throw new Error('Anomaly record not found');
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
