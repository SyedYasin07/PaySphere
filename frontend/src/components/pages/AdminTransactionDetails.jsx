import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import StatusBadge from '../common/StatusBadge';
import {
  Receipt,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  User,
  Hash,
  Calendar,
  IndianRupee,
} from 'lucide-react';

const AdminTransactionDetails = () => {
  const { referenceNumber } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const loadTransaction = async () => {
    setLoading(true);
    setError('');
    try {
      // Backend: GET /admin/transactions/{referenceNumber} returns AdminTransactionRespDto
      const resp = await api.get(`/admin/transactions/${referenceNumber}`);
      console.log('Admin transaction details:', resp.data);
      setTransaction(resp.data);
    } catch (err) {
      console.error('Failed to load transaction details:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Unable to retrieve audit transaction details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (referenceNumber) {
      loadTransaction();
    }
  }, [referenceNumber]);

  const handleCopyReference = () => {
    if (transaction?.referenceNumber) {
      navigator.clipboard.writeText(transaction.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Retrieving audit transaction record...</p>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Transaction Not Found</h2>
        <p className="text-sm text-slate-500">
          {error || `No ledger transaction exists with reference "${referenceNumber}".`}
        </p>
        <button
          type="button"
          onClick={() => navigate('/admin/transactions')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ledger</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/transactions')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ledger</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadTransaction}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Audit Certificate</span>
          </button>
        </div>
      </div>

      {/* Official Audit Record Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="printable-audit">
        {/* Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-indigo-200 text-xs sm:text-sm font-semibold border border-white/15 backdrop-blur-xs mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Admin Audit Certificate</span>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
            ₹{parseFloat(transaction.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>

          <div className="mt-3.5 flex items-center justify-center gap-2.5">
            <StatusBadge status={transaction.transactionStatus} size="md" />
            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/15 text-xs sm:text-sm font-semibold uppercase">
              {transaction.transactionType || 'TRANSFER'}
            </span>
          </div>
        </div>

        {/* Breakdown of all AdminTransactionRespDto fields */}
        <div className="p-6 sm:p-8 space-y-4 text-sm divide-y divide-slate-100">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500 font-medium">Reference Number</span>
            <div className="flex items-center gap-2 font-mono font-bold text-slate-900 select-all text-sm sm:text-base">
              <span>{transaction.referenceNumber}</span>
              <button
                type="button"
                onClick={handleCopyReference}
                className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Copy reference"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Transaction ID</span>
            <span className="font-mono text-slate-800 font-semibold">#{transaction.transactionId}</span>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Sender</span>
            <div className="text-right">
              <div className="font-semibold text-slate-900 text-sm sm:text-base">{transaction.senderName || 'System'}</div>
              <div className="text-xs text-slate-400 font-mono">User ID: #{transaction.senderId}</div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Receiver</span>
            <div className="text-right">
              <div className="font-semibold text-slate-900 text-sm sm:text-base">{transaction.receiverName || 'System'}</div>
              <div className="text-xs text-slate-400 font-mono">User ID: #{transaction.receiverId}</div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Transaction Type</span>
            <span className="font-semibold text-slate-900 uppercase font-mono">
              {transaction.transactionType || 'TRANSFER'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Ledger Status</span>
            <StatusBadge status={transaction.transactionStatus} size="sm" />
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Audit Remarks</span>
            <span className="text-slate-800 font-medium italic">
              {transaction.remarks || 'No remarks supplied'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Execution Timestamp</span>
            <span className="text-slate-700">
              {transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'full',
                    timeStyle: 'medium',
                  })
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Security Watermark Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PaySphere Core Ledger System — Authenticated Record</span>
          </div>
          <span className="font-mono font-medium">Ref: {transaction.referenceNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionDetails;