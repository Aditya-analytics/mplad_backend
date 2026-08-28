import apiClient from './apiClient';
import { environment } from '../config/environment';
import { MOCK_PROJECTS } from '../mocks/projects';

export const projectService = {
  async getProjects(filters = {}) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      let result = [...MOCK_PROJECTS];
      if (filters.state && filters.state !== 'ALL') {
        result = result.filter((p) => p.state.toLowerCase() === filters.state.toLowerCase());
      }
      if (filters.riskLevel && filters.riskLevel !== 'ALL') {
        result = result.filter((p) => p.riskLevel === filters.riskLevel);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            p.projectName.toLowerCase().includes(q) ||
            p.district.toLowerCase().includes(q)
        );
      }
      return result;
    }
    const params = { page: 1, limit: 500 };
    const response = await apiClient.get('/projects', { params });
    let result = (response.data.data || []).map(p => ({
      ...p,
      id: p.id ? String(p.id).replace('.0', '') : p.id,
      district: p.constituency || 'Unknown', // Fallback since master dataset doesn't have district
      sanctionedAmount: parseFloat(p.sanctionedAmount) || parseFloat(p['RECOMMENDED AMOUNT   ( ₹ )']) || 0,
      utilizedAmount: parseFloat(p.utilizedAmount) || parseFloat(p['Amount Disbursed ( ₹ )']) || 0,
      description: p.projectName,
      physicalProgress: Math.floor(Math.random() * 40) + 40, // Simulate for now since dataset lacks physical progress
      delayDays: p.riskScore > 50 ? Math.floor(Math.random() * 100) : 0
    }));
    
    // Apply client-side filters to the fetched batch
    if (filters.state && filters.state !== 'ALL') {
      result = result.filter((p) => p.state && p.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.riskLevel && filters.riskLevel !== 'ALL') {
      result = result.filter((p) => p.riskLevel === filters.riskLevel);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.id && p.id.toLowerCase().includes(q)) ||
          (p.projectName && p.projectName.toLowerCase().includes(q)) ||
          (p.district && p.district.toLowerCase().includes(q))
      );
    }
    return result;
  },

  async getProjectById(id) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const proj = MOCK_PROJECTS.find((p) => p.id === id);
      if (!proj) throw new Error('Project not found');
      return proj;
    }
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
};
