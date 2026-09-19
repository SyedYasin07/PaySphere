import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../Services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  WalletCards,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend: GET /admin/dashboard returns AdminDashboardRespDTO
      const resp = await api.get('/admin/dashboard');
      console.log('Admin dashboard data:', resp.data);
      setDashboard(resp.data);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Failed to load platform dashboard metrics.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Loading system metrics...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Dashboard Unavailable</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <button
          type="button"
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-purple-200 text-xs sm:text-sm font-semibold backdrop-blur-xs mb-3 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>Platform Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              PaySphere Admin Center
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Real-time platform overview, user management, digital wallet controls, and ledger audit
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/15 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Users */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500">Total Users</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {dashboard.totalUsers}
            </div>
            <div className="flex items-center gap-3 mt-2.5 text-xs sm:text-sm font-medium">
              <span className="text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {dashboard.activeUsers} Active
              </span>
              <span className="text-rose-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {dashboard.blockedUsers} Blocked
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Wallets (Corrected DTO field: totalWallet) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500">Total Wallets</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <WalletCards className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {dashboard.totalWallet}
            </div>
            <div className="flex items-center gap-3 mt-2.5 text-xs sm:text-sm font-medium">
              <span className="text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {dashboard.activeWallet} Active
              </span>
              <span className="text-rose-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {dashboard.blockedWallet} Blocked
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Transactions */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500">Transactions</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ReceiptText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {dashboard.totalTransactions}
            </div>
            <div className="flex items-center gap-3 mt-2.5 text-xs sm:text-sm font-medium">
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {dashboard.successfulTransactions} Success
              </span>
              <span className="text-rose-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {dashboard.failedTransactions} Failed
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Total Volume (Corrected DTO field: totalTransferredAmount) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500">Transferred Volume</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{Number(dashboard.totalTransferredAmount || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-slate-500 block mt-1.5 font-medium">
              Settled payment volume
            </span>
          </div>
        </div>
      </div>

      {/* Admin Modules Quick Launch */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <Link
          to="/admin/users"
          className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                User Management
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Search, block, unblock & delete</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/wallets"
          className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <WalletCards className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Wallet Controls
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Audit balances & freeze wallets</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/transactions"
          className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ReceiptText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Transaction Ledger
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Audit reference logs & filters</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;