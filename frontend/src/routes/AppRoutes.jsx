import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

import { LandingPage } from '../pages/Landing/LandingPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { ProjectsPage } from '../pages/Projects/ProjectsPage';
import { ProjectDetailsPage } from '../pages/ProjectDetails/ProjectDetailsPage';
import { AnomalyDetailsPage } from '../pages/Anomalies/AnomalyDetailsPage';
import { DuplicatesPage } from '../pages/Anomalies/DuplicatesPage';
import { CostsPage } from '../pages/Anomalies/CostsPage';
import { DelaysPage } from '../pages/Anomalies/DelaysPage';
import { CompliancePage } from '../pages/Anomalies/CompliancePage';
import { AnalyticsPage } from '../pages/Analytics/AnalyticsPage';
import { AlertsPage } from '../pages/Alerts/AlertsPage';
import { ReportsPage } from '../pages/Reports/ReportsPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { CitizenParticipationPage } from '../pages/Citizen/CitizenParticipationPage';
import { CitizenIntelligencePage } from '../pages/Admin/CitizenIntelligencePage';
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../constants/routes';

function AdminOnly({ children }) {
  const { role } = useAuth();
  const navigate = useNavigate();

  if (role === 'CITIZEN') {
    return (
      <div className="dashboard-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', maxWidth: '520px', margin: '3rem auto' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--saffron-light)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 1rem' }}>
          <i className="fa-solid fa-lock"></i>
        </div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
          Access Restricted
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: '1.5rem' }}>
          You do not have permission to access this section.
        </p>
        <button className="btn-primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Return to Dashboard
        </button>
      </div>
    );
  }
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Entry Route: index.html entry goes directly to Platform Login */}
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="/landing" element={<Navigate to={ROUTES.LOGIN} replace />} />

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Publicly viewable by both Citizens & Admins */}
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
          <Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetailsPage />} />
          <Route path={ROUTES.CITIZEN_PARTICIPATION} element={<CitizenParticipationPage />} />

          {/* Core AI Intelligence Engines (Accessible to both Citizens & Admins) */}
          <Route path={ROUTES.ANOMALIES_DUPLICATES} element={<DuplicatesPage />} />
          <Route path={ROUTES.ANOMALIES_COSTS} element={<CostsPage />} />
          <Route path={ROUTES.ANOMALIES_DELAYS} element={<DelaysPage />} />
          <Route path={ROUTES.ANOMALIES_COMPLIANCE} element={<CompliancePage />} />
          <Route path={ROUTES.ANOMALY_DETAILS} element={<AnomalyDetailsPage />} />

          {/* Admin-only Governance & Audit routes */}
          <Route path={ROUTES.ANALYTICS} element={<AdminOnly><AnalyticsPage /></AdminOnly>} />
          <Route path={ROUTES.ALERTS} element={<AdminOnly><AlertsPage /></AdminOnly>} />
          <Route path={ROUTES.REPORTS} element={<AdminOnly><ReportsPage /></AdminOnly>} />
          <Route path={ROUTES.PROFILE} element={<AdminOnly><ProfilePage /></AdminOnly>} />
          <Route path={ROUTES.CITIZEN_INTELLIGENCE} element={<AdminOnly><CitizenIntelligencePage /></AdminOnly>} />
        </Route>
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

