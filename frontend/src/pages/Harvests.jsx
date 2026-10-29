import React, { useState, useEffect } from 'react';
import { Wheat, Plus, Calendar, Layers, Edit2, Trash2, X, AlertCircle, CheckCircle2, Filter, Search, Trees } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { harvestService, gardenService } from '../services/api';
import { DEMO_HARVESTS, DEMO_GARDENS } from '../services/demoData';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { BackendOfflineAlert } from '../components/BackendOfflineAlert';

export const Harvests = () => {
  const { isDemoMode } = useAuth();

  const [harvests, setHarvests] = useState([]);
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGardenFilter, setSelectedGardenFilter] = useState('');

  const [formData, setFormData] = useState({
    gardenId: '',
    harvestDate: new Date().toISOString().split('T')[0],
    quantityLiters: '',
    qualityGrade: 'Grade A (Super)',
    notes: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);

    if (isDemoMode) {
      setTimeout(() => {
        setHarvests(DEMO_HARVESTS);
        setGardens(DEMO_GARDENS);
        setLoading(false);
      }, 250);
      return;
    }

    try {
      const [harvestRes, gardenRes] = await Promise.all([
        harvestService.getAll(),
        gardenService.getAll(),
      ]);
      setHarvests(harvestRes.data || []);
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

  const handleOpenModal = (harvest = null) => {
    if (harvest) {
      setEditingHarvest(harvest);
      setFormData({
        gardenId: harvest.gardenId?.toString() || '',
        harvestDate: harvest.harvestDate || '',
        quantityLiters: harvest.quantityLiters?.toString() || '',
        qualityGrade: harvest.qualityGrade || 'Grade A (Super)',
        notes: harvest.notes || '',
      });
    } else {
      setEditingHarvest(null);
      setFormData({
        gardenId: gardens.length > 0 ? gardens[0].id.toString() : '',
        harvestDate: new Date().toISOString().split('T')[0],
        quantityLiters: '',
        qualityGrade: 'Grade A (Super)',
        notes: '',
      });
    }
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingHarvest(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.gardenId) {
      setFormError('Silakan pilih kebun tempat pemetikan');
      return;
    }
    if (!formData.harvestDate) {
      setFormError('Tanggal panen wajib diisi');
      return;
    }
    if (!formData.quantityLiters || parseFloat(formData.quantityLiters) <= 0) {
      setFormError('Jumlah panen harus lebih dari 0 liter');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    const payload = {
      gardenId: parseInt(formData.gardenId, 10),
      harvestDate: formData.harvestDate,
      quantityLiters: parseFloat(formData.quantityLiters),
      qualityGrade: formData.qualityGrade,
      notes: formData.notes.trim(),
    };

    const gardenName = gardens.find(g => g.id.toString() === formData.gardenId)?.name || 'Kebun Cengkih';

    if (isDemoMode) {
      setTimeout(() => {
        if (editingHarvest) {
          setHarvests(harvests.map(h => h.id === editingHarvest.id ? { ...h, ...payload, gardenName } : h));
          setSuccessMessage('Catatan panen berhasil diperbarui (Simulasi DEMO)');
        } else {
          const newRecord = {
            id: Date.now(),
            ...payload,
            gardenName,
            createdAt: new Date().toISOString(),
          };
          setHarvests([newRecord, ...harvests]);
          setSuccessMessage('Catatan panen baru berhasil disimpan (Simulasi DEMO)');
        }
        setFormSubmitting(false);
        handleCloseModal();
        setTimeout(() => setSuccessMessage(''), 4000);
      }, 300);
      return;
    }

    try {
      if (editingHarvest) {
        await harvestService.update(editingHarvest.id, payload);
        setSuccessMessage('Catatan panen berhasil diperbarui.');
      } else {
        await harvestService.create(payload);
        setSuccessMessage('Catatan panen berhasil ditambahkan.');
      }
      handleCloseModal();
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan catatan panen.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus catatan panen ini?')) return;

    if (isDemoMode) {
      setHarvests(harvests.filter(h => h.id !== id));
      setSuccessMessage('Catatan panen berhasil dihapus (Simulasi DEMO)');
      setTimeout(() => setSuccessMessage(''), 4000);
      return;
    }

    try {
      await harvestService.delete(id);
      setSuccessMessage('Catatan panen berhasil dihapus.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Gagal menghapus catatan panen.');
    }
  };

  // Filter & Search Logic
  const filteredHarvests = harvests.filter((item) => {
    const matchesSearch = 
      (item.gardenName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.qualityGrade || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGarden = selectedGardenFilter === '' || item.gardenId?.toString() === selectedGardenFilter;

    return matchesSearch && matchesGarden;
  });

  const totalFilteredLiters = filteredHarvests.reduce(
    (acc, cur) => acc + (parseFloat(cur.quantityLiters) || 0),
    0
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pencatatan Panen Cengkih
            </h1>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 uppercase tracking-wider">
                DEMO PREVIEW
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#AA8BAD] mt-1">
            Catat hasil petikan bunga cengkih dalam satuan <strong>LITER</strong> secara teliti per kebun
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#47C826]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Panen Baru</span>
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

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AA8BAD]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kebun, grade, atau catatan..."
              className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#AA8BAD]" />
            <select
              value={selectedGardenFilter}
              onChange={(e) => setSelectedGardenFilter(e.target.value)}
              className="glass-input px-3 py-2 rounded-xl text-xs bg-[#0F1E0F]"
            >
              <option value="">Semua Kebun</option>
              {gardens.map((g) => (
                <option key={g.id} value={g.id.toString()}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Total Liters Display */}
        <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 shrink-0">
          <span className="text-[#AA8BAD]">Total Hasil Panen Terfilter:</span>
          <span className="text-base text-[#47C826] font-bold">
            {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(totalFilteredLiters)}
          </span>
          <span className="text-white">Liter</span>
        </div>
      </div>

      {/* Table / List */}
      {loading ? (
        <LoadingSpinner text="Memuat riwayat pemetikan cengkih..." />
      ) : filteredHarvests.length === 0 ? (
        <EmptyState
          icon={Wheat}
          title="Tidak Ada Catatan Panen"
          description={searchTerm || selectedGardenFilter ? "Tidak ada panen yang cocok dengan filter pencarian." : "Belum ada hasil panen yang dicatat. Klik tombol di atas untuk mencatat panen perdana."}
          actionLabel="Catat Panen Sekarang"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border-white/10 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/[0.04] border-b border-white/10 text-[#AA8BAD] uppercase font-semibold">
                  <th className="py-3.5 px-4">Tanggal Panen</th>
                  <th className="py-3.5 px-4">Lokasi Kebun</th>
                  <th className="py-3.5 px-4">Grade Kualitas</th>
                  <th className="py-3.5 px-4 text-right">Jumlah (LITER)</th>
                  <th className="py-3.5 px-4">Catatan Petik</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHarvests.map((record) => (
                  <tr key={record.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#47C826]" />
                        <span>{record.harvestDate}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-200">
                      {record.gardenName || `Kebun #${record.gardenId}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#47C826]/15 text-[#47C826] border border-[#47C826]/30">
                        {record.qualityGrade || 'Standar'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white text-sm whitespace-nowrap">
                      <span className="text-[#47C826]">{record.quantityLiters}</span>
                      <span className="text-[#AA8BAD] text-xs ml-1">L</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#AA8BAD] max-w-xs truncate">
                      {record.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenModal(record)}
                          className="p-1.5 rounded-lg text-[#AA8BAD] hover:text-white hover:bg-white/10 cursor-pointer"
                          title="Edit Catatan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-1.5 rounded-lg text-[#AA8BAD] hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                          title="Hapus Catatan"
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

      {/* Modal Catat Panen */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl relative border-white/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wheat className="w-5 h-5 text-[#47C826]" />
                {editingHarvest ? 'Ubah Catatan Panen' : 'Catat Panen Cengkih'}
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
              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                  Kebun Asal Panen *
                </label>
                <select
                  value={formData.gardenId}
                  onChange={(e) => setFormData({ ...formData, gardenId: e.target.value })}
                  required
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm bg-[#0F1E0F]"
                >
                  <option value="">Pilih Kebun</option>
                  {gardens.map((g) => (
                    <option key={g.id} value={g.id.toString()}>
                      {g.name} ({g.areaHectares} Ha)
                    </option>
                  ))}
                </select>
                {gardens.length === 0 && (
                  <p className="text-[11px] text-amber-300 mt-1">
                    * Belum ada kebun terdaftar. Daftarkan kebun terlebih dahulu di menu Data Kebun.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                    Tanggal Pemetikan *
                  </label>
                  <input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                    required
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                    Jumlah Panen (LITER) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.quantityLiters}
                    onChange={(e) => setFormData({ ...formData, quantityLiters: e.target.value })}
                    placeholder="Contoh: 150.5"
                    required
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                  Grade Kualitas Bunga Cengkih
                </label>
                <select
                  value={formData.qualityGrade}
                  onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm bg-[#0F1E0F]"
                >
                  <option value="Grade A (Super)">Grade A (Super - Matang Sempurna, Bunga Utuh)</option>
                  <option value="Grade B (Standar)">Grade B (Standar - Sedikit Daun/Tangkai)</option>
                  <option value="Grade C (Campur)">Grade C (Campur / Bunga Muda)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Kondisi cuaca saat petik, nama regu buruh petik, dsb."
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
                  {formSubmitting ? 'Menyimpan...' : editingHarvest ? 'Simpan Perubahan' : 'Catat Panen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
