import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Wheat, 
  BadgePercent, 
  DollarSign, 
  Filter, 
  ArrowDownRight, 
  Info,
  Layers,
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/api';
import { DEMO_HARVESTS, DEMO_SALES } from '../services/demoData';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BackendOfflineAlert } from '../components/BackendOfflineAlert';

export const Reports = () => {
  const { isDemoMode } = useAuth();

  // Periode default: 6 bulan terakhir s.d hari ini
  const getDefaultDates = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 5);
    start.setDate(1);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'harvests' | 'sales'

  const [reportData, setReportData] = useState({
    startDate: defaultDates.start,
    endDate: defaultDates.end,
    totalHarvestLiters: 0,
    harvestCount: 0,
    totalRevenue: 0,
    totalSoldLiters: 0,
    saleCount: 0,
    harvests: [],
    sales: [],
  });

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

  const loadReport = async () => {
    setLoading(true);
    setError(null);

    if (isDemoMode) {
      setTimeout(() => {
        // Filter demo data berdasarkan rentang tanggal
        const filteredHarvests = DEMO_HARVESTS.filter(
          (h) => h.harvestDate >= startDate && h.harvestDate <= endDate
        );
        const filteredSales = DEMO_SALES.filter(
          (s) => s.saleDate >= startDate && s.saleDate <= endDate
        );

        const totalHarvestLiters = filteredHarvests.reduce(
          (acc, h) => acc + (parseFloat(h.quantityLiters) || 0),
          0
        );
        const totalRevenue = filteredSales.reduce(
          (acc, s) => acc + (parseFloat(s.totalPrice) || 0),
          0
        );
        const totalSoldLiters = filteredSales.reduce(
          (acc, s) => acc + (parseFloat(s.quantityLiters) || 0),
          0
        );

        setReportData({
          startDate,
          endDate,
          totalHarvestLiters,
          harvestCount: filteredHarvests.length,
          totalRevenue,
          totalSoldLiters,
          saleCount: filteredSales.length,
          harvests: filteredHarvests,
          sales: filteredSales,
        });
        setLoading(false);
      }, 300);
      return;
    }

    try {
      const res = await reportService.getReport(startDate, endDate);
      setReportData(res.data || {
        startDate,
        endDate,
        totalHarvestLiters: 0,
        harvestCount: 0,
        totalRevenue: 0,
        totalSoldLiters: 0,
        saleCount: 0,
        harvests: [],
        sales: [],
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [startDate, endDate, isDemoMode]);

  // Rasio Penjualan vs Panen dalam persentase
  const absorptionRate = reportData.totalHarvestLiters > 0
    ? Math.min(100, Math.round((reportData.totalSoldLiters / reportData.totalHarvestLiters) * 100))
    : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Laporan Hasil & Penjualan Cengkih
            </h1>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 uppercase tracking-wider">
                DEMO PREVIEW
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#AA8BAD] mt-1">
            Analisis komprehensif volume produksi (Liter) dan pendapatan kotor transaksi dalam periode terpilih
          </p>
        </div>
      </div>

      {error && (
        <BackendOfflineAlert onRetry={loadReport} message={error.message} />
      )}

      {/* Filter Tanggal Periode */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#AA8BAD]">
            <Filter className="w-4 h-4 text-[#47C826]" />
            <span>Pilih Periode:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="glass-input px-3 py-1.5 rounded-xl text-xs"
            />
            <span className="text-xs text-[#AA8BAD]">s.d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="glass-input px-3 py-1.5 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Tab switch untuk rincian */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-[#47C826] text-black font-bold'
                : 'text-[#AA8BAD] hover:text-white'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab('harvests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'harvests'
                ? 'bg-[#47C826] text-black font-bold'
                : 'text-[#AA8BAD] hover:text-white'
            }`}
          >
            Panen ({reportData.harvestCount})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'sales'
                ? 'bg-[#47C826] text-black font-bold'
                : 'text-[#AA8BAD] hover:text-white'
            }`}
          >
            Penjualan ({reportData.saleCount})
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Mengkalkulasi laporan perkebunan cengkih..." />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Volume Panen Periode"
              value={formatNumber(reportData.totalHarvestLiters)}
              unit="Liter"
              subtitle={`${reportData.harvestCount} kali pemetikan`}
              icon={Wheat}
              accent="green"
            />

            <StatCard
              title="Volume Penjualan"
              value={formatNumber(reportData.totalSoldLiters)}
              unit="Liter"
              subtitle={`${reportData.saleCount} transaksi`}
              icon={BadgePercent}
              accent="emerald"
            />

            <StatCard
              title="Total Pendapatan"
              value={formatRupiah(reportData.totalRevenue)}
              subtitle="Pendapatan bruto penjualan"
              icon={DollarSign}
              accent="orange"
            />

            <StatCard
              title="Rasio Terjual / Panen"
              value={`${absorptionRate}%`}
              subtitle="Dari total volume panen periode"
              icon={BarChart3}
              accent="green"
            />
          </div>

          {/* Penjelasan Tegas: Pendapatan vs Keuntungan */}
          <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 bg-emerald-950/20 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#47C826]/20 text-[#47C826] shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">
                Perbedaan Pendapatan Penjualan vs Keuntungan Bersih
              </h4>
              <p className="text-[#AA8BAD] leading-relaxed">
                Angka <span className="text-white font-medium">{formatRupiah(reportData.totalRevenue)}</span> di atas adalah <strong className="text-emerald-300">Total Pendapatan Penjualan (Gross Revenue)</strong>. Sistem CengkihTrack secara transparan <strong className="text-white">tidak menyebutnya sebagai keuntungan</strong> karena biaya operasional kebun (seperti upah buruh pemetik harian, biaya pemupukan, pestisida organik, dan biaya logistik transportasi) belum dimasukkan ke dalam modul pembukuan biaya.
              </p>
            </div>
          </div>

          {/* Visual Progress Bar Chart: Distribusi Volume Panen vs Penjualan */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#47C826]" />
              Visualisasi Volume: Produksi Panen vs Penjualan Cengkih (Liter)
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#AA8BAD]">Volume Bunga Cengkih Dipetik:</span>
                  <span className="font-bold text-[#47C826]">{formatNumber(reportData.totalHarvestLiters)} Liter</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#257513] to-[#47C826] rounded-full transition-all duration-500"
                    style={{ width: reportData.totalHarvestLiters > 0 ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#AA8BAD]">Volume Cengkih Terjual ke Pasar / Pengepul:</span>
                  <span className="font-bold text-[#D97706]">{formatNumber(reportData.totalSoldLiters)} Liter</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#92400e] to-[#D97706] rounded-full transition-all duration-500"
                    style={{
                      width: reportData.totalHarvestLiters > 0
                        ? `${Math.min(100, (reportData.totalSoldLiters / reportData.totalHarvestLiters) * 100)}%`
                        : '0%',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Transaksi Sesuai Tab */}
          {(activeTab === 'all' || activeTab === 'harvests') && (
            <div className="glass-panel rounded-2xl overflow-hidden border-white/10 shadow-xl">
              <div className="p-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-[#47C826]" />
                  Rincian Panen dalam Periode ({reportData.harvests?.length || 0} Catatan)
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] border-b border-white/10 text-[#AA8BAD]">
                    <tr>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Kebun</th>
                      <th className="py-3 px-4">Grade</th>
                      <th className="py-3 px-4 text-right">Volume</th>
                      <th className="py-3 px-4">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(reportData.harvests || []).length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-[#AA8BAD]">
                          Tidak ada catatan panen pada periode ini.
                        </td>
                      </tr>
                    ) : (
                      reportData.harvests.map((h) => (
                        <tr key={h.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 text-white whitespace-nowrap">{h.harvestDate}</td>
                          <td className="py-3 px-4 text-emerald-300 font-semibold">{h.gardenName || `#${h.gardenId}`}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-[#47C826]">
                              {h.qualityGrade || 'Standar'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-[#47C826] whitespace-nowrap">
                            {formatNumber(h.quantityLiters)} L
                          </td>
                          <td className="py-3 px-4 text-[#AA8BAD] truncate max-w-xs">{h.notes || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'sales') && (
            <div className="glass-panel rounded-2xl overflow-hidden border-white/10 shadow-xl">
              <div className="p-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-[#D97706]" />
                  Rincian Penjualan dalam Periode ({reportData.sales?.length || 0} Transaksi)
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] border-b border-white/10 text-[#AA8BAD]">
                    <tr>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Pembeli</th>
                      <th className="py-3 px-4 text-right">Volume</th>
                      <th className="py-3 px-4 text-right">Harga / Liter</th>
                      <th className="py-3 px-4 text-right">Total Transaksi</th>
                      <th className="py-3 px-4">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(reportData.sales || []).length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-[#AA8BAD]">
                          Tidak ada transaksi penjualan pada periode ini.
                        </td>
                      </tr>
                    ) : (
                      reportData.sales.map((s) => (
                        <tr key={s.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 text-white whitespace-nowrap">{s.saleDate}</td>
                          <td className="py-3 px-4 font-semibold text-white">{s.buyerName || 'Pembeli Umum'}</td>
                          <td className="py-3 px-4 text-right font-bold text-[#47C826] whitespace-nowrap">
                            {formatNumber(s.quantityLiters)} L
                          </td>
                          <td className="py-3 px-4 text-right text-[#AA8BAD] whitespace-nowrap">
                            {formatRupiah(s.pricePerLiter)}
                          </td>
                          <td className="py-3 px-4 text-right font-extrabold text-white whitespace-nowrap">
                            {formatRupiah(s.totalPrice)}
                          </td>
                          <td className="py-3 px-4 text-[#AA8BAD] truncate max-w-xs">{s.notes || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </>
      )}

    </div>
  );
};
