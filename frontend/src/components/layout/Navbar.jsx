import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../Services/api';
import { 
  Menu, 
  Wallet, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Fetch balance once for USER only - avoids repeated API calls
  useEffect(() => {
    let isMounted = true;
    if (role === 'USER') {
      setLoadingBalance(true);
      api.get('/wallets/balance')
        .then((resp) => {
          if (isMounted && typeof resp.data === 'number') {
            setBalance(resp.data);
          }
        })
        .catch(() => {
          // Silent catch to prevent navbar failure if wallet not initialized
        })
        .finally(() => {
          if (isMounted) setLoadingBalance(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return 'PS';
    const first = user.firstName ? user.firstName[0] : '';
    const last = user.lastName ? user.lastName[0] : '';
    return (first + last).toUpperCase() || 'PS';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left side: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to={role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
            className="flex items-center gap-2.5 text-indigo-600 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                PaySphere
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 leading-none">
                Digital Wallet
              </span>
            </div>
          </Link>
        </div>

        {/* Right side: Role/Balance Badge & User Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* USER Role: Live Balance Pill */}
          {role === 'USER' && (
            <Link
              to="/wallet"
              className="group hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 transition-all text-xs sm:text-sm"
              title="View wallet details"
            >
              <span className="text-slate-500 font-medium group-hover:text-indigo-600 transition-colors">
                Balance:
              </span>
              <span className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                {loadingBalance ? (
                  '...'
                ) : balance !== null ? (
                  `₹${Number(balance).toLocaleString('en-IN')}`
                ) : (
                  'View'
                )}
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}

          {/* ADMIN Role: Administrator Tag */}
          {role === 'ADMIN' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Portal</span>
            </div>
          )}

          {/* User Profile Avatar & Name */}
          <Link
            to="/profile"
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            title="Manage profile"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
              {getInitials()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-900 leading-tight">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'My Account'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {role === 'ADMIN' ? 'Administrator' : 'Verified User'}
              </span>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
            title="Sign out of PaySphere"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
