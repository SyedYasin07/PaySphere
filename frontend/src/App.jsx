import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import VerifyEmail from './components/pages/VerifyEmail';
import UserDashboard from './components/pages/UserDashboard';
import Wallet from './components/pages/Wallet';
import Transfer from './components/pages/Transfer';
import Transactions from './components/pages/Transactions';
import Profile from './components/pages/Profile';
import UserTransactionDetails from './components/pages/UserTransactionDetails';
import QrView from './components/pages/QrView';

import AdminDashboard from './components/pages/AdminDashboard';
import AdminUsers from './components/pages/AdminUsers';
import AdminUserDetails from './components/pages/AdminUserDetails';
import AdminWallets from './components/pages/AdminWallets';
import AdminTransactions from './components/pages/AdminTransactions';
import AdminTransactionDetails from './components/pages/AdminTransactionDetails';
import DashboardLayout from './components/layout/DashboardLayout';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />

          {/* User Protected Routes (USER only) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="USER">
                <DashboardLayout>
                  <UserDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute requiredRole="USER">
                <DashboardLayout>
                  <Wallet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfer"
            element={
              <ProtectedRoute requiredRole="USER">
                <DashboardLayout>
                  <Transfer />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr"
            element={
              <ProtectedRoute requiredRole="USER">
                <DashboardLayout>
                  <QrView />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr/my-qr"
            element={
              <ProtectedRoute requiredRole="USER">
                <DashboardLayout>
                  <QrView />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr/scan"
            element={
              <ProtectedRoute requiredRole="USER">
                <DashboardLayout>
                  <Transfer />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute requiredRole="USER">
                <DashboardLayout>
                  <Transactions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/:referenceNumber"
            element={
              <ProtectedRoute requiredRole="USER">
                <DashboardLayout>
                  <UserTransactionDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Profile Route (Both USER and ADMIN) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes (ADMIN only) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <AdminUsers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <AdminUserDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/wallets"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <AdminWallets />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <AdminTransactions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions/:referenceNumber"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <AdminTransactionDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App