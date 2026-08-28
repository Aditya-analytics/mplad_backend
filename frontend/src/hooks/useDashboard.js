import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export function useDashboard() {
  const [summary, setSummary] = useState(null);
  const [riskDist, setRiskDist] = useState([]);
  const [stateMetrics, setStateMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sum, dist, states] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getRiskDistribution(),
          dashboardService.getStateMetrics(),
        ]);
        setSummary(sum);
        setRiskDist(dist);
        setStateMetrics(states);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { summary, riskDist, stateMetrics, loading, error };
}
