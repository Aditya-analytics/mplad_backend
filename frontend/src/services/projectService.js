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
    const response = await apiClient.get('/projects', { params: filters });
    return response.data;
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
