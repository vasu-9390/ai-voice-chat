import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage, EmailVerificationPage } from '@/pages/auth/ResetPasswordPage';

import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute, RoleRoute } from './ProtectedRoute';

import { DashboardPage } from '@/pages/DashboardPage';
import { InboxPage } from '@/pages/InboxPage';
import { ChatAssistantPage } from '@/pages/ChatAssistantPage';
import { VoiceStudioPage } from '@/pages/VoiceStudioPage';
import { TicketsPage } from '@/pages/TicketsPage';
import { AgentWorkspacePage } from '@/pages/AgentWorkspacePage';
import { AgentControlPage } from '@/pages/AgentControlPage';
import { KnowledgeBasePage } from '@/pages/KnowledgeBasePage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { BillingPage } from '@/pages/BillingPage';
import { NotFoundPage, ServerErrorPage } from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/500" element={<ServerErrorPage />} />

      {/* Protected App Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        
        {/* Operations Dashboard */}
        <Route
          path="dashboard"
          element={
            <RoleRoute allowedRoles={['ORG_ADMIN', 'SUPER_ADMIN', 'TEAM_MANAGER', 'SUPPORT_AGENT']}>
              <DashboardPage />
            </RoleRoute>
          }
        />

        {/* AI Support Inbox */}
        <Route
          path="inbox"
          element={
            <RoleRoute allowedRoles={['SUPPORT_AGENT', 'TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN']}>
              <InboxPage />
            </RoleRoute>
          }
        />

        {/* Customer & Team Chat Assistant */}
        <Route path="chat" element={<ChatAssistantPage />} />

        {/* Real-time Voice AI Studio */}
        <Route path="voice" element={<VoiceStudioPage />} />

        {/* Tickets Management */}
        <Route path="tickets" element={<TicketsPage />} />

        {/* Agent Workspace & AI Copilot */}
        <Route
          path="workspace"
          element={
            <RoleRoute allowedRoles={['SUPPORT_AGENT', 'TEAM_MANAGER', 'ORG_ADMIN']}>
              <AgentWorkspacePage />
            </RoleRoute>
          }
        />

        {/* AI Agent Control Panel */}
        <Route
          path="agent-control"
          element={
            <RoleRoute allowedRoles={['TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN']}>
              <AgentControlPage />
            </RoleRoute>
          }
        />

        {/* Knowledge Base */}
        <Route path="knowledge" element={<KnowledgeBasePage />} />

        {/* Analytics & Reporting */}
        <Route
          path="analytics"
          element={
            <RoleRoute allowedRoles={['TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN']}>
              <AnalyticsPage />
            </RoleRoute>
          }
        />

        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />

        {/* Billing & Plans */}
        <Route
          path="billing"
          element={
            <RoleRoute allowedRoles={['ORG_ADMIN', 'SUPER_ADMIN']}>
              <BillingPage />
            </RoleRoute>
          }
        />
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
