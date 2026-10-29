import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  LayoutDashboard, 
  Trees, 
  Wheat, 
  BadgePercent, 
  BarChart3, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Wifi, 
  WifiOff, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isDemoMode, disableDemoMode, backendStatus } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Data Kebun', path: '/gardens', icon: Trees },
    { label: 'Catat Panen', path: '/harvests', icon: Wheat },
    { label: 'Penjualan', path: '/sales', icon: BadgePercent },
    { label: 'Laporan', path: '/reports', icon: BarChart3 },
    { label: 'Profil Pengguna', path: '/profile', icon: UserIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0F1E0F]/80 border-b border-white/10 transition-colors">
      {/* Banner Demo Mode jika aktif */}
      {isDemoMode && (
        <div className="bg-[#D97706]/20 border-b border-[#D97706]/40 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            <span className="font-semibold tracking-wide uppercase">Mode Preview Demo Aktif:</span>
            <span>Data ditampilkan sebagai simulasi antarmuka dan TIDAK tersimpan ke database.</span>
            <button
              onClick={disableDemoMode}
              className="ml-3 underline hover:text-white font-medium cursor-pointer"
            >
              Keluar dari Mode Demo
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Horizontal: Ikon Cengkih + Wordmark CENGKIHTRACK */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#47C826] to-[#257513] flex items-center justify-center shadow-lg shadow-[#47C826]/20 group-hover:scale-105 transition-transform">
              {/* Ikon Tanaman Cengkih */}
              <Sprout className="w-6 h-6 text-[#0F1E0F]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-emerald-100 to-[#47C826] bg-clip-text text-transparent font-sans">
                CENGKIHTRACK
              </span>
              <span className="text-[10px] tracking-widest text-[#AA8BAD] font-medium -mt-1 uppercase">
                Sistem Kebun Cengkih
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#47C826]/20 text-[#47C826] border border-[#47C826]/30 shadow-sm shadow-[#47C826]/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#47C826]' : 'text-[#AA8BAD]'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls: Status & User */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Status Koneksi Backend */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                backendStatus === 'online'
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
              }`}
              title={backendStatus === 'online' ? 'Backend terhubung (port 8080)' : 'Backend offline / PostgreSQL belum jalan'}
            >
              {backendStatus === 'online' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#47C826] animate-pulse"></span>
                  <span>Backend Aktif</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Backend Offline</span>
                </>
              )}
            </div>

            {/* User Dropdown / Profile info */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-white max-w-[120px] truncate">{user.name}</span>
                  <span className="text-[10px] text-[#AA8BAD] truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0F1E0F]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
          {/* Status koneksi di mobile */}
          <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs">
            <span className="text-[#AA8BAD]">Status Sistem:</span>
            <span className={backendStatus === 'online' ? 'text-[#47C826]' : 'text-[#D97706]'}>
              {backendStatus === 'online' ? 'Backend Aktif' : 'Backend Offline'}
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#47C826]/20 text-[#47C826] border border-[#47C826]/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#47C826]' : 'text-[#AA8BAD]'}`} />
                {item.label}
              </Link>
            );
          })}

          {user && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-[#AA8BAD]">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
