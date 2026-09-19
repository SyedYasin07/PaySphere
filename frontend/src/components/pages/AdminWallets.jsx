import React, { useEffect, useState } from 'react';
import api from '../../Services/api';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import {
  WalletCards,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  IndianRupee,
  User,
  CreditCard,
} from 'lucide-react';

const AdminWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Confirmation modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    wallet: null,
    action: 'block', // 'block' | 'unblock'
    processing: false,
  });

  const loadWallets = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await api.get('/admin/wallets');
      setWallets(resp.data || []);
    } catch (err) {
      console.error('Failed to load admin wallets:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Failed to load system wallets.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallets();
  }, []);

  const openActionModal = (wallet, action) => {
    setModalState({
      isOpen: true,
      wallet,
      action,
      processing: false,
    });
  };

  const closeActionModal = () => {
    if (modalState.processing) return;
    setModalState({
      isOpen: false,
      wallet: null,
      action: 'block',
      processing: false,
    });
  };

  const handleConfirmAction = async () => {
    if (!modalState.wallet) return;

    const { wallet, action } = modalState;
    setModalState((prev) => ({ ...prev, processing: true }));
    setError('');
    try {
      const endpoint =
        action === 'block'
          ? `/admin/wallets/${wallet.walletId}/block`
          : `/admin/wallets/${wallet.walletId}/unblock`;

      const resp = await api.put(endpoint);

      // Update local state with updated wallet
      setWallets((prev) =>
        prev.map((w) =>
          w.walletId === wallet.walletId
            ? { ...w, walletStatus: resp.data.walletStatus || (action === 'block' ? 'BLOCKED' : 'ACTIVE') }
            : w
        )
      );

      setSuccessMsg(
        `Wallet #${wallet.walletNumber} for ${wallet.userName || 'user'} has been ${
          action === 'block' ? 'blocked' : 'unblocked'
        } successfully.`
      );
      closeActionModal();
    } catch (err) {
      console.error(`Failed to ${action} wallet:`, err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || `Failed to ${action} wallet.`;
      setError(msg);
      setModalState((prev) => ({ ...prev, processing: false }));
    }
  };

  // Filtered wallets
  const filteredWallets = wallets.filter((wallet) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (wallet.walletNumber && wallet.walletNumber.toLowerCase().includes(query)) ||
      (wallet.userName && wallet.userName.toLowerCase().includes(query)) ||
      (wallet.email && wallet.email.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (wallet.walletStatus && wallet.walletStatus.toUpperCase() === statusFilter);

    return matchesSearch && matchesStatus;
  });

  // KPI calculations
  const totalWalletsCount = wallets.length;
  const activeWalletsCount = wallets.filter((w) => w.walletStatus === 'ACTIVE').length;
  const blockedWalletsCount = wallets.filter((w) => w.walletStatus === 'BLOCKED').length;
  const totalCustodyBalance = wallets.reduce(
    (sum, w) => sum + (parseFloat(w.balance) || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
            <WalletCards className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
            <span>Wallet Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor digital wallet balances, owner accounts, and enforce freeze/unfreeze actions.
          </p>
        </div>

        <button
          type="button"
          onClick={loadWallets}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Total Wallets
            </span>
            <WalletCards className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalWalletsCount}</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Active Wallets
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{activeWalletsCount}</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Blocked Wallets
            </span>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{blockedWalletsCount}</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Total Custody
            </span>
            <IndianRupee className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ₹{totalCustodyBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-700 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{successMsg}</div>
        </div>
      )}

      {/* Controls: Search & Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3.5 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search wallet number, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs sm:text-sm font-semibold">
            {['ALL', 'ACTIVE', 'BLOCKED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wallets Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading system wallets...</p>
          </div>
        ) : filteredWallets.length === 0 ? (
          <div className="py-16 text-center px-4">
            <WalletCards className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-800">No wallets match your criteria</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'ALL'
                ? 'Try adjusting your search terms or status filters.'
                : 'No registered wallets found in the system.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-4 px-5">Wallet ID & Number</th>
                    <th className="py-4 px-5">Owner / User</th>
                    <th className="py-4 px-5">Balance</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Created Date</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWallets.map((wallet) => {
                    const isBlocked = wallet.walletStatus === 'BLOCKED';
                    return (
                      <tr key={wallet.walletId} className="hover:bg-slate-50/75 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-mono font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-indigo-500 shrink-0" />
                            {wallet.walletNumber || `W-${wallet.walletId}`}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            ID: #{wallet.walletId}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-sm">
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                            {wallet.userName || 'Unnamed User'}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{wallet.email || '—'}</div>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-900 text-base">
                            ₹{parseFloat(wallet.balance || 0).toFixed(2)}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          <StatusBadge status={wallet.walletStatus} />
                        </td>

                        <td className="py-4 px-5 text-slate-500 text-xs sm:text-sm">
                          {wallet.createdAt
                            ? new Date(wallet.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>

                        <td className="py-4 px-5 text-right">
                          {isBlocked ? (
                            <button
                              type="button"
                              onClick={() => openActionModal(wallet, 'unblock')}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>Unblock</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openActionModal(wallet, 'block')}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                            >
                              <ShieldAlert className="w-4 h-4" />
                              <span>Block</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredWallets.map((wallet) => {
                const isBlocked = wallet.walletStatus === 'BLOCKED';
                return (
                  <div key={wallet.walletId} className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono font-bold text-slate-900 text-sm flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-indigo-500" />
                          {wallet.walletNumber || `W-${wallet.walletId}`}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                          {wallet.userName} ({wallet.email})
                        </div>
                      </div>
                      <StatusBadge status={wallet.walletStatus} />
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-slate-400 block text-xs">Balance</span>
                        <span className="text-base font-bold text-slate-900">
                          ₹{parseFloat(wallet.balance || 0).toFixed(2)}
                        </span>
                      </div>

                      <div>
                        {isBlocked ? (
                          <button
                            type="button"
                            onClick={() => openActionModal(wallet, 'unblock')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Unblock</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openActionModal(wallet, 'block')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            <span>Block</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeActionModal}
        title={modalState.action === 'block' ? 'Confirm Wallet Freeze' : 'Confirm Wallet Reactivation'}
      >
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              modalState.action === 'block'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {modalState.action === 'block' ? (
              <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            )}
            <div className="text-sm leading-relaxed">
              {modalState.action === 'block' ? (
                <>
                  You are about to <strong className="font-semibold">freeze</strong> wallet{' '}
                  <span className="font-mono font-bold">
                    {modalState.wallet?.walletNumber || `#${modalState.wallet?.walletId}`}
                  </span>{' '}
                  owned by <strong className="font-semibold">{modalState.wallet?.userName}</strong>.
                  While blocked, the user will not be able to add money, withdraw, or transfer funds.
                </>
              ) : (
                <>
                  You are about to <strong className="font-semibold">unfreeze</strong> wallet{' '}
                  <span className="font-mono font-bold">
                    {modalState.wallet?.walletNumber || `#${modalState.wallet?.walletId}`}
                  </span>{' '}
                  owned by <strong className="font-semibold">{modalState.wallet?.userName}</strong>.
                  The user will regain full access to deposit, withdraw, and make transfers.
                </>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Wallet Number:</span>
              <span className="font-mono font-semibold text-slate-800">
                {modalState.wallet?.walletNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Owner Name:</span>
              <span className="font-semibold text-slate-800">{modalState.wallet?.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Balance:</span>
              <span className="font-bold text-slate-900">
                ₹{parseFloat(modalState.wallet?.balance || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeActionModal}
              disabled={modalState.processing}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmAction}
              disabled={modalState.processing}
              className={`px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer ${
                modalState.action === 'block'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } disabled:opacity-50`}
            >
              {modalState.processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {modalState.action === 'block' ? 'Yes, Freeze Wallet' : 'Yes, Reactivate Wallet'}
                </span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminWallets;
