import { Fragment, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import ToastContainer from './components/ui/ToastContainer';
import GlobalAIAssistant from './components/ui/GlobalAIAssistant';
import { useToast } from './utils/helpers';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FirstLoginAssessmentPage from './pages/FirstLoginAssessmentPage';
import BusinessSelectionPage from './pages/BusinessSelectionPage';
import { bakeryProfile, groceryProfile } from './data/businessProfiles';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import OperationsPage from './pages/OperationsPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import SuppliersPage from './pages/SuppliersPage';
import MarketingPage from './pages/MarketingPage';
import SeasonalTrendsPage from './pages/SeasonalTrendsPage';

const USER_KEY = 'growpilot.demo.user';
const BUSINESS_KEY = 'growpilot.demo.business';
const ONBOARDING_KEY = 'growpilot.demo.onboarding';
const ASSESSMENT_KEY = 'growpilot.demo.assessment';

function readStoredState(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function saveStoredState(key, value) {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value));
    return;
  }
  localStorage.removeItem(key);
}

const sectionRoutes = {
  dashboard: DashboardPage,
  operations: OperationsPage,
  expenses: ExpensesPage,
  marketing: MarketingPage,
  seasonalTrends: SeasonalTrendsPage,
  reports: ReportsPage,
  suppliers: SuppliersPage,
};

const businessProfiles = [bakeryProfile, groceryProfile];

function AppShell({ children, onToast, business }) {
  return (
    <div className="app-layout">
      <Sidebar onToast={onToast} business={business} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
        <GlobalAIAssistant business={business} />
      </div>
    </div>
  );
}

export default function App() {
  const { toasts, addToast, removeToast } = useToast();
  const [session, setSession] = useState(() => ({
    user: readStoredState(USER_KEY),
    business: readStoredState(BUSINESS_KEY),
  }));
  const [onboardingState, setOnboardingState] = useState(() => readStoredState(ONBOARDING_KEY) || {});
  const [assessmentState, setAssessmentState] = useState(() => readStoredState(ASSESSMENT_KEY) || {});
  const hasProfileAssessment = Boolean(session.user?.email && assessmentState[session.user.email]);
  const assessmentPreviewUser = session.user || { email: 'preview@growpilot.demo', name: 'Preview User' };

  const handleLogin = (user) => {
    const nextUser = {
      email: user.email.trim(),
      name: user.name?.trim() || user.email.split('@')[0],
      loginAt: new Date().toISOString(),
    };
    saveStoredState(USER_KEY, nextUser);
    setSession(prev => ({ ...prev, user: nextUser }));
    addToast('Dummy login successful', 'success');

    return assessmentState[nextUser.email] ? '/businesses' : '/first-login-assessment';
  };

  const handleLogout = () => {
    saveStoredState(USER_KEY, null);
    saveStoredState(BUSINESS_KEY, null);
    saveStoredState(ONBOARDING_KEY, null);
    saveStoredState(ASSESSMENT_KEY, null);
    setSession({ user: null, business: null });
    setOnboardingState({});
    setAssessmentState({});
    addToast('Signed out of demo workspace', 'info');
  };

  const handleSelectBusiness = (business) => {
    saveStoredState(BUSINESS_KEY, business);
    setSession(prev => ({ ...prev, business }));
    addToast(`Opened ${business.label}`, 'success');
  };

  const handleCompleteOnboarding = (slug, payload) => {
    const nextState = {
      ...onboardingState,
      [slug]: {
        completedAt: new Date().toISOString(),
        ...payload,
      },
    };

    setOnboardingState(nextState);
    saveStoredState(ONBOARDING_KEY, nextState);
    addToast('Onboarding completed. Welcome to your dashboard.', 'success');
  };

  const handleCompleteAssessment = (email, payload) => {
    const nextState = {
      ...assessmentState,
      [email]: {
        completedAt: new Date().toISOString(),
        ...payload,
      },
    };

    setAssessmentState(nextState);
    saveStoredState(ASSESSMENT_KEY, nextState);
    addToast('Business foundation assessment completed.', 'success');
  };

  const getSelectedBusinessPath = (section = 'dashboard') => {
    if (!hasProfileAssessment) {
      return '/first-login-assessment';
    }

    const slug = session.business?.slug;
    return slug ? `/${slug}/${section}` : '/businesses';
  };

  const renderBusinessRoute = (profile, section) => {
    const Page = sectionRoutes[section];

    if (!hasProfileAssessment) {
      return <Navigate to="/first-login-assessment" replace />;
    }

    if (!onboardingState?.[profile.slug]) {
      return <Navigate to={`/${profile.slug}/onboarding`} replace />;
    }

    return (
      <AppShell onToast={addToast} business={profile}>
        <Page business={profile} onToast={addToast} />
      </AppShell>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            session.user ? (
              <Navigate to={hasProfileAssessment ? '/businesses' : '/first-login-assessment'} replace />
            ) : (
              <LoginPage onLogin={handleLogin} onToast={addToast} />
            )
          }
        />
        <Route
          path="/first-login-assessment"
          element={
            session.user ? (
              <FirstLoginAssessmentPage
                user={assessmentPreviewUser}
                onComplete={handleCompleteAssessment}
                onToast={addToast}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/businesses"
          element={
            session.user ? (
              hasProfileAssessment ? (
                <BusinessSelectionPage
                  user={session.user}
                  selectedBusiness={session.business}
                  onSelectBusiness={handleSelectBusiness}
                  onLogout={handleLogout}
                  onToast={addToast}
                />
              ) : (
                <Navigate to="/first-login-assessment" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/bakery"
          element={<Navigate to="/bakery/onboarding" replace />}
        />
        <Route
          path="/grocery"
          element={<Navigate to="/grocery/onboarding" replace />}
        />

        {businessProfiles.map((profile) => (
          <Fragment key={profile.slug}>
            <Route
              path={`/${profile.slug}/onboarding`}
              element={
                session.user ? (
                  onboardingState?.[profile.slug] ? (
                    <Navigate to={`/${profile.slug}/dashboard`} replace />
                  ) : (
                    <OnboardingPage
                      business={profile}
                      onComplete={handleCompleteOnboarding}
                      onToast={addToast}
                    />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path={`/${profile.slug}/dashboard`}
              element={session.user ? renderBusinessRoute(profile, 'dashboard') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/operations`}
              element={session.user ? renderBusinessRoute(profile, 'operations') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/expenses`}
              element={session.user ? renderBusinessRoute(profile, 'expenses') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/seasonal-trends`}
              element={session.user ? renderBusinessRoute(profile, 'seasonalTrends') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/marketing`}
              element={session.user ? renderBusinessRoute(profile, 'marketing') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/reports`}
              element={session.user ? renderBusinessRoute(profile, 'reports') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/suppliers`}
              element={session.user ? renderBusinessRoute(profile, 'suppliers') : <Navigate to="/login" replace />}
            />
          </Fragment>
        ))}

        {/* Backward-compatible redirect into the new flow */}
        <Route path="/dashboard" element={<Navigate to={getSelectedBusinessPath('dashboard')} replace />} />
        <Route path="/operations" element={<Navigate to={getSelectedBusinessPath('operations')} replace />} />
        <Route path="/expenses" element={<Navigate to={getSelectedBusinessPath('expenses')} replace />} />
        <Route path="/seasonal-trends" element={<Navigate to={getSelectedBusinessPath('seasonal-trends')} replace />} />
        <Route path="/marketing" element={<Navigate to={getSelectedBusinessPath('marketing')} replace />} />
        <Route path="/reports" element={<Navigate to={getSelectedBusinessPath('reports')} replace />} />
        <Route path="/suppliers" element={<Navigate to={getSelectedBusinessPath('suppliers')} replace />} />

        {/* Legacy routes retained for compatibility */}
        <Route path="/chatbot" element={<Navigate to={getSelectedBusinessPath('dashboard')} replace />} />
        <Route path="/inventory" element={<Navigate to={getSelectedBusinessPath('operations')} replace />} />
        <Route path="/billing" element={<Navigate to={getSelectedBusinessPath('operations')} replace />} />

        {/* Catch-all → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast system */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </BrowserRouter>
  );
}
