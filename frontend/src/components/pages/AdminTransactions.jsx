import React, {
  useEffect,
  useState,
  useMemo,
} from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../../Services/api';
import StatusBadge from '../common/StatusBadge';

import {
  ReceiptText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  X,
  FileText,
} from 'lucide-react';

const AdminTransactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchRef, setSearchRef] = useState('');

  const [searchedTransaction, setSearchedTransaction] =
    useState(null);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [searchError, setSearchError] = useState('');

  // --------------------------------------------------
  // Currency formatter
  // --------------------------------------------------
  const formatCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
      return '₹0.00';
    }

    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';

    // Extremely large values
    if (abs >= 10000000000000) {
      return `${sign}₹${(abs / 10000000000000).toLocaleString(
        'en-IN',
        {
          maximumFractionDigits: 2,
        }
      )} Lakh Cr`;
    }

    // Crores
    if (abs >= 10000000) {
      return `${sign}₹${(abs / 10000000).toLocaleString(
        'en-IN',
        {
          maximumFractionDigits: 2,
        }
      )} Cr`;
    }

    // Lakhs
    if (abs >= 100000) {
      return `${sign}₹${(abs / 100000).toLocaleString(
        'en-IN',
        {
          maximumFractionDigits: 2,
        }
      )} Lakh`;
    }

    return `${sign}₹${abs.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Exact value for tooltip
  const formatExactCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
      return '₹0.00';
    }

    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // --------------------------------------------------
  // Load transactions
  // --------------------------------------------------
  const loadTransactions = async (
    selectedStatus = statusFilter
  ) => {
    setLoading(true);
    setError('');

    try {
      let resp;

      if (selectedStatus === 'ALL') {
        resp = await api.get('/admin/transactions');
      } else {
        resp = await api.get(
          `/admin/transactions/status/${selectedStatus}`
        );
      }

      console.log(
        'Admin transactions loaded:',
        resp.data
      );

      setTransactions(
        Array.isArray(resp.data)
          ? resp.data
          : []
      );
    } catch (err) {
      console.error(
        'Failed to load transactions:',
        err
      );

      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message ||
            'Failed to load ledger transactions.';

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(statusFilter);
  }, [statusFilter]);

  // --------------------------------------------------
  // Search by reference
  // --------------------------------------------------
  const handleSearchReference = async (e) => {
    e?.preventDefault();

    const query = searchRef.trim();

    if (!query) {
      setSearchedTransaction(null);
      setSearchError('');
      return;
    }

    setSearchLoading(true);
    setSearchError('');

    try {
      const resp = await api.get(
        `/admin/transactions/${query}`
      );

      console.log(
        'Searched transaction:',
        resp.data
      );

      setSearchedTransaction(resp.data);
    } catch (err) {
      console.error(
        'Failed to find transaction by reference:',
        err
      );

      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message ||
            `Transaction with reference "${query}" not found.`;

      setSearchError(msg);
      setSearchedTransaction(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // --------------------------------------------------
  // Clear search
  // --------------------------------------------------
  const handleClearSearch = () => {
    setSearchRef('');
    setSearchedTransaction(null);
    setSearchError('');
  };

  // --------------------------------------------------
  // Display transactions
  // --------------------------------------------------
  const displayTransactions = useMemo(() => {
    if (searchedTransaction) {
      return [searchedTransaction];
    }

    if (!searchRef.trim()) {
      return transactions;
    }

    const query = searchRef
      .toLowerCase()
      .trim();

    return transactions.filter((t) => {
      const ref =
        (t.referenceNumber || '').toLowerCase();

      const sender =
        (t.senderName || '').toLowerCase();

      const receiver =
        (t.receiverName || '').toLowerCase();

      const remarks =
        (t.remarks || '').toLowerCase();

      return (
        ref.includes(query) ||
        sender.includes(query) ||
        receiver.includes(query) ||
        remarks.includes(query)
      );
    });
  }, [
    transactions,
    searchedTransaction,
    searchRef,
  ]);

  // --------------------------------------------------
  // Ledger summary
  // --------------------------------------------------
  const totalCount = transactions.length;

  const successCount = transactions.filter(
    (t) =>
      t.transactionStatus === 'SUCCESS'
  ).length;

  const failedCount = transactions.filter(
    (t) =>
      t.transactionStatus === 'FAILED'
  ).length;

  const totalVolume = transactions
    .filter(
      (t) =>
        t.transactionStatus === 'SUCCESS'
    )
    .reduce(
      (sum, t) =>
        sum + (Number(t.amount) || 0),
      0
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
            <ReceiptText className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />

            <span>
              Platform Transaction Ledger
            </span>
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Global immutable audit trail of peer-to-peer
            transfers, deposits, and settlement logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            handleClearSearch();
            loadTransactions(statusFilter);
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              loading ? 'animate-spin' : ''
            }`}
          />

          <span>
            Refresh Ledger
          </span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

        {/* Total */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Total Audited
            </span>

            <ReceiptText className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalCount}
          </div>
        </div>

        {/* Successful */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Successful
            </span>

            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {successCount}
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Failed Attempts
            </span>

            <XCircle className="w-5 h-5 text-rose-500" />
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">
            {failedCount}
          </div>
        </div>

        {/* Settled Volume */}
        {/* Settled Volume */}
<div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs min-w-0">
  
  <div className="flex items-center justify-between text-slate-400 mb-2.5">
    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
      Settled Volume
    </span>

    <TrendingUp className="w-5 h-5 text-teal-500 shrink-0" />
  </div>

  <div
    className="
      text-xl sm:text-2xl
      font-extrabold
      text-slate-900
      leading-tight
      break-words
      whitespace-normal
      overflow-hidden
    "
    title={formatExactCurrency(totalVolume)}
  >
    {formatCurrency(totalVolume)}
  </div>

</div>
      </div>

      {/* Global Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

          <div>{error}</div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3.5 items-center justify-between">

        {/* Search */}
        <form
          onSubmit={handleSearchReference}
          className="relative w-full md:w-96 flex gap-2"
        >

          <div className="relative flex-1">

            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search reference # (e.g. TXN...)"
              value={searchRef}
              onChange={(e) =>
                setSearchRef(e.target.value)
              }
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />

            {searchRef && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

          </div>

          <button
            type="submit"
            disabled={
              searchLoading ||
              !searchRef.trim()
            }
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            {searchLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <span>Lookup</span>
            )}
          </button>

        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">

          <Filter className="w-4 h-4 text-slate-400 shrink-0" />

          <div className="flex rounded-xl bg-slate-100 p-1 text-xs sm:text-sm font-semibold">

            {[
              {
                id: 'ALL',
                label: 'All Status',
              },
              {
                id: 'SUCCESS',
                label: 'Success',
              },
              {
                id: 'FAILED',
                label: 'Failed',
              },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  handleClearSearch();
                  setStatusFilter(st.id);
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st.id &&
                  !searchedTransaction
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}

          </div>
        </div>
      </div>

      {/* Search Error */}
      {searchError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-sm text-rose-700">

          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />

            <span>
              {searchError}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearSearch}
            className="font-bold underline text-rose-800 hover:text-rose-950"
          >
            Clear Search
          </button>

        </div>
      )}

      {/* Search Banner */}
      {searchedTransaction && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-sm text-indigo-900">

          <span>
            Displaying exact match for Reference:{' '}

            <strong className="font-mono font-bold">
              {searchedTransaction.referenceNumber}
            </strong>
          </span>

          <button
            type="button"
            onClick={handleClearSearch}
            className="font-bold underline text-indigo-700 hover:text-indigo-900"
          >
            Show All Ledger Logs
          </button>

        </div>
      )}

      {/* Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">

        {loading ? (
          <div className="py-16 text-center">

            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />

            <p className="text-sm font-medium text-slate-600">
              Retrieving system ledger...
            </p>

          </div>
        ) : displayTransactions.length === 0 ? (
          <div className="py-16 text-center px-4">

            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />

            <p className="text-base font-semibold text-slate-800">
              No transactions recorded
            </p>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {searchRef ||
              statusFilter !== 'ALL'
                ? 'No transactions match your search or filter condition.'
                : 'Ledger is currently empty.'}
            </p>

          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">

              <table className="w-full text-left border-collapse text-sm">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-xs">

                    <th className="py-4 px-5">
                      Ref # & Date
                    </th>

                    <th className="py-4 px-5">
                      Parties (Sender → Receiver)
                    </th>

                    <th className="py-4 px-5">
                      Amount
                    </th>

                    <th className="py-4 px-5">
                      Type
                    </th>

                    <th className="py-4 px-5">
                      Status
                    </th>

                    <th className="py-4 px-5 text-right">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {displayTransactions.map((t) => (

                    <tr
                      key={t.transactionId}
                      className="hover:bg-slate-50/75 transition-colors"
                    >

                      {/* Reference */}
                      <td className="py-4 px-5">

                        <div className="font-mono font-bold text-slate-900 text-sm">
                          {t.referenceNumber}
                        </div>

                        <div className="text-xs text-slate-400 mt-0.5">
                          {t.createdAt
                            ? new Date(
                                t.createdAt
                              ).toLocaleString(
                                'en-IN',
                                {
                                  dateStyle:
                                    'medium',
                                  timeStyle:
                                    'short',
                                }
                              )
                            : 'N/A'}
                        </div>

                      </td>

                      {/* Parties */}
                      <td className="py-4 px-5">

                        <div className="flex items-center gap-2 font-medium text-slate-800 text-sm">

                          <span className="truncate max-w-[130px]">
                            {t.senderName ||
                              `User #${t.senderId}`}
                          </span>

                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                          <span className="truncate max-w-[130px]">
                            {t.receiverName ||
                              `User #${t.receiverId}`}
                          </span>

                        </div>

                        {t.remarks && (
                          <div className="text-xs text-slate-400 italic mt-0.5 truncate max-w-xs">
                            "{t.remarks}"
                          </div>
                        )}

                      </td>

                      {/* Amount */}
                      <td className="py-4 px-5 max-w-[220px]">

                        <span
                          className="font-bold text-slate-900 text-base block truncate"
                          title={formatExactCurrency(
                            t.amount
                          )}
                        >
                          {formatCurrency(
                            t.amount
                          )}
                        </span>

                      </td>

                      {/* Type */}
                      <td className="py-4 px-5">

                        <span className="font-semibold text-slate-600 uppercase text-xs bg-slate-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                          {t.transactionType ||
                            'TRANSFER'}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <StatusBadge
                          status={
                            t.transactionStatus
                          }
                        />
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/transactions/${t.referenceNumber}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                        >
                          <span>
                            Audit View
                          </span>

                          <ChevronRight className="w-4 h-4" />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">

              {displayTransactions.map((t) => (

                <div
                  key={t.transactionId}
                  className="p-4 sm:p-5 space-y-3"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <div className="font-mono font-bold text-slate-900 text-sm truncate">
                        {t.referenceNumber}
                      </div>

                      <div className="text-xs text-slate-400 mt-0.5">
                        {t.createdAt
                          ? new Date(
                              t.createdAt
                            ).toLocaleString(
                              'en-IN',
                              {
                                dateStyle:
                                  'medium',
                                timeStyle:
                                  'short',
                              }
                            )
                          : 'N/A'}
                      </div>

                    </div>

                    <StatusBadge
                      status={
                        t.transactionStatus
                      }
                      size="sm"
                    />

                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 flex items-center gap-2">

                    <span className="font-semibold truncate max-w-[120px]">
                      {t.senderName ||
                        `User #${t.senderId}`}
                    </span>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                    <span className="font-semibold truncate max-w-[120px]">
                      {t.receiverName ||
                        `User #${t.receiverId}`}
                    </span>

                  </div>

                  {t.remarks && (
                    <div className="text-xs text-slate-500 italic truncate">
                      "{t.remarks}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 gap-3">

                    <div className="min-w-0">

                      <span className="text-xs text-slate-400 block uppercase font-semibold">
                        Amount
                      </span>

                      <span
                        className="text-base font-bold text-slate-900 block truncate max-w-[180px]"
                        title={formatExactCurrency(
                          t.amount
                        )}
                      >
                        {formatCurrency(
                          t.amount
                        )}
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/transactions/${t.referenceNumber}`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer shrink-0"
                    >
                      <span>
                        Audit View
                      </span>

                      <ChevronRight className="w-4 h-4" />
                    </button>

                  </div>

                </div>

              ))}

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;