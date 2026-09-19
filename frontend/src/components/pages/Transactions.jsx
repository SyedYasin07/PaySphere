import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import StatusBadge from '../common/StatusBadge';
import {
  History,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Filter,
  X,
  AlertCircle,
  FileText,
} from 'lucide-react';

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchRef, setSearchRef] = useState('');
  const [directionFilter, setDirectionFilter] = useState('ALL'); // 'ALL' | 'SENT' | 'RECEIVED'
  const [searchedTransaction, setSearchedTransaction] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Load all user transactions via GET /transactions/history
  const loadTransactions = async () => {
    try {
      const resp = await api.get('/transactions/history');
      console.log('Transactions history loaded:', resp.data);
      setTransactions(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Search by single reference number using GET /transactions/reference/{referenceNumber}
  const handleSearchReference = async (e) => {
    e.preventDefault();
    if (!searchRef.trim()) {
      setSearchedTransaction(null);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const resp = await api.get(`/transactions/reference/${searchRef.trim()}`);
      console.log('Searched transaction:', resp.data);
      setSearchedTransaction(resp.data);
    } catch (error) {
      console.error('Transaction reference search failed:', error);
      const msg =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || 'Transaction not found or you do not have permission to view it.';
      setSearchError(msg);
      setSearchedTransaction(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchRef('');
    setSearchedTransaction(null);
    setSearchError(null);
  };

  // Filtered transactions list
  const filteredList = useMemo(() => {
    if (searchedTransaction) {
      return [searchedTransaction];
    }

    return transactions.filter((txn) => {
      // Direction filter
      if (directionFilter !== 'ALL' && txn.transactionDirection !== directionFilter) {
        return false;
      }
      // Reference text filter
      if (searchRef.trim()) {
        const query = searchRef.toLowerCase();
        const matchesRef = txn.referenceNumber?.toLowerCase().includes(query);
        const matchesSender = txn.senderName?.toLowerCase().includes(query);
        const matchesReceiver = txn.receiverName?.toLowerCase().includes(query);
        const matchesRemarks = txn.remarks?.toLowerCase().includes(query);
        return matchesRef || matchesSender || matchesReceiver || matchesRemarks;
      }
      return true;
    });
  }, [transactions, directionFilter, searchRef, searchedTransaction]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Transaction History</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1.5">
            Search, filter, and inspect all payments sent and received through your wallet
          </p>
        </div>

        {/* Direction Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setDirectionFilter('ALL');
              handleClearSearch();
            }}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              directionFilter === 'ALL' && !searchedTransaction
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              setDirectionFilter('SENT');
              handleClearSearch();
            }}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              directionFilter === 'SENT'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Money Sent
          </button>
          <button
            type="button"
            onClick={() => {
              setDirectionFilter('RECEIVED');
              handleClearSearch();
            }}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              directionFilter === 'RECEIVED'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Money Received
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchReference} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by Reference Number (e.g. TXN1741706...) or name"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 shadow-2xs"
          />
          {searchRef && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={searchLoading || !searchRef.trim()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          {searchLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search</span>
            </>
          )}
        </button>
      </form>

      {/* Search Error Feedback */}
      {searchError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-sm text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">{searchError}</span>
            <button
              type="button"
              onClick={handleClearSearch}
              className="block mt-1 text-indigo-600 hover:underline font-bold"
            >
              Show all transactions
            </button>
          </div>
        </div>
      )}

      {/* Search Reset Bar if single result found */}
      {searchedTransaction && (
        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between text-sm text-indigo-900">
          <span>Showing result for reference: <strong>{searchedTransaction.referenceNumber}</strong></span>
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-sm font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
          >
            Show All
          </button>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading your transactions...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-16 text-center">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Transactions Found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              No transactions match your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredList.map((txn) => {
              const isSent = txn.transactionDirection === 'SENT';

              return (
                <div
                  key={txn.transactionId || txn.referenceNumber}
                  className="p-4 sm:p-5 sm:px-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isSent ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'
                      }`}
                    >
                      {isSent ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold text-slate-900">
                          {isSent ? `To ${txn.receiverName || 'Recipient'}` : `From ${txn.senderName || 'Sender'}`}
                        </span>
                        <StatusBadge status={txn.transactionStatus} size="sm" />
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        Ref: {txn.referenceNumber}
                      </div>
                      {txn.remarks && (
                        <div className="text-xs sm:text-sm text-slate-500 italic mt-0.5">"{txn.remarks}"</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div
                        className={`text-base sm:text-lg font-bold ${
                          isSent ? 'text-slate-900' : 'text-emerald-600'
                        }`}
                      >
                        {isSent ? '-' : '+'}₹{Number(txn.amount).toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-slate-400">
                        {txn.createdAt
                          ? new Date(txn.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recent'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/transactions/${txn.referenceNumber}`)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                    >
                      <span>Receipt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;