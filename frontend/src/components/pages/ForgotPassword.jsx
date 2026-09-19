import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import { Wallet, Mail, ArrowRight, ArrowLeft, KeyRound, Copy, Check } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Backend: POST /users/forgot-password with body: { email }
      // Returns raw reset token string
      const resp = await api.post('/users/forgot-password', { email: email.trim() });
      setGeneratedToken(resp.data);
    } catch (err) {
      console.error('Forgot password error:', err);
      const errMsg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Failed to generate reset token. User may not exist.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-2.5 text-indigo-600 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-slate-900 text-2xl tracking-tight">PaySphere</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Forgot Password</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1.5">
            Enter your registered email to receive a password reset token
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          {!generatedToken ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Request Reset Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
                <p className="font-semibold text-emerald-900 mb-1">Reset token generated successfully!</p>
                <p>This token is valid for 15 minutes. Use it on the reset password page to set a new password.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Your Reset Token
                </label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-800 break-all select-all">
                  <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="flex-1">{generatedToken}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title="Copy token to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/reset-password?token=${encodeURIComponent(generatedToken)}`)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-md shadow-indigo-200 cursor-pointer"
              >
                <span>Proceed to Reset Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-sm">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
            <Link
              to="/reset-password"
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Already have a token?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
