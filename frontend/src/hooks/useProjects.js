import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

export function useProjects(initialFilters = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await projectService.getProjects(filters);
        setProjects(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [filters]);

  return { projects, loading, error, setFilters };
}
