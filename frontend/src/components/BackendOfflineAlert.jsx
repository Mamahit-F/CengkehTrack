import React from 'react';
import { AlertCircle, RefreshCw, Eye, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BackendOfflineAlert = ({ onRetry, message }) => {
  const { enableDemoMode, isDemoMode, checkBackendStatus } = useAuth();

  const handleRetry = async () => {
    await checkBackendStatus();
    if (onRetry) onRetry();
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border-amber-500/30 bg-amber-950/20 mb-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#D97706]/20 text-[#D97706] mt-0.5">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              Koneksi Backend / Database Belum Terhubung
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Informasi
              </span>
            </h4>
            <p className="text-xs text-[#AA8BAD] mt-1 max-w-2xl leading-relaxed">
              {message || 
                'Backend Spring Boot atau database PostgreSQL saat ini belum aktif pada http://localhost:8080. Ini adalah kondisi normal karena database akan disiapkan pada tahap berikutnya.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto self-end sm:self-center shrink-0">
          <button
            onClick={handleRetry}
            className="btn-secondary px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 hover:text-white cursor-pointer"
            title="Coba hubungkan kembali ke backend"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Lagi
          </button>

          {!isDemoMode && (
            <button
              onClick={enableDemoMode}
              className="btn-primary px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Aktifkan tampilan demonstrasi antarmuka"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Demo Mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
