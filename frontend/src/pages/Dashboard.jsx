import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trees, 
  Wheat, 
  BadgePercent, 
  DollarSign, 
  PlusCircle, 
  ArrowUpRight, 
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportService, gardenService, harvestService, saleService } from '../services/api';
import { DEMO_SUMMARY, DEMO_HARVESTS, DEMO_SALES, DEMO_GARDENS } from '../services/demoData';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BackendOfflineAlert } from '../components/BackendOfflineAlert';

export const Dashboard = () => {
  const { isDemoMode, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentHarvests, setRecentHarvests] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    if (isDemoMode) {
      // Tampilkan data simulasi visual dengan label DEMO jelas
      setTimeout(() => {
        setSummary(DEMO_SUMMARY);
        setRecentHarvests(DEMO_HARVESTS.slice(0, 4));
        setRecentSales(DEMO_SALES.slice(0, 4));
        setLoading(false);
      }, 300);
      return;
    }

    try {
      const [sumRes, harvestRes, saleRes] = await Promise.all([
        reportService.getDashboardSummary(),
        harvestService.getAll(),
        saleService.getAll(),
      ]);

      setSummary(sumRes.data || {
        totalGardens: 0,
        totalHarvestRecords: 0,
        totalHarvestLiters: 0,
        totalSales: 0,
        totalRevenue: 0,
        totalSoldLiters: 0,
      });
      setRecentHarvests((harvestRes.data || []).slice(0, 4));
      setRecentSales((saleRes.data || []).slice(0, 4));
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isDemoMode]);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang, <span className="text-[#47C826]">{user?.name || 'Petani Cengkih'}</span>
            </h1>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 uppercase tracking-wider">
                DEMO PREVIEW
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#AA8BAD] mt-1">
            Ringkasan produksi kebun dan catatan transaksi penjualan cengkih Anda
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/harvests"
            className="btn-primary px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#47C826]/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Panen</span>
          </Link>

          <Link
            to="/sales"
            className="btn-secondary px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <BadgePercent className="w-4 h-4 text-[#D97706]" />
            <span>Catat Penjualan</span>
          </Link>

          <Link
            to="/gardens"
            className="btn-secondary px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <Trees className="w-4 h-4 text-emerald-400" />
            <span>Kebun</span>
          </Link>
        </div>
      </div>

      {/* Alert jika backend belum tersambung */}
      {error && (
        <BackendOfflineAlert
          onRetry={loadDashboardData}
          message={error.message}
        />
      )}

      {loading ? (
        <LoadingSpinner text="Mengambil data dashboard kebun cengkih..." />
      ) : (
        <>
          {/* KPI Stat Cards (Wajib: Total Panen dalam LITER & Total Pendapatan) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Total Panen (LITER) */}
            <StatCard
              title="Total Panen Cengkih"
              value={formatNumber(summary?.totalHarvestLiters)}
              unit="Liter"
              subtitle={`${summary?.totalHarvestRecords || 0} catatan pemetikan`}
              icon={Wheat}
              accent="green"
            />

            {/* Total Pendapatan Penjualan */}
            <StatCard
              title="Total Pendapatan"
              value={formatRupiah(summary?.totalRevenue)}
              subtitle="Pendapatan bruto penjualan cengkih"
              icon={DollarSign}
              accent="orange"
            />

            {/* Volume Penjualan */}
            <StatCard
              title="Total Cengkih Terjual"
              value={formatNumber(summary?.totalSoldLiters)}
              unit="Liter"
              subtitle={`${summary?.totalSales || 0} transaksi berhasil`}
              icon={BadgePercent}
              accent="emerald"
            />

            {/* Kebun Aktif */}
            <StatCard
              title="Kebun Terkelola"
              value={summary?.totalGardens || 0}
              unit="Lokasi"
              subtitle="Lahan produktif aktif"
              icon={Trees}
              accent="green"
            />
          </div>

          {/* Catatan Transparansi Finansial */}
          <div className="glass-panel p-4 rounded-xl border-white/5 bg-white/[0.03] flex items-center justify-between text-xs text-[#AA8BAD]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#47C826]"></span>
              <span>
                Catatan: Total Pendapatan dihitung dari akumulasi transaksi penjualan cengkih. Nilai ini merupakan <strong className="text-white">pendapatan kotor</strong> (belum dikurangi biaya pupuk, tenaga petik, atau operasional).
              </span>
            </div>
            <Link to="/reports" className="text-[#47C826] hover:underline shrink-0 hidden md:inline-flex items-center gap-1 font-medium">
              Lihat Laporan Lengkap <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2 Kolom: Aktivitas Panen Terkini & Penjualan Terkini */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Riwayat Panen Terbaru */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-[#47C826]" />
                  <h2 className="text-base font-bold text-white">Panen Terakhir</h2>
                </div>
                <Link to="/harvests" className="text-xs text-[#47C826] hover:underline flex items-center gap-1">
                  Semua Catatan <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentHarvests.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#AA8BAD]">
                  Belum ada catatan panen cengkih.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentHarvests.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/5"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-white">
                          {h.gardenName || `Kebun #${h.gardenId}`}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#AA8BAD]">
                          <Calendar className="w-3 h-3" />
                          <span>{h.harvestDate}</span>
                          {h.qualityGrade && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-emerald-300">
                              {h.qualityGrade}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#47C826]">
                          {formatNumber(h.quantityLiters)}
                        </span>
                        <span className="text-xs text-[#AA8BAD] ml-1">Liter</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Riwayat Penjualan Terbaru */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BadgePercent className="w-5 h-5 text-[#D97706]" />
                  <h2 className="text-base font-bold text-white">Penjualan Terakhir</h2>
                </div>
                <Link to="/sales" className="text-xs text-[#D97706] hover:underline flex items-center gap-1">
                  Semua Penjualan <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentSales.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#AA8BAD]">
                  Belum ada transaksi penjualan yang tercatat.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSales.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/5"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-white">
                          {s.buyerName || 'Pembeli Umum'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#AA8BAD]">
                          <Calendar className="w-3 h-3" />
                          <span>{s.saleDate}</span>
                          <span>•</span>
                          <span>{formatNumber(s.quantityLiters)} Liter</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">
                          {formatRupiah(s.totalPrice)}
                        </span>
                        <p className="text-[10px] text-[#AA8BAD]">
                          @{formatRupiah(s.pricePerLiter)}/L
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </>
      )}

    </div>
  );
};
