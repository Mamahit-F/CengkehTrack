import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Lock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Save,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Profile = () => {
  const { user, updateUser, isDemoMode } = useAuth();

  const [loading, setLoading] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProfile(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (isDemoMode) {
      setTimeout(() => {
        const updated = { ...user, ...profileData };
        updateUser(updated);
        setSuccessMessage('Profil berhasil diperbarui (Simulasi DEMO)');
        setSubmittingProfile(false);
        setTimeout(() => setSuccessMessage(''), 4000);
      }, 300);
      return;
    }

    try {
      const res = await authService.updateProfile(profileData);
      if (res.data) {
        updateUser(res.data);
        setSuccessMessage('Profil Anda berhasil diperbarui.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal memperbarui profil.');
    } finally {
      setSubmittingProfile(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMessage('');

    if (!passwordData.currentPassword) {
      setPasswordError('Password saat ini wajib diisi');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password baru minimal 8 karakter');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('Konfirmasi password baru tidak cocok');
      return;
    }

    setSubmittingPassword(true);

    if (isDemoMode) {
      setTimeout(() => {
        setSuccessMessage('Password berhasil diubah (Simulasi DEMO)');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setSubmittingPassword(false);
        setTimeout(() => setSuccessMessage(''), 4000);
      }, 300);
      return;
    }

    try {
      await authService.updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccessMessage('Kata sandi berhasil diperbarui.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Gagal memperbarui kata sandi.');
    } finally {
      setSubmittingPassword(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profil Pengguna
          </h1>
          {isDemoMode && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 uppercase tracking-wider">
              DEMO PREVIEW
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[#AA8BAD] mt-1">
          Kelola informasi identitas akun petani dan keamanan akses sistem
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-[#47C826] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 border-white/10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#47C826] to-[#257513] flex items-center justify-center text-[#0F1E0F] font-black text-2xl shadow-xl shadow-[#47C826]/20 shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
        </div>
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-white">{user?.name || 'Petani Cengkih'}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#47C826]/15 text-[#47C826] border border-[#47C826]/30 self-center sm:self-auto">
              <Shield className="w-3 h-3" />
              {user?.role || 'USER'}
            </span>
          </div>
          <p className="text-xs text-[#AA8BAD] flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email}</span>
          </p>
          {user?.createdAt && (
            <p className="text-[11px] text-[#AA8BAD] flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Terdaftar sejak: {new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form Biodata */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/10 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <UserIcon className="w-4 h-4 text-[#47C826]" />
            Informasi Data Diri
          </h3>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="08123456789"
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                Wilayah Domisili
              </label>
              <textarea
                rows="2"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                placeholder="Desa Munduk, Kec. Banjar, Buleleng"
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingProfile}
              className="btn-primary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{submittingProfile ? 'Menyimpan...' : 'Perbarui Profil'}</span>
            </button>
          </form>
        </div>

        {/* Form Ganti Password */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/10 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <KeyRound className="w-4 h-4 text-[#D97706]" />
            Ganti Kata Sandi
          </h3>

          {passwordError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                Kata Sandi Saat Ini
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="••••••••"
                required
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                Kata Sandi Baru (Min 8 Karakter)
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="••••••••"
                required
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                Ulangi Kata Sandi Baru
              </label>
              <input
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                placeholder="••••••••"
                required
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submittingPassword}
              className="btn-secondary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer text-amber-300 hover:text-white disabled:opacity-50 mt-6"
            >
              <Lock className="w-4 h-4" />
              <span>{submittingPassword ? 'Memproses...' : 'Ubah Kata Sandi'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
