import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../Services/api';
import StatusBadge from '../common/StatusBadge';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  SendHorizontal,
  History,
  PlusCircle,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        // Run balance and transactions queries in parallel to avoid duplicate cascades
        const [balResp, txnResp] = await Promise.all([
          api.get('/wallets/balance').catch(() => ({ data: 0 })),
          api.get('/transactions/history').catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setBalance(typeof balResp.data === 'number' ? balResp.data : 0);
          setRecentTransactions(Array.isArray(txnResp.data) ? txnResp.data.slice(0, 5) : []);
        }
      } catch (err) {
        console.error('Failed to load user dashboard data:', err);
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Personal Wallet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.firstName} {user?.lastName}!
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base mt-1.5 max-w-xl">
              Manage your PaySphere balance, transfer money instantly via QR codes, and track transactions in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/wallet"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-950/50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Funds</span>
            </Link>
            <Link
              to="/transfer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-md"
            >
              <SendHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Transfer</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Available Balance */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Available Balance</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {loadingStats ? '...' : `₹${Number(balance).toLocaleString('en-IN')}`}
            </div>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Instant Wallet Access</span>
            </span>
          </div>
        </div>

        {/* Metric 2: Account Status */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Account Status</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div>
              <StatusBadge status={user?.status || 'ACTIVE'} size="md" />
            </div>
            <span className="text-xs text-slate-500 block mt-1.5 font-medium">
              {user?.emailVerified ? 'Email Verified' : 'Email Unverified'}
            </span>
          </div>
        </div>

        {/* Metric 3: Quick Action Send */}
        <Link
          to="/transfer"
          className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
              Send Money
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
              <SendHorizontal className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-base font-semibold text-slate-900">Transfer by QR / ID</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Metric 4: Quick Action Receive */}
        <Link
          to="/qr"
          className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
              Receive Money
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-base font-semibold text-slate-900">My Payment QR</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => navigate('/wallet')}
          className="flex items-center justify-center gap-2 p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-indigo-600" />
          <span>Wallet Card</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/transfer')}
          className="flex items-center justify-center gap-2 p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <SendHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Send Funds</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/qr')}
          className="flex items-center justify-center gap-2 p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-indigo-600" />
          <span>Show My QR</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="flex items-center justify-center gap-2 p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <History className="w-4 h-4 text-indigo-600" />
          <span>All Records</span>
        </button>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
            <p className="text-sm text-slate-500 mt-0.5">Your latest money transfers and receipts</p>
          </div>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {loadingStats ? (
            <div className="p-8 text-center text-sm text-slate-500">Loading recent activity...</div>
          ) : recentTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No transactions recorded yet</p>
              <p className="text-xs text-slate-400 mt-1">Transfer money to start seeing transaction history</p>
            </div>
          ) : (
            recentTransactions.map((txn) => {
              const isSent = txn.transactionDirection === 'SENT';
              return (
                <div
                  key={txn.transactionId || txn.referenceNumber}
                  className="p-4 sm:p-5 sm:px-6 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSent ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'
                      }`}
                    >
                      {isSent ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {isSent ? `To ${txn.receiverName || 'Recipient'}` : `From ${txn.senderName || 'Sender'}`}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : txn.referenceNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`text-base font-bold ${
                          isSent ? 'text-slate-900' : 'text-emerald-600'
                        }`}
                      >
                        {isSent ? '-' : '+'}₹{Number(txn.amount).toLocaleString('en-IN')}
                      </div>
                      <StatusBadge status={txn.transactionStatus} size="sm" />
                    </div>

                    <Link
                      to={`/transactions/${txn.referenceNumber}`}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View transaction receipt"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;