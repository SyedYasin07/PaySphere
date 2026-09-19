import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../Services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, 
  MailCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  KeyRound,
  LayoutDashboard
} from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshUser, isAuthenticated } = useAuth();

  const [tokenInput, setTokenInput] = useState('');
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [verifying, setVerifying] = useState(false);
  const [sendingToken, setSendingToken] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'SUCCESS' | 'ERROR'
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);

  // Function to execute email verification using GET /users/verify-email?token=...
  const executeVerification = useCallback(async (tokenToVerify) => {
    if (!tokenToVerify) return;

    setVerifying(true);
    setVerificationStatus(null);
    setStatusMessage('');

    try {
      const resp = await api.get(`/users/verify-email?token=${encodeURIComponent(tokenToVerify.trim())}`);
      const msg = typeof resp.data === 'string' ? resp.data : 'Email verified successfully!';
      setVerificationStatus('SUCCESS');
      setStatusMessage(msg);

      // Refresh the session if the user is currently authenticated so the banner updates
      if (isAuthenticated) {
        refreshUser();
      }
    } catch (err) {
      console.error('Email verification error:', err);
      const errMsg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Invalid or expired verification token.';
      setVerificationStatus('ERROR');
      setStatusMessage(errMsg);
    } finally {
      setVerifying(false);
    }
  }, [isAuthenticated, refreshUser]);

  // Auto-verify if ?token=... is present in URL
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setTokenInput(urlToken);
      executeVerification(urlToken);
    }
  }, [searchParams, executeVerification]);

  // Request new verification token using POST /users/send-verification with { email }
  const handleSendToken = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setStatusMessage('Please enter your email address');
      setVerificationStatus('ERROR');
      return;
    }

    setSendingToken(true);
    setVerificationStatus(null);
    setStatusMessage('');

    try {
      const resp = await api.post('/users/send-verification', {
        email: emailInput.trim(),
      });
      const token = resp.data;
      setGeneratedToken(token);
      setTokenInput(token);
      setVerificationStatus('TOKEN_SENT');
      setStatusMessage('Verification token generated successfully! Click verify below to confirm your email.');
    } catch (err) {
      console.error('Send verification error:', err);
      const errMsg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Failed to send verification token. Email may already be verified.';
      setVerificationStatus('ERROR');
      setStatusMessage(errMsg);
    } finally {
      setSendingToken(false);
    }
  };

  const handleManualVerify = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setStatusMessage('Please enter a verification token');
      setVerificationStatus('ERROR');
      return;
    }
    executeVerification(tokenInput);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-indigo-600 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-slate-900 text-2xl tracking-tight">PaySphere</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Email Verification</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1.5">
            Verify your email address to unlock full wallet privileges
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
          {/* Status Message Display */}
          {verificationStatus === 'SUCCESS' && (
            <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-emerald-900">Email Verified!</h3>
              <p className="text-xs sm:text-sm text-emerald-700 mt-1">{statusMessage}</p>
              <div className="mt-4">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Login</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {verificationStatus === 'ERROR' && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">Verification Failed</h4>
                <p className="text-xs sm:text-sm text-rose-700 mt-0.5">{statusMessage}</p>
              </div>
            </div>
          )}

          {verificationStatus === 'TOKEN_SENT' && (
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <div className="flex items-start gap-2.5">
                <MailCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-indigo-900">Token Ready</h4>
                  <p className="text-xs sm:text-sm text-indigo-700 mt-0.5">{statusMessage}</p>
                </div>
              </div>
              {generatedToken && (
                <div className="mt-3 p-3 bg-white border border-indigo-100 rounded-xl font-mono text-sm text-slate-800 break-all select-all">
                  {generatedToken}
                </div>
              )}
            </div>
          )}

          {verifying ? (
            <div className="py-8 text-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Verifying your email token...</p>
            </div>
          ) : verificationStatus !== 'SUCCESS' && (
            <div className="space-y-6">
              {/* Form 1: Enter Token & Verify */}
              <form onSubmit={handleManualVerify} className="space-y-3">
                <label htmlFor="verify-token" className="block text-sm font-medium text-slate-700">
                  Enter Verification Token
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="verify-token"
                    type="text"
                    placeholder="Paste verification token"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!tokenInput.trim() || verifying}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <MailCheck className="w-4 h-4" />
                  <span>Verify Email Now</span>
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200" />
                <span className="shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  or request a new token
                </span>
                <div className="grow border-t border-slate-200" />
              </div>

              {/* Form 2: Request Token */}
              <form onSubmit={handleSendToken} className="space-y-3">
                <label htmlFor="verify-email" className="block text-sm font-medium text-slate-700">
                  Registered Email Address
                </label>
                <input
                  id="verify-email"
                  type="email"
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={sendingToken}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all border border-slate-200 disabled:opacity-60 cursor-pointer"
                >
                  {sendingToken ? (
                    <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Verification Token</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-sm">
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Back to Dashboard' : 'Back to Login'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
