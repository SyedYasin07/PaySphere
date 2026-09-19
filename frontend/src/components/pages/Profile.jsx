import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  X,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

function Profile() {
  const { user: authUser, updateUser, refreshUser } = useAuth();

  const [profile, setProfile] = useState(authUser);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileMessage, setProfileMessage] = useState(null); // { type, text }
  const [passwordMessage, setPasswordMessage] = useState(null); // { type, text }
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Load profile via GET /users/me
  const loadProfile = async () => {
    try {
      const resp = await api.get('/users/me');
      console.log('Profile loaded:', resp.data);
      setProfile(resp.data);
      setEditForm({
        firstName: resp.data.firstName || '',
        lastName: resp.data.lastName || '',
        phone: resp.data.phone || '',
        dateOfBirth: resp.data.dateOfBirth || '',
        gender: resp.data.gender || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Update profile using PUT /users/me with RegReqDTO body
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setSavingProfile(true);

    try {
      const resp = await api.put('/users/me', {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
        dateOfBirth: editForm.dateOfBirth || null,
        gender: editForm.gender || null,
      });

      console.log('Profile updated:', resp.data);
      setProfile(resp.data);
      updateUser(resp.data);
      setIsEditing(false);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Failed to update profile:', error);
      const msg =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || 'Failed to update profile details.';
      setProfileMessage({ type: 'error', text: msg });
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password using PUT /users/me/password with ChangePasswordDTO body
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setSavingPassword(true);

    try {
      const resp = await api.put('/users/me/password', {
        currentPassword,
        newPassword,
      });

      console.log('Password changed:', resp.data);
      const msg = typeof resp.data === 'string' ? resp.data : 'Password changed successfully';
      setPasswordMessage({ type: 'success', text: msg });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      const msg =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || 'Failed to update password. Verify current password.';
      setPasswordMessage({ type: 'error', text: msg });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Manage your personal details, verify contact info, and update security credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                  <p className="text-sm text-slate-500">Your profile details on PaySphere</p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-sm font-semibold rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {profileMessage && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-2.5 text-sm font-medium ${
                  profileMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{profileMessage.text}</span>
              </div>
            )}

            {isEditing ? (
              /* Edit Form */
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      value={editForm.dateOfBirth}
                      onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        phone: profile.phone || '',
                        dateOfBirth: profile.dateOfBirth || '',
                        gender: profile.gender || '',
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">First Name</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">{profile?.firstName || '—'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Last Name</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">{profile?.lastName || '—'}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Email Address</span>
                  <span className="text-base font-bold text-slate-900 mt-1 block font-mono">{profile?.email || '—'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Phone</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">{profile?.phone || '—'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Gender</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">{profile?.gender || '—'}</span>
                  </div>
                </div>

                {profile?.dateOfBirth && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Date of Birth</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">{profile.dateOfBirth}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Security & Verification */}
        <div className="lg:col-span-5 space-y-6">
          {/* Email Verification Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  profile?.emailVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Email Verification</h3>
                <span className="text-xs text-slate-500">Security checkpoint</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Verification Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    profile?.emailVerified
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {profile?.emailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>

              {!profile?.emailVerified && (
                <Link
                  to="/verify-email"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
                >
                  <span>Verify Email Address</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Change Password</h3>
                <span className="text-xs text-slate-500">Update security key</span>
              </div>
            </div>

            {passwordMessage && (
              <div
                className={`mb-4 p-3.5 rounded-xl flex items-start gap-2 text-sm font-medium ${
                  passwordMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full mt-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {savingPassword ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;