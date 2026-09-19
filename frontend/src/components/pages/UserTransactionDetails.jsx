import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../Services/api';
import StatusBadge from '../common/StatusBadge';
import {
  Receipt,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

const UserTransactionDetails = () => {
  const { referenceNumber } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTransaction = async () => {
      try {
        // Backend: GET /transactions/reference/{referenceNumber}
        // Securely filtered by current user in TransactionRepo
        const resp = await api.get(`/transactions/reference/${referenceNumber}`);
        console.log('Transaction details loaded:', resp.data);
        if (isMounted) {
          setTransaction(resp.data);
        }
      } catch (err) {
        console.error('Failed to load transaction details:', err);
        const msg =
          typeof err.response?.data === 'string'
            ? err.response.data
            : err.response?.data?.message || 'Transaction not found or you do not have permission to view it.';
        if (isMounted) {
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (referenceNumber) {
      loadTransaction();
    }

    return () => {
      isMounted = false;
    };
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
        <p className="mt-4 text-sm font-semibold text-slate-600">Retrieving official transaction record...</p>
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
          {error || 'The requested transaction reference does not exist or does not involve your wallet.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Transactions</span>
        </button>
      </div>
    );
  }

  const isSent = transaction.transactionDirection === 'SENT';

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Transactions</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Official Receipt Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="printable-receipt">
        {/* Receipt Header Banner */}
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100 text-center relative">
          <div className="inline-flex items-center gap-2 text-indigo-600 mb-2">
            <Receipt className="w-5 h-5" />
            <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">PaySphere E-Receipt</span>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
            {isSent ? '-' : '+'}₹{Number(transaction.amount).toLocaleString('en-IN')}
          </div>

          <div className="mt-3.5 flex items-center justify-center gap-2.5">
            <StatusBadge status={transaction.transactionStatus} size="md" />
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${
                isSent
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}
            >
              {isSent ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
              <span>{isSent ? 'Money Sent' : 'Money Received'}</span>
            </span>
          </div>
        </div>

        {/* Receipt Details Breakdown */}
        <div className="p-6 sm:p-8 space-y-4 text-sm divide-y divide-slate-100">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500 font-medium">Reference Number</span>
            <div className="flex items-center gap-2 font-mono font-bold text-slate-900 select-all">
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
            <span className="font-mono text-slate-800">#{transaction.transactionId}</span>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Sender</span>
            <span className="font-semibold text-slate-900">{transaction.senderName || 'Self'}</span>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Recipient</span>
            <span className="font-semibold text-slate-900">{transaction.receiverName || 'Recipient'}</span>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Payment Type</span>
            <span className="font-semibold text-slate-900 uppercase">{transaction.transactionType || 'TRANSFER'}</span>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Remarks</span>
            <span className="text-slate-900 font-medium">{transaction.remarks || 'None'}</span>
          </div>

          <div className="flex justify-between items-center pt-3.5">
            <span className="text-slate-500 font-medium">Timestamp</span>
            <span className="text-slate-700">
              {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'medium',
              }) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified by PaySphere Core</span>
          </div>
          <span>Ref: {transaction.referenceNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default UserTransactionDetails;