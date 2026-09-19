import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';

const AdminUserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal states: 'block' | 'unblock' | 'delete' | null
  const [activeModal, setActiveModal] = useState(null);
  const [modalProcessing, setModalProcessing] = useState(false);

  const loadUser = async () => {
    setLoading(true);
    setError('');
    try {
      // Backend: GET /users/{id}
      const resp = await api.get(`/users/${userId}`);
      console.log('Admin user details:', resp.data);
      setUser(resp.data);
    } catch (err) {
      console.error('Failed to load user:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Unable to load user details from server.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  // Self-protection check
  const isSelf = Boolean(
    user &&
      currentUser &&
      (Number(currentUser.userId) === Number(user.userId) ||
        (currentUser.email && currentUser.email.toLowerCase() === user.email?.toLowerCase()))
  );

  const handleBlockUnblock = async () => {
    if (!user) return;
    setModalProcessing(true);
    setError('');
    const willBlock = user.status === 'ACTIVE';

    try {
      // Backend: PUT /users/{id}/block or PUT /users/{id}/unblock
      const endpoint = willBlock ? `/users/${userId}/block` : `/users/${userId}/unblock`;
      const resp = await api.put(endpoint);

      setUser(resp.data);
      setSuccessMsg(
        `User ${resp.data.firstName} ${resp.data.lastName} (${resp.data.email}) has been ${
          willBlock ? 'blocked' : 'unblocked'
        } successfully.`
      );
      setActiveModal(null);
    } catch (err) {
      console.error('Failed to update user status:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Failed to update user account status.';
      setError(msg);
    } finally {
      setModalProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setModalProcessing(true);
    setError('');

    try {
      // Backend: DELETE /users/{id}
      await api.delete(`/users/${userId}`);
      setActiveModal(null);
      // Navigate back to user list with state or timeout
      navigate('/admin/users', {
        state: { message: `User #${userId} deleted successfully.` },
      });
    } catch (err) {
      console.error('Failed to delete user:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Failed to delete user account.';
      setError(msg);
      setModalProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Loading user profile...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">User Not Found</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isBlocked = user.status === 'BLOCKED';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users List</span>
        </button>

        <button
          type="button"
          onClick={loadUser}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-700 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMsg}</div>
        </div>
      )}

      {isSelf && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800 text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Current Logged-in Administrator Account</span>
            This profile corresponds to your active administrator session. For security reasons, you cannot block or delete your own account from this console.
          </div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/15 text-xl font-bold">
              {user.firstName?.[0]?.toUpperCase()}
              {user.lastName?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <StatusBadge status={user.status} size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1 font-mono">User ID: #{user.userId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-medium">
                <Check className="w-4 h-4" />
                Email Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-medium">
                <X className="w-4 h-4" />
                Email Unverified
              </span>
            )}
          </div>
        </div>

        {/* User Information Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">
            Account Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block text-xs">Email Address</span>
                <span className="font-semibold text-slate-800 text-sm sm:text-base mt-0.5 block">{user.email || '—'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
              <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block text-xs">Phone Number</span>
                <span className="font-semibold text-slate-800 text-sm sm:text-base mt-0.5 block">{user.phone || '—'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
              <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block text-xs">Gender</span>
                <span className="font-semibold text-slate-800 text-sm sm:text-base mt-0.5 block">{user.gender || 'Not specified'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
              <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block text-xs">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={user.status} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Administrative Actions
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {isBlocked ? (
                <button
                  type="button"
                  disabled={isSelf}
                  onClick={() => setActiveModal('unblock')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Reactivate User Account</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSelf}
                  onClick={() => setActiveModal('block')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Suspend / Block Account</span>
                </button>
              )}

              <button
                type="button"
                disabled={isSelf}
                onClick={() => setActiveModal('delete')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}

      {/* Block / Unblock Modal */}
      <Modal
        isOpen={activeModal === 'block' || activeModal === 'unblock'}
        onClose={() => !modalProcessing && setActiveModal(null)}
        title={activeModal === 'block' ? 'Confirm User Suspension' : 'Confirm User Reactivation'}
      >
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              activeModal === 'block'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {activeModal === 'block' ? (
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            )}
            <div className="text-sm leading-relaxed">
              {activeModal === 'block' ? (
                <>
                  Are you sure you want to <strong className="font-semibold">suspend</strong>{' '}
                  <span className="font-semibold">
                    {user.firstName} {user.lastName}
                  </span>{' '}
                  ({user.email})? The user will be blocked from authenticating or performing transactions.
                </>
              ) : (
                <>
                  Are you sure you want to <strong className="font-semibold">reactivate</strong>{' '}
                  <span className="font-semibold">
                    {user.firstName} {user.lastName}
                  </span>{' '}
                  ({user.email})? The user account will be restored to active standing.
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              disabled={modalProcessing}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBlockUnblock}
              disabled={modalProcessing}
              className={`px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer ${
                activeModal === 'block'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } disabled:opacity-50`}
            >
              {modalProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{activeModal === 'block' ? 'Yes, Suspend User' : 'Yes, Reactivate User'}</span>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={activeModal === 'delete'}
        onClose={() => !modalProcessing && setActiveModal(null)}
        title="Permanently Delete User Account"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border bg-rose-50 border-rose-200 text-rose-800 flex items-start gap-3">
            <Trash2 className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <strong className="font-bold block mb-1">Warning: Irreversible Operation</strong>
              Are you sure you want to permanently delete user{' '}
              <span className="font-semibold">
                {user.firstName} {user.lastName}
              </span>{' '}
              (ID: #{user.userId}, Email: {user.email})? This action removes the user record from the database.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              disabled={modalProcessing}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={modalProcessing}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {modalProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Confirm Permanent Deletion</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserDetails;
