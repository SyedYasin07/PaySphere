import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  SendHorizontal,
  QrCode,
  History,
  User as UserIcon,
  Users,
  WalletCards,
  ReceiptText,
  LogOut,
  X,
  ShieldAlert,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Wallet', path: '/wallet', icon: Wallet },
    { label: 'Transfer Money', path: '/transfer', icon: SendHorizontal },
    { label: 'My QR Code', path: '/qr', icon: QrCode },
    { label: 'Transactions', path: '/transactions', icon: History },
    { label: 'Account Profile', path: '/profile', icon: UserIcon },
  ];

  const adminNavItems = [
    { label: 'Dashboard Stats', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Manage Wallets', path: '/admin/wallets', icon: WalletCards },
    { label: 'Transactions Audit', path: '/admin/transactions', icon: ReceiptText },
    { label: 'Admin Profile', path: '/profile', icon: UserIcon },
  ];

  const navItems = role === 'ADMIN' ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-base">PaySphere</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-6 pt-5 pb-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
            {role === 'ADMIN' ? 'Admin Management' : 'User Services'}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/profile'
                ? location.pathname === '/profile'
                : location.pathname === item.path ||
                  (item.path !== '/dashboard' &&
                    item.path !== '/admin/dashboard' &&
                    location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (isOpen) onClose();
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area with Security Badge & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-tight text-slate-500">
              <strong className="text-slate-700 font-semibold block mb-0.5">
                {role === 'ADMIN' ? 'Admin Mode' : 'Secure Wallet'}
              </strong>
              256-bit SSL encrypted
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
