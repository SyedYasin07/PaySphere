import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../Services/api';
import StatusBadge from '../common/StatusBadge';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  User,
  ChevronRight,
  Mail,
  Phone,
} from 'lucide-react';

const AdminUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [flashMsg, setFlashMsg] = useState(location.state?.message || '');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      // Backend: GET /users returns List<UserRespDTO>
      const resp = await api.get('/users');
      console.log('Admin users loaded:', resp.data);
      setUsers(Array.isArray(resp.data) ? resp.data : []);
    } catch (err) {
      console.error('Failed to load users:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Failed to load platform users.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const fName = (user.firstName || '').toLowerCase();
      const lName = (user.lastName || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const phone = (user.phone || '').toString();

      const matchesSearch =
        !query ||
        fName.includes(query) ||
        lName.includes(query) ||
        `${fName} ${lName}`.includes(query) ||
        email.includes(query) ||
        phone.includes(query);

      const matchesStatus =
        statusFilter === 'ALL' || (user.status && user.status.toUpperCase() === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  // KPI Metrics
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;
  const blockedCount = users.filter((u) => u.status === 'BLOCKED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
            <span>User Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Directory of registered PaySphere accounts, security standing, and profile controls.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Total Accounts
            </span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount}</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Active Accounts
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{activeCount}</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Blocked / Suspended
            </span>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{blockedCount}</div>
        </div>
      </div>

      {/* Flash / Error Notices */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {flashMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-700 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{flashMsg}</div>
          <button
            type="button"
            onClick={() => setFlashMsg('')}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Controls: Search & Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3.5 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
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
                {st === 'ALL' ? 'All Accounts' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table / Mobile Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading platform users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-800">No users match your criteria</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or status filter.'
                : 'No user accounts found in the database.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-4 px-5">User</th>
                    <th className="py-4 px-5">Contact Info</th>
                    <th className="py-4 px-5">Email Verification</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isBlocked = u.status === 'BLOCKED';
                    return (
                      <tr key={u.userId} className="hover:bg-slate-50/75 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                              {u.firstName?.[0]?.toUpperCase()}
                              {u.lastName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 text-sm">
                                {u.firstName} {u.lastName}
                              </div>
                              <div className="text-xs text-slate-400 font-mono">
                                ID: #{u.userId}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-5 space-y-1">
                          <div className="text-slate-700 flex items-center gap-1.5 font-medium text-sm">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {u.email || '—'}
                          </div>
                          <div className="text-slate-500 text-xs flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {u.phone || '—'}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          {u.emailVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Unverified
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5">
                          <StatusBadge status={u.status} />
                        </td>

                        <td className="py-4 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/users/${u.userId}`)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <div key={u.userId} className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {u.firstName?.[0]?.toUpperCase()}
                        {u.lastName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          ID: #{u.userId}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={u.status} size="sm" />
                  </div>

                  <div className="text-xs sm:text-sm space-y-1 text-slate-600 pl-1">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{u.phone || 'No phone'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div>
                      {u.emailVerified ? (
                        <span className="text-xs text-emerald-600 font-semibold">✓ Verified</span>
                      ) : (
                        <span className="text-xs text-amber-600 font-semibold">⚠ Unverified</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/admin/users/${u.userId}`)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span>View Details</span>
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

export default AdminUsers;