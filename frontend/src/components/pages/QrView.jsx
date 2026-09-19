import React, { useState, useEffect } from 'react';
import api from '../../Services/api';
import { useAuth } from '../../context/AuthContext';
import { QrCode, Download, Copy, Check, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

const QrView = () => {
  const { user } = useAuth();
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const qrDataString = user?.userId ? `PAYSPHERE:USER:${user.userId}` : '';

  const loadQrCode = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend: GET /qr/my-qr returns image/png byte stream
      const response = await api.get('/qr/my-qr', {
        responseType: 'blob',
      });

      const imageUrl = URL.createObjectURL(response.data);
      setQrImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return imageUrl;
      });
    } catch (err) {
      console.error('Failed to load QR code:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Unable to generate QR code. Ensure your wallet is created.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQrCode();
    return () => {
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl);
      }
    };
  }, []);

  const handleDownload = () => {
    if (!qrImageUrl) return;
    const a = document.createElement('a');
    a.href = qrImageUrl;
    a.download = `paysphere-qr-${user?.firstName || 'user'}-${user?.userId || 'code'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    if (!qrDataString) return;
    navigator.clipboard.writeText(qrDataString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Payment QR Code</h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Share this QR code with other PaySphere users to receive money directly into your wallet
        </p>
      </div>

      {/* Main QR Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden text-center p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-rose-900">QR Generation Failed</h3>
              <p className="text-sm text-rose-700 mt-1">{error}</p>
              <button
                type="button"
                onClick={loadQrCode}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Generating your unique PaySphere QR code...</p>
          </div>
        ) : qrImageUrl ? (
          <div className="space-y-6">
            {/* User Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>{user?.firstName} {user?.lastName}</span>
            </div>

            {/* QR Image Container */}
            <div className="inline-block p-4 sm:p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 shadow-inner">
              <img
                src={qrImageUrl}
                alt="PaySphere Personal Payment QR Code"
                className="w-64 h-64 mx-auto rounded-xl object-contain bg-white shadow-xs"
              />
            </div>

            {/* QR Data String */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                PaySphere Identifier
              </label>
              <div className="flex items-center justify-center gap-2 max-w-sm mx-auto p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-800 break-all select-all">
                <QrCode className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{qrDataString}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0"
                  title="Copy QR identifier"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download QR Image</span>
              </button>

              <button
                type="button"
                onClick={loadQrCode}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Code</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QrView;
