import React, { useEffect, useState } from 'react';
import api from '../../Services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';
import {
  Wallet as WalletIcon,
  PlusCircle,
  MinusCircle,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

function Wallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ADD'); // 'ADD' | 'WITHDRAW'
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const presetAmounts = [100, 500, 1000, 2000, 5000];

  const loadWallet = async () => {
    try {
      // Backend: GET /wallets/my-wallet returns WalletRespDto
      const resp = await api.get('/wallets/my-wallet');
      console.log('Wallet loaded:', resp.data);
      setWallet(resp.data);
    } catch (error) {
      console.error('Failed to load wallet:', error);
      const msg =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || 'Unable to load wallet details';
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setMessage(null);

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount greater than zero' });
      return;
    }

    setActionLoading(true);

    try {
      // Backend: POST /wallets/add-money?amount={amount}
      const resp = await api.post(`/wallets/add-money?amount=${numAmount}`);
      console.log('Add money success:', resp.data);
      setWallet(resp.data);
      setAmount('');
      setMessage({
        type: 'success',
        text: `₹${numAmount.toLocaleString('en-IN')} added to your wallet successfully!`,
      });
    } catch (error) {
      console.error('Add money failed:', error);
      const msg =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || 'Failed to add money to wallet';
      setMessage({ type: 'error', text: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage(null);

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount greater than zero' });
      return;
    }

    if (numAmount > Number(wallet?.balance || 0)) {
      setMessage({
        type: 'error',
        text: `Insufficient wallet balance. Available: ₹${Number(wallet?.balance || 0).toLocaleString('en-IN')}`,
      });
      return;
    }

    setActionLoading(true);

    try {
      // Backend: POST /wallets/withdraw?amount={amount}
      const resp = await api.post(`/wallets/withdraw?amount=${numAmount}`);
      console.log('Withdraw success:', resp.data);
      setWallet(resp.data);
      setAmount('');
      setMessage({
        type: 'success',
        text: `₹${numAmount.toLocaleString('en-IN')} withdrawn from your wallet successfully!`,
      });
    } catch (error) {
      console.error('Withdraw failed:', error);
      const msg =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || 'Failed to withdraw money';
      setMessage({ type: 'error', text: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const formatWalletNumber = (num) => {
    if (!num) return 'PAY•••• •••• ••••';
    // Format nicely with spaces
    return num.replace(/(.{4})/g, '$1 ').trim();
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-semibold text-slate-600">Loading wallet details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Digital Wallet</h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5">
          Manage your virtual wallet funds, deposits, and withdrawal transfers
        </p>
      </div>

      {/* Grid: Virtual Card (Left) & Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Virtual Debit Card Preview */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative w-full aspect-[1.586/1] rounded-3xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-indigo-800 text-white p-6 shadow-2xl shadow-indigo-950/20 flex flex-col justify-between border border-white/10 overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-10 bottom-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Top row */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/10">
                  <WalletIcon className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">PaySphere</span>
              </div>
              <StatusBadge status={wallet?.walletStatus || 'ACTIVE'} size="sm" />
            </div>

            {/* Chip & contactless */}
            <div className="relative z-10 my-auto flex items-center justify-between">
              <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border border-amber-300/40 shadow-xs flex items-center justify-center">
                <div className="w-8 h-5 border border-amber-600/40 rounded-xs grid grid-cols-2" />
              </div>
              <Sparkles className="w-5 h-5 text-indigo-300/80" />
            </div>

            {/* Card details */}
            <div className="relative z-10 space-y-2">
              <div className="font-mono text-sm sm:text-base tracking-widest text-indigo-100/90 font-semibold select-all">
                {formatWalletNumber(wallet?.walletNumber)}
              </div>
              <div className="flex items-end justify-between pt-1">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-indigo-300/80 block">Cardholder</span>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-indigo-300/80 block">Balance</span>
                  <span className="text-base sm:text-xl font-extrabold text-white">
                    ₹{Number(wallet?.balance || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-sm space-y-2.5">
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Wallet ID</span>
              <span className="font-mono font-bold text-slate-900">#{wallet?.walletId}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Status</span>
              <StatusBadge status={wallet?.walletStatus || 'ACTIVE'} size="sm" />
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Currency</span>
              <span className="font-semibold text-slate-900">INR (₹)</span>
            </div>
          </div>
        </div>

        {/* Action Panel: Add Funds / Withdraw */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('ADD');
                setMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'ADD'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Money</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('WITHDRAW');
                setMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'WITHDRAW'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MinusCircle className="w-4 h-4" />
              <span>Withdraw Money</span>
            </button>
          </div>

          {/* Notification Banner */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-start gap-2.5 text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={activeTab === 'ADD' ? handleAddMoney : handleWithdraw} className="space-y-5">
            <div>
              <label htmlFor="amount-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                {activeTab === 'ADD' ? 'Deposit Amount' : 'Withdrawal Amount'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  id="amount-input"
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Quick Preset Chips */}
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Quick Select
              </span>
              <div className="flex flex-wrap gap-2">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                  >
                    +₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={actionLoading || !amount || Number(amount) <= 0}
              className={`w-full py-3 px-4 rounded-xl text-sm sm:text-base font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                activeTab === 'ADD'
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                  : 'bg-slate-900 hover:bg-slate-800 shadow-slate-300'
              }`}
            >
              {actionLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : activeTab === 'ADD' ? (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Confirm Deposit</span>
                </>
              ) : (
                <>
                  <MinusCircle className="w-4 h-4" />
                  <span>Confirm Withdrawal</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Wallet;