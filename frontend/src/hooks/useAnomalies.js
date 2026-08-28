import { useState, useEffect } from 'react';
import { anomalyService } from '../services/anomalyService';

export function useAnomalies(filters = {}) {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await anomalyService.getAnomalies(filters);
        setAnomalies(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch anomaly records');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [JSON.stringify(filters)]);

  return { anomalies, loading, error };
}
