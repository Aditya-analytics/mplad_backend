export const environment = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1',
  appName: import.meta.env.VITE_APP_NAME || 'MPLADS AI Governance Platform',
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
};
