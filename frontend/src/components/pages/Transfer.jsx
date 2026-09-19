import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import {
  SendHorizontal,
  QrCode,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
} from 'lucide-react';

function Transfer() {
  const navigate = useNavigate();

  const [receiverInput, setReceiverInput] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [verifyingRecipient, setVerifyingRecipient] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  // Modal and Transfer States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(null); // { message, amount, recipient, remarks, date }
  const [transferError, setTransferError] = useState(null);

  // Format recipient input to standard PAYSPHERE:USER:{id} format
  const getNormalizedQrData = (input) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('PAYSPHERE:USER:')) {
      return trimmed;
    }
    // If user entered only digits (user ID), prepend standard format
    if (/^\d+$/.test(trimmed)) {
      return `PAYSPHERE:USER:${trimmed}`;
    }
    return trimmed;
  };

  // Recipient verification via existing POST /qr/scan
  const handleVerifyRecipient = async () => {
    if (!receiverInput.trim()) {
      setVerificationError('Please enter a PaySphere QR string or Receiver User ID');
      return;
    }

    const qrData = getNormalizedQrData(receiverInput);
    setVerifyingRecipient(true);
    setVerificationError(null);
    setRecipient(null);

    try {
      // Backend: POST /qr/scan with body { qrData: "PAYSPHERE:USER:4" }
      // Returns UserRespDTO
      const resp = await api.post('/qr/scan', { qrData });
      console.log('Recipient verified:', resp.data);
      setRecipient(resp.data);
    } catch (err) {
      console.error('Recipient lookup failed:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Recipient not found. Please check the QR data.';
      setVerificationError(msg);
    } finally {
      setVerifyingRecipient(false);
    }
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setTransferError(null);

    if (!receiverInput.trim() || !amount) {
      setTransferError('Please provide receiver and transfer amount');
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setTransferError('Enter a valid transfer amount greater than zero');
      return;
    }

    // If recipient has not been looked up yet, prompt user or auto-verify
    if (!recipient) {
      handleVerifyRecipient();
    }

    setShowConfirmModal(true);
  };

  // Execute transfer using existing POST /wallets/transfer
  const executeTransfer = async () => {
    setTransferring(true);
    setTransferError(null);

    const qrData = getNormalizedQrData(receiverInput);
    const numAmount = Number(amount);

    try {
      // Backend: POST /wallets/transfer with TransferMoneyReqDTO: { receiverQrData, amount, remarks }
      const resp = await api.post('/wallets/transfer', {
        receiverQrData: qrData,
        amount: numAmount,
        remarks: remarks.trim() || 'Money Transfer',
      });

      console.log('Transfer executed successfully:', resp.data);
      const successMsg = typeof resp.data === 'string' ? resp.data : 'Money transferred successfully';

      setTransferSuccess({
        message: successMsg,
        amount: numAmount,
        recipientName: recipient ? `${recipient.firstName} ${recipient.lastName}` : qrData,
        recipientEmail: recipient?.email,
        remarks: remarks.trim() || 'Money Transfer',
        date: new Date().toLocaleString('en-IN'),
      });

      setShowConfirmModal(false);
      setReceiverInput('');
      setAmount('');
      setRemarks('');
      setRecipient(null);
    } catch (err) {
      console.error('Transfer execution failed:', err);
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Transfer failed. Check your wallet balance and receiver status.';
      setTransferError(msg);
      setShowConfirmModal(false);
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Transfer Money</h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5">
          Send funds securely to another PaySphere user via QR identifier or User ID
        </p>
      </div>

      {/* Success Receipt View */}
      {transferSuccess ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Transfer Successful!</h2>
            <p className="text-sm text-slate-500 mt-1">{transferSuccess.message}</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 max-w-md mx-auto space-y-3.5 text-sm text-left">
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Amount Sent</span>
              <span className="text-lg font-bold text-slate-900">
                ₹{Number(transferSuccess.amount).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Sent To</span>
              <span className="font-semibold text-slate-900">{transferSuccess.recipientName}</span>
            </div>
            {transferSuccess.recipientEmail && (
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-medium">Recipient Email</span>
                <span className="font-mono text-slate-700">{transferSuccess.recipientEmail}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Remarks</span>
              <span className="text-slate-900 font-medium">{transferSuccess.remarks}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Date & Time</span>
              <span className="text-slate-500">{transferSuccess.date}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setTransferSuccess(null)}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Make Another Transfer
            </button>
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              View Transaction History
            </button>
          </div>
        </div>
      ) : (
        /* Transfer Form Card */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          {transferError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-sm text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{transferError}</span>
            </div>
          )}

          <form onSubmit={handleOpenConfirm} className="space-y-5">
            {/* Recipient Input with Verification Trigger */}
            <div>
              <label htmlFor="receiver-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                Receiver QR Data or User ID
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <input
                    id="receiver-input"
                    type="text"
                    required
                    placeholder="e.g. PAYSPHERE:USER:4 or 4"
                    value={receiverInput}
                    onChange={(e) => {
                      setReceiverInput(e.target.value);
                      setRecipient(null);
                      setVerificationError(null);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyRecipient}
                  disabled={verifyingRecipient || !receiverInput.trim()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Verify recipient details before transferring"
                >
                  {verifyingRecipient ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Lookup</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Recipient Verification Feedback */}
            {verificationError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
                {verificationError}
              </div>
            )}

            {recipient && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {recipient.firstName} {recipient.lastName}
                    </div>
                    <div className="text-xs text-slate-500">{recipient.email}</div>
                  </div>
                </div>
                <StatusBadge status={recipient.status || 'ACTIVE'} size="sm" />
              </div>
            )}

            {/* Amount */}
            <div>
              <label htmlFor="transfer-amount" className="block text-sm font-medium text-slate-700 mb-1.5">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  id="transfer-amount"
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label htmlFor="transfer-remarks" className="block text-sm font-medium text-slate-700 mb-1.5">
                Remarks (Optional)
              </label>
              <input
                id="transfer-remarks"
                type="text"
                placeholder="Payment for dinner, rent, etc."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <SendHorizontal className="w-4 h-4" />
              <span>Review & Transfer Money</span>
            </button>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Money Transfer"
        subtitle="Please review the transfer details carefully before confirming."
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-sm">
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Transfer Amount:</span>
              <span className="text-lg font-bold text-slate-900">
                ₹{Number(amount || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Recipient:</span>
              <span className="font-semibold text-slate-900">
                {recipient ? `${recipient.firstName} ${recipient.lastName}` : receiverInput}
              </span>
            </div>
            {recipient?.email && (
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-medium">Email:</span>
                <span className="font-mono text-slate-700">{recipient.email}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">Remarks:</span>
              <span className="text-slate-900 font-medium">{remarks.trim() || 'Money Transfer'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeTransfer}
              disabled={transferring}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {transferring ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Money</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Transfer;