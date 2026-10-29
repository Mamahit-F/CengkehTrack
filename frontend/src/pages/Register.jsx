import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, User as UserIcon, Phone, MapPin, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi Client-side
    if (!formData.name.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email wajib diisi.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password minimal harus 8 karakter.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });
      navigate('/');
    } catch (err) {
      if (err.isNetworkError) {
        setError(
          'Tidak dapat terhubung ke Backend (port 8080). Pastikan backend aktif atau gunakan mode demo di halaman login.'
        );
      } else if (err.errors) {
        setFieldErrors(err.errors);
        setError('Terdapat kesalahan input pada form.');
      } else {
        setError(err.message || 'Registrasi gagal. Silakan coba kembali.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#47C826] to-[#257513] shadow-lg shadow-[#47C826]/30 mb-4">
            <Sprout className="w-9 h-9 text-[#0F1E0F]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Daftar Akun <span className="text-[#47C826]">CengkihTrack</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#AA8BAD] mt-1">
            Mulai kelola perkebunan cengkih Anda secara digital & terstruktur
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase tracking-wider mb-1.5">
                Nama Lengkap *
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="I Ketut Arya"
                  required
                  className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm"
                />
              </div>
              {fieldErrors.name && <p className="text-[11px] text-red-400 mt-1">{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase tracking-wider mb-1.5">
                Alamat Email *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="arya@petanicengkih.id"
                  required
                  className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm"
                />
              </div>
              {fieldErrors.email && <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase tracking-wider mb-1.5">
                  Kata Sandi (Min 8 Karakter) *
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
                    className="glass-input w-full pl-11 pr-10 py-2.5 rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AA8BAD] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-[11px] text-red-400 mt-1">{fieldErrors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase tracking-wider mb-1.5">
                  Ulangi Kata Sandi *
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Nomor Telepon & Alamat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase tracking-wider mb-1.5">
                  Nomor HP / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD]" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase tracking-wider mb-1.5">
                  Wilayah / Domisili
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD]" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Buleleng, Bali"
                    className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Daftarkan Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#AA8BAD] mt-6">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-[#47C826] hover:underline font-semibold">
              Masuk di sini
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
