import { Fragment, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import ToastContainer from './components/ui/ToastContainer';
import { useToast } from './utils/helpers';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BusinessSelectionPage from './pages/BusinessSelectionPage';
import { bakeryProfile, groceryProfile } from './data/businessProfiles';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import InventoryPage from './pages/InventoryPage';
import MarketingPage from './pages/MarketingPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import SuppliersPage from './pages/SuppliersPage';

const USER_KEY = 'growpilot.demo.user';
const BUSINESS_KEY = 'growpilot.demo.business';

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
  chatbot: ChatbotPage,
  inventory: InventoryPage,
  marketing: MarketingPage,
  expenses: ExpensesPage,
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

  const handleLogin = (user) => {
    const nextUser = {
      email: user.email.trim(),
      name: user.name?.trim() || user.email.split('@')[0],
      loginAt: new Date().toISOString(),
    };
    saveStoredState(USER_KEY, nextUser);
    setSession(prev => ({ ...prev, user: nextUser }));
    addToast('Dummy login successful', 'success');
  };

  const handleLogout = () => {
    saveStoredState(USER_KEY, null);
    saveStoredState(BUSINESS_KEY, null);
    setSession({ user: null, business: null });
    addToast('Signed out of demo workspace', 'info');
  };

  const handleSelectBusiness = (business) => {
    saveStoredState(BUSINESS_KEY, business);
    setSession(prev => ({ ...prev, business }));
    addToast(`Opened ${business.label}`, 'success');
  };

  const getSelectedBusinessPath = (section = 'dashboard') => {
    const slug = session.business?.slug;
    return slug ? `/${slug}/${section}` : '/businesses';
  };

  const renderBusinessRoute = (profile, section) => {
    const Page = sectionRoutes[section];
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
              <Navigate to="/businesses" replace />
            ) : (
              <LoginPage onLogin={handleLogin} onToast={addToast} />
            )
          }
        />
        <Route
          path="/businesses"
          element={
            session.user ? (
              <BusinessSelectionPage
                user={session.user}
                selectedBusiness={session.business}
                onSelectBusiness={handleSelectBusiness}
                onLogout={handleLogout}
                onToast={addToast}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/bakery"
          element={<Navigate to="/bakery/dashboard" replace />}
        />
        <Route
          path="/grocery"
          element={<Navigate to="/grocery/dashboard" replace />}
        />

        {businessProfiles.map((profile) => (
          <Fragment key={profile.slug}>
            <Route
              path={`/${profile.slug}/dashboard`}
              element={session.user ? renderBusinessRoute(profile, 'dashboard') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/chatbot`}
              element={session.user ? renderBusinessRoute(profile, 'chatbot') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/inventory`}
              element={session.user ? renderBusinessRoute(profile, 'inventory') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/marketing`}
              element={session.user ? renderBusinessRoute(profile, 'marketing') : <Navigate to="/login" replace />}
            />
            <Route
              path={`/${profile.slug}/expenses`}
              element={session.user ? renderBusinessRoute(profile, 'expenses') : <Navigate to="/login" replace />}
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
        <Route path="/chatbot" element={<Navigate to={getSelectedBusinessPath('chatbot')} replace />} />
        <Route path="/inventory" element={<Navigate to={getSelectedBusinessPath('inventory')} replace />} />
        <Route path="/marketing" element={<Navigate to={getSelectedBusinessPath('marketing')} replace />} />
        <Route path="/expenses" element={<Navigate to={getSelectedBusinessPath('expenses')} replace />} />
        <Route path="/reports" element={<Navigate to={getSelectedBusinessPath('reports')} replace />} />
        <Route path="/suppliers" element={<Navigate to={getSelectedBusinessPath('suppliers')} replace />} />

        {/* Catch-all → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast system */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </BrowserRouter>
  );
}
