# MPLADS AI Governance & Transparency Platform — React Frontend

Production-grade modular **React + Vite** frontend architecture for Smart India Hackathon (SIH) 2026.

## 🚀 Quick Start Instructions

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run Vite local development server
npm run dev

# Build production distribution bundle
npm run build
```

## 📁 Directory Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/       # Reusable UI components (common, navigation, dashboard, projects, anomalies)
│   ├── config/           # Environment variables & API client settings
│   ├── constants/        # Route, Role, Risk Level, Status constants
│   ├── context/          # AuthContext for session management
│   ├── hooks/            # Custom React Hooks (useAuth, useDashboard, useProjects, useAnomalies)
│   ├── layouts/          # PublicLayout, AuthLayout, DashboardLayout
│   ├── mocks/            # Synthetic MPLADS datasets
│   ├── pages/            # Page view controllers (Landing, Login, Dashboard, Projects, Details, Anomalies, Analytics, Alerts, Reports, Profile)
│   ├── routes/           # AppRoutes, ProtectedRoute, RoleRoute
│   ├── services/         # Centralized API service layer (apiClient, authService, projectService, anomalyService, etc.)
│   ├── utils/            # Currency formatting, date formatting, risk color mapping
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

## 🔌 API Integration Readiness
To connect to a live Node.js/Express backend API in the future:
1. Update `VITE_ENABLE_MOCK_API=false` in `.env`.
2. Update `VITE_API_BASE_URL=http://your-backend-api.gov.in/api`.
3. The UI components will automatically route requests through `apiClient.js` without any component rewrites.
