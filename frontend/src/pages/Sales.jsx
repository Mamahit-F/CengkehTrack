import React, { useState, useEffect } from 'react';
import { 
  BadgePercent, 
  Plus, 
  Calendar, 
  DollarSign, 
  User, 
  Edit2, 
  Trash2, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Calculator,
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saleService, gardenService } from '../services/api';
import { DEMO_SALES, DEMO_GARDENS } from '../services/demoData';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { BackendOfflineAlert } from '../components/BackendOfflineAlert';

export const Sales = () => {
  const { isDemoMode } = useAuth();

  const [sales, setSales] = useState([]);
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    gardenId: '',
    saleDate: new Date().toISOString().split('T')[0],
    buyerName: '',
    quantityLiters: '',
    pricePerLiter: '',
    notes: '',
  });

  // Kalkulasi otomatis di UI berdasarkan jumlah liter dikalikan harga per liter
  const calculatedTotal = React.useMemo(() => {
    const qty = parseFloat(formData.quantityLiters) || 0;
    const price = parseFloat(formData.pricePerLiter) || 0;
    return qty * price;
  }, [formData.quantityLiters, formData.pricePerLiter]);

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

  const loadData = async () => {
    setLoading(true);
    setError(null);

    if (isDemoMode) {
      setTimeout(() => {
        setSales(DEMO_SALES);
        setGardens(DEMO_GARDENS);
        setLoading(false);
      }, 250);
      return;
    }

    try {
      const [saleRes, gardenRes] = await Promise.all([
        saleService.getAll(),
        gardenService.getAll(),
      ]);
      setSales(saleRes.data || []);
      setGardens(gardenRes.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isDemoMode]);

  const handleOpenModal = (sale = null) => {
    if (sale) {
      setEditingSale(sale);
      setFormData({
        gardenId: sale.gardenId ? sale.gardenId.toString() : '',
        saleDate: sale.saleDate || '',
        buyerName: sale.buyerName || '',
        quantityLiters: sale.quantityLiters ? sale.quantityLiters.toString() : '',
        pricePerLiter: sale.pricePerLiter ? sale.pricePerLiter.toString() : '',
        notes: sale.notes || '',
      });
    } else {
      setEditingSale(null);
      setFormData({
        gardenId: gardens.length > 0 ? gardens[0].id.toString() : '',
        saleDate: new Date().toISOString().split('T')[0],
        buyerName: '',
        quantityLiters: '',
        pricePerLiter: '',
        notes: '',
      });
    }
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSale(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.saleDate) {
      setFormError('Tanggal penjualan wajib diisi');
      return;
    }
    if (!formData.quantityLiters || parseFloat(formData.quantityLiters) <= 0) {
      setFormError('Jumlah liter cengkih harus lebih dari 0');
      return;
    }
    if (!formData.pricePerLiter || parseFloat(formData.pricePerLiter) < 0) {
      setFormError('Harga per liter tidak boleh kosong atau negatif');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    // Catatan: frontend HANYA mengirim quantityLiters dan pricePerLiter.
    // Backend menghitung ulang totalPrice di server untuk keamanan integritas data finansial.
    const payload = {
      gardenId: formData.gardenId ? parseInt(formData.gardenId, 10) : null,
      saleDate: formData.saleDate,
      buyerName: formData.buyerName.trim(),
      quantityLiters: parseFloat(formData.quantityLiters),
      pricePerLiter: parseFloat(formData.pricePerLiter),
      notes: formData.notes.trim(),
    };

    const gardenName = formData.gardenId
      ? gardens.find((g) => g.id.toString() === formData.gardenId)?.name
      : null;

    if (isDemoMode) {
      setTimeout(() => {
        const computed = payload.quantityLiters * payload.pricePerLiter;
        if (editingSale) {
          setSales(
            sales.map((s) =>
              s.id === editingSale.id
                ? { ...s, ...payload, gardenName, totalPrice: computed }
                : s
            )
          );
          setSuccessMessage('Data penjualan berhasil diperbarui (Simulasi DEMO)');
        } else {
          const newSale = {
            id: Date.now(),
            ...payload,
            gardenName,
            totalPrice: computed,
            createdAt: new Date().toISOString(),
          };
          setSales([newSale, ...sales]);
          setSuccessMessage('Penjualan baru berhasil dicatat (Simulasi DEMO)');
        }
        setFormSubmitting(false);
        handleCloseModal();
        setTimeout(() => setSuccessMessage(''), 4000);
      }, 300);
      return;
    }

    try {
      if (editingSale) {
        await saleService.update(editingSale.id, payload);
        setSuccessMessage('Penjualan berhasil diperbarui.');
      } else {
        await saleService.create(payload);
        setSuccessMessage('Penjualan baru berhasil dicatat.');
      }
      handleCloseModal();
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan transaksi penjualan.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus catatan penjualan ini?')) return;

    if (isDemoMode) {
      setSales(sales.filter((s) => s.id !== id));
      setSuccessMessage('Penjualan berhasil dihapus (Simulasi DEMO)');
      setTimeout(() => setSuccessMessage(''), 4000);
      return;
    }

    try {
      await saleService.delete(id);
      setSuccessMessage('Penjualan berhasil dihapus.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Gagal menghapus transaksi penjualan.');
    }
  };

  const filteredSales = sales.filter((item) => {
    return (
      (item.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.gardenName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalFilteredRevenue = filteredSales.reduce(
    (acc, cur) => acc + (parseFloat(cur.totalPrice) || 0),
    0
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Penjualan & Transaksi Cengkih
            </h1>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 uppercase tracking-wider">
                DEMO PREVIEW
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#AA8BAD] mt-1">
            Catat hasil penjualan cengkih per liter dengan kalkulasi otomatis dan validasi server terpusat
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#47C826]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Penjualan Baru</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-[#47C826] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <BackendOfflineAlert onRetry={loadData} message={error.message} />
      )}

      {/* Filter and Summary Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pembeli, kebun, atau catatan..."
            className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 shrink-0">
          <span className="text-[#AA8BAD]">Total Pendapatan Terfilter:</span>
          <span className="text-base text-[#D97706] font-bold">
            {formatRupiah(totalFilteredRevenue)}
          </span>
        </div>
      </div>

      {/* Table / List */}
      {loading ? (
        <LoadingSpinner text="Memuat riwayat transaksi penjualan cengkih..." />
      ) : filteredSales.length === 0 ? (
        <EmptyState
          icon={BadgePercent}
          title="Belum Ada Transaksi Penjualan"
          description={searchTerm ? "Tidak ada penjualan yang cocok dengan pencarian." : "Belum ada catatan penjualan bunga cengkih. Catat transaksi penjualan pertama Anda."}
          actionLabel="Catat Penjualan Sekarang"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border-white/10 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/[0.04] border-b border-white/10 text-[#AA8BAD] uppercase font-semibold">
                  <th className="py-3.5 px-4">Tanggal Jual</th>
                  <th className="py-3.5 px-4">Nama Pembeli / Pengepul</th>
                  <th className="py-3.5 px-4">Asal Kebun</th>
                  <th className="py-3.5 px-4 text-right">Volume (LITER)</th>
                  <th className="py-3.5 px-4 text-right">Harga / Liter</th>
                  <th className="py-3.5 px-4 text-right">Total Transaksi</th>
                  <th className="py-3.5 px-4">Catatan</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>{sale.saleDate}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {sale.buyerName || 'Pembeli Umum (Tunai)'}
                    </td>
                    <td className="py-3.5 px-4 text-[#AA8BAD]">
                      {sale.gardenName || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white whitespace-nowrap">
                      <span className="text-[#47C826]">{formatNumber(sale.quantityLiters)}</span>
                      <span className="text-[#AA8BAD] text-xs ml-1">L</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-300 whitespace-nowrap">
                      {formatRupiah(sale.pricePerLiter)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-white text-sm whitespace-nowrap">
                      {formatRupiah(sale.totalPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-[#AA8BAD] max-w-xs truncate">
                      {sale.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenModal(sale)}
                          className="p-1.5 rounded-lg text-[#AA8BAD] hover:text-white hover:bg-white/10 cursor-pointer"
                          title="Edit Penjualan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id)}
                          className="p-1.5 rounded-lg text-[#AA8BAD] hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                          title="Hapus Penjualan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form Penjualan */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl relative border-white/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-[#D97706]" />
                {editingSale ? 'Ubah Catatan Penjualan' : 'Catat Penjualan Cengkih'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-[#AA8BAD] hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                    Tanggal Transaksi *
                  </label>
                  <input
                    type="date"
                    value={formData.saleDate}
                    onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                    required
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                    Asal Kebun (Opsional)
                  </label>
                  <select
                    value={formData.gardenId}
                    onChange={(e) => setFormData({ ...formData, gardenId: e.target.value })}
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm bg-[#0F1E0F]"
                  >
                    <option value="">Tidak Ditentukan / Campuran</option>
                    {gardens.map((g) => (
                      <option key={g.id} value={g.id.toString()}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                  Nama Pembeli / Pedagang Pengepul
                </label>
                <input
                  type="text"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  placeholder="Contoh: UD Sumber Makmur (Pengepul Singaraja)"
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                    Jumlah Dijual (LITER) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.quantityLiters}
                    onChange={(e) => setFormData({ ...formData, quantityLiters: e.target.value })}
                    placeholder="Contoh: 100"
                    required
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                    Harga / Liter (Rp) *
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={formData.pricePerLiter}
                    onChange={(e) => setFormData({ ...formData, pricePerLiter: e.target.value })}
                    placeholder="Contoh: 75000"
                    required
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Total Otomatis Dihitung di UI */}
              <div className="p-4 rounded-xl bg-white/[0.04] border border-[#47C826]/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#AA8BAD]">
                  <span className="flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-[#47C826]" />
                    Total Otomatis (Liter × Harga):
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[#47C826]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Divalidasi ulang server
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">
                  {formatRupiah(calculatedTotal)}
                </div>
                <p className="text-[10px] text-[#AA8BAD]">
                  * Backend menghitung ulang total secara otomatis di server demi keamanan dan ketepatan data transaksi.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                  Catatan Transaksi
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Metode pembayaran (tunai/transfer), potongan susut, dsb."
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? 'Menyimpan...' : editingSale ? 'Simpan Perubahan' : 'Catat Penjualan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
