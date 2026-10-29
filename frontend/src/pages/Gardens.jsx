import React, { useState, useEffect } from 'react';
import { Trees, Plus, MapPin, Layers, Hash, Edit2, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gardenService } from '../services/api';
import { DEMO_GARDENS } from '../services/demoData';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { BackendOfflineAlert } from '../components/BackendOfflineAlert';

export const Gardens = () => {
  const { isDemoMode } = useAuth();

  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGarden, setEditingGarden] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    areaHectares: '',
    treeCount: '',
    notes: '',
  });

  const loadGardens = async () => {
    setLoading(true);
    setError(null);

    if (isDemoMode) {
      setTimeout(() => {
        setGardens(DEMO_GARDENS);
        setLoading(false);
      }, 250);
      return;
    }

    try {
      const res = await gardenService.getAll();
      setGardens(res.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGardens();
  }, [isDemoMode]);

  const handleOpenModal = (garden = null) => {
    if (garden) {
      setEditingGarden(garden);
      setFormData({
        name: garden.name || '',
        location: garden.location || '',
        areaHectares: garden.areaHectares || '',
        treeCount: garden.treeCount || '',
        notes: garden.notes || '',
      });
    } else {
      setEditingGarden(null);
      setFormData({
        name: '',
        location: '',
        areaHectares: '',
        treeCount: '',
        notes: '',
      });
    }
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingGarden(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Nama kebun wajib diisi');
      return;
    }
    if (!formData.areaHectares || parseFloat(formData.areaHectares) <= 0) {
      setFormError('Luas kebun harus lebih dari 0 hektar');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    const payload = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      areaHectares: parseFloat(formData.areaHectares),
      treeCount: formData.treeCount ? parseInt(formData.treeCount, 10) : null,
      notes: formData.notes.trim(),
    };

    if (isDemoMode) {
      setTimeout(() => {
        if (editingGarden) {
          setGardens(gardens.map(g => g.id === editingGarden.id ? { ...g, ...payload } : g));
          setSuccessMessage('Data kebun berhasil diperbarui (Simulasi DEMO)');
        } else {
          const newGarden = { id: Date.now(), ...payload, createdAt: new Date().toISOString() };
          setGardens([newGarden, ...gardens]);
          setSuccessMessage('Kebun baru berhasil ditambahkan (Simulasi DEMO)');
        }
        setFormSubmitting(false);
        handleCloseModal();
        setTimeout(() => setSuccessMessage(''), 4000);
      }, 300);
      return;
    }

    try {
      if (editingGarden) {
        await gardenService.update(editingGarden.id, payload);
        setSuccessMessage('Data kebun berhasil diperbarui.');
      } else {
        await gardenService.create(payload);
        setSuccessMessage('Kebun baru berhasil ditambahkan.');
      }
      handleCloseModal();
      loadGardens();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data kebun.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus kebun "${name}"?`)) return;

    if (isDemoMode) {
      setGardens(gardens.filter(g => g.id !== id));
      setSuccessMessage('Kebun berhasil dihapus (Simulasi DEMO)');
      setTimeout(() => setSuccessMessage(''), 4000);
      return;
    }

    try {
      await gardenService.delete(id);
      setSuccessMessage('Kebun berhasil dihapus.');
      loadGardens();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Gagal menghapus kebun.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Data Kebun Cengkih
            </h1>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 uppercase tracking-wider">
                DEMO PREVIEW
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#AA8BAD] mt-1">
            Kelola lokasi lahan perkebunan, estimasi jumlah pohon cengkih, dan luas area
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#47C826]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kebun Baru</span>
        </button>
      </div>

      {/* Pesan Sukses */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-[#47C826] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Backend Alert jika offline */}
      {error && (
        <BackendOfflineAlert onRetry={loadGardens} message={error.message} />
      )}

      {loading ? (
        <LoadingSpinner text="Memuat daftar kebun cengkih..." />
      ) : gardens.length === 0 ? (
        <EmptyState
          icon={Trees}
          title="Belum Ada Data Kebun"
          description="Anda belum mendaftarkan lahan kebun cengkih. Tambahkan kebun pertama Anda untuk mulai mencatat panen."
          actionLabel="Tambah Kebun Pertama"
          onAction={() => handleOpenModal()}
        />
      ) : (
        /* Grid Kartu Kebun yang Rapi */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gardens.map((garden) => (
            <div
              key={garden.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between border-white/10 hover:border-[#47C826]/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-[#47C826]/15 text-[#47C826]">
                      <Trees className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white line-clamp-1">
                      {garden.name}
                    </h3>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenModal(garden)}
                      className="p-1.5 rounded-lg text-[#AA8BAD] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit Kebun"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(garden.id, garden.name)}
                      className="p-1.5 rounded-lg text-[#AA8BAD] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Hapus Kebun"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lokasi */}
                <div className="flex items-center gap-1.5 text-xs text-[#AA8BAD] mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                  <span className="truncate">{garden.location || 'Lokasi belum ditentukan'}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/5 mb-4 text-xs">
                  <div>
                    <span className="text-[#AA8BAD] block text-[10px] uppercase">Luas Lahan</span>
                    <span className="text-sm font-bold text-white">{garden.areaHectares} Ha</span>
                  </div>
                  <div>
                    <span className="text-[#AA8BAD] block text-[10px] uppercase">Pohon Cengkih</span>
                    <span className="text-sm font-bold text-white">
                      {garden.treeCount ? `${garden.treeCount} Pohon` : '-'}
                    </span>
                  </div>
                </div>

                {/* Catatan */}
                {garden.notes && (
                  <p className="text-xs text-[#AA8BAD] italic line-clamp-2 mb-2">
                    "{garden.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#AA8BAD]">
                <span>ID Kebun: #{garden.id}</span>
                <span className="text-[#47C826] font-medium">Aktif Berproduksi</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah / Edit Kebun */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl relative border-white/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trees className="w-5 h-5 text-[#47C826]" />
                {editingGarden ? 'Ubah Data Kebun' : 'Tambah Kebun Baru'}
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
                  Nama Kebun *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Kebun Bukit Cengkih Utama"
                  required
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                  Lokasi / Wilayah
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Contoh: Desa Munduk, Buleleng"
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                    Luas (Hektar) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.areaHectares}
                    onChange={(e) => setFormData({ ...formData, areaHectares: e.target.value })}
                    placeholder="2.5"
                    required
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                    Jumlah Pohon
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.treeCount}
                    onChange={(e) => setFormData({ ...formData, treeCount: e.target.value })}
                    placeholder="300"
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AA8BAD] uppercase mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Varietas bibit, kondisi kontur tanah, usia pohon, dsb."
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
                  {formSubmitting ? 'Menyimpan...' : editingGarden ? 'Simpan Perubahan' : 'Tambah Kebun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
