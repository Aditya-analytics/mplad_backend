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
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';

import { ROUTES } from '../constants/routes';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
          <Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetailsPage />} />
          <Route path={ROUTES.ANOMALIES_DUPLICATES} element={<DuplicatesPage />} />
          <Route path={ROUTES.ANOMALIES_COSTS} element={<CostsPage />} />
          <Route path={ROUTES.ANOMALIES_DELAYS} element={<DelaysPage />} />
          <Route path={ROUTES.ANOMALIES_COMPLIANCE} element={<CompliancePage />} />
          <Route path={ROUTES.ANOMALY_DETAILS} element={<AnomalyDetailsPage />} />
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
          <Route path={ROUTES.ALERTS} element={<AlertsPage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
