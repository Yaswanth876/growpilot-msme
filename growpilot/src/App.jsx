import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import ToastContainer from './components/ui/ToastContainer';
import { useToast } from './utils/helpers';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import InventoryPage from './pages/InventoryPage';
import MarketingPage from './pages/MarketingPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';

// Wrapper for app pages (with sidebar)
function AppShell({ children, onToast }) {
  return (
    <div className="app-layout">
      <Sidebar onToast={onToast} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* App Shell pages */}
        <Route
          path="/dashboard"
          element={
            <AppShell onToast={addToast}>
              <DashboardPage />
            </AppShell>
          }
        />
        <Route
          path="/chatbot"
          element={
            <AppShell onToast={addToast}>
              <ChatbotPage />
            </AppShell>
          }
        />
        <Route
          path="/inventory"
          element={
            <AppShell onToast={addToast}>
              <InventoryPage onToast={addToast} />
            </AppShell>
          }
        />
        <Route
          path="/marketing"
          element={
            <AppShell onToast={addToast}>
              <MarketingPage onToast={addToast} />
            </AppShell>
          }
        />
        <Route
          path="/expenses"
          element={
            <AppShell onToast={addToast}>
              <ExpensesPage />
            </AppShell>
          }
        />
        <Route
          path="/reports"
          element={
            <AppShell onToast={addToast}>
              <ReportsPage />
            </AppShell>
          }
        />

        {/* Catch-all → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast system */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </BrowserRouter>
  );
}
