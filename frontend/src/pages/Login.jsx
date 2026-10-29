import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login, enableDemoMode, backendStatus } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get('expired') ? 'Sesi Anda telah berakhir. Silakan login kembali.' : ''
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      if (err.isNetworkError) {
        setError(
          'Tidak dapat terhubung ke Backend (port 8080). Anda dapat mencoba menggunakan Mode Demo untuk melihat antarmuka.'
        );
      } else {
        setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    enableDemoMode();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Logo Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#47C826] to-[#257513] shadow-lg shadow-[#47C826]/30 mb-4">
            <Sprout className="w-9 h-9 text-[#0F1E0F]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Masuk ke <span className="text-[#47C826]">CengkihTrack</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#AA8BAD] mt-1">
            Sistem Pencatatan Hasil Panen & Penjualan Cengkih
          </p>
        </div>

        {/* Form Glassmorphism Card */}
        <div className="glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase tracking-wider mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@kebuncengkih.id"
                  required
                  className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="glass-input w-full pl-11 pr-11 py-3 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Masuk Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#0F1E0F]/80 text-[#AA8BAD]">atau preview antarmuka</span>
            </div>
          </div>

          {/* Tombol Demo Mode */}
          <button
            type="button"
            onClick={handleDemoClick}
            className="btn-secondary w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-emerald-300 hover:text-white cursor-pointer"
          >
            <Sprout className="w-4 h-4 text-[#47C826]" />
            <span>Lihat Tampilan dengan Data DEMO</span>
          </button>

          {/* Register Link */}
          <p className="text-center text-xs text-[#AA8BAD] mt-6">
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-[#47C826] hover:underline font-semibold">
              Daftar Sekarang
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
