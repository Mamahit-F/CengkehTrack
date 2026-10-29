/**
 * DATA DEMONSTRASI (DEMO MODE ONLY)
 * 
 * PERINGATAN:
 * Data di bawah ini HANYA digunakan untuk demonstrasi visual dan preview desain antarmuka
 * ketika Backend / PostgreSQL belum terpasang. Data ini bersifat read-only / in-memory local
 * dan TIDAK tersimpan secara permanen ke database backend.
 */

export const DEMO_SUMMARY = {
  totalGardens: 3,
  totalHarvestRecords: 8,
  totalHarvestLiters: 1250.75, // LITER
  totalSales: 5,
  totalRevenue: 62537500.00, // Rp (Pendapatan Kotor)
  totalSoldLiters: 850.50, // LITER
};

export const DEMO_GARDENS = [
  {
    id: 101,
    name: 'Kebun Bukit Cengkih Utama',
    location: 'Desa Patemon, Kec. Seririt, Buleleng',
    areaHectares: 2.75,
    treeCount: 320,
    notes: 'Tanaman cengkih varietas Sansibar usia 12 tahun. Produksi sangat optimal.',
    createdAt: '2025-01-15T08:30:00Z',
  },
  {
    id: 102,
    name: 'Kebun Lereng Selatan',
    location: 'Desa Munduk, Buleleng',
    areaHectares: 1.5,
    treeCount: 180,
    notes: 'Varietas Sikotok, ketinggian 800 mdpl. Masa pembuahan lebat.',
    createdAt: '2025-02-10T09:00:00Z',
  },
  {
    id: 103,
    name: 'Kebun Cengkih Lembah Hijau',
    location: 'Desa Gitgit, Sukasada',
    areaHectares: 3.2,
    treeCount: 410,
    notes: 'Varietas Raja, baru peremajaan sebagian 3 tahun lalu.',
    createdAt: '2025-03-01T11:20:00Z',
  },
];

export const DEMO_HARVESTS = [
  {
    id: 201,
    gardenId: 101,
    gardenName: 'Kebun Bukit Cengkih Utama',
    harvestDate: '2025-08-14',
    quantityLiters: 245.5,
    qualityGrade: 'Grade A (Super)',
    notes: 'Bunga cengkih petik segar matang pohon, kadar air rendah.',
    createdAt: '2025-08-14T17:00:00Z',
  },
  {
    id: 202,
    gardenId: 102,
    gardenName: 'Kebun Lereng Selatan',
    harvestDate: '2025-08-20',
    quantityLiters: 180.0,
    qualityGrade: 'Grade A (Super)',
    notes: 'Petik raya blok timur. Kualitas sangat seragam.',
    createdAt: '2025-08-20T16:30:00Z',
  },
  {
    id: 203,
    gardenId: 103,
    gardenName: 'Kebun Cengkih Lembah Hijau',
    harvestDate: '2025-09-02',
    quantityLiters: 310.25,
    qualityGrade: 'Grade B (Standar)',
    notes: 'Sebagian bunga agak muda karena mendahului musim hujan.',
    createdAt: '2025-09-02T15:45:00Z',
  },
  {
    id: 204,
    gardenId: 101,
    gardenName: 'Kebun Bukit Cengkih Utama',
    harvestDate: '2025-09-18',
    quantityLiters: 215.0,
    qualityGrade: 'Grade A (Super)',
    notes: 'Petikan kedua blok barat.',
    createdAt: '2025-09-18T16:00:00Z',
  },
  {
    id: 205,
    gardenId: 102,
    gardenName: 'Kebun Lereng Selatan',
    harvestDate: '2025-10-05',
    quantityLiters: 300.0,
    qualityGrade: 'Grade B (Standar)',
    notes: 'Pembersihan akhir musim panen raya.',
    createdAt: '2025-10-05T17:15:00Z',
  },
];

export const DEMO_SALES = [
  {
    id: 301,
    gardenId: 101,
    gardenName: 'Kebun Bukit Cengkih Utama',
    saleDate: '2025-08-22',
    buyerName: 'UD Sumber Makmur (Pengepul Singaraja)',
    quantityLiters: 200.0,
    pricePerLiter: 75000.0,
    totalPrice: 15000000.0,
    notes: 'Pembayaran tunai lunas di tempat.',
    createdAt: '2025-08-22T14:00:00Z',
  },
  {
    id: 302,
    gardenId: 102,
    gardenName: 'Kebun Lereng Selatan',
    saleDate: '2025-08-28',
    buyerName: 'Koperasi Tani Cengkih Mandiri',
    quantityLiters: 150.0,
    pricePerLiter: 74000.0,
    totalPrice: 11100000.0,
    notes: 'Disetor untuk penyulingan minyak atsiri.',
    createdAt: '2025-08-28T11:00:00Z',
  },
  {
    id: 303,
    gardenId: 103,
    gardenName: 'Kebun Cengkih Lembah Hijau',
    saleDate: '2025-09-10',
    buyerName: 'PT Aromaterapi Nusantara',
    quantityLiters: 250.5,
    pricePerLiter: 72000.0,
    totalPrice: 18036000.0,
    notes: 'Kontrak pasokan bahan baku industri.',
    createdAt: '2025-09-10T16:20:00Z',
  },
  {
    id: 304,
    gardenId: 101,
    gardenName: 'Kebun Bukit Cengkih Utama',
    saleDate: '2025-09-25',
    buyerName: 'CV Rempah Abadi',
    quantityLiters: 150.0,
    pricePerLiter: 76000.0,
    totalPrice: 11400000.0,
    notes: 'Kualitas super ekspor.',
    createdAt: '2025-09-25T13:30:00Z',
  },
  {
    id: 305,
    gardenId: 102,
    gardenName: 'Kebun Lereng Selatan',
    saleDate: '2025-10-12',
    buyerName: 'UD Sumber Makmur',
    quantityLiters: 100.0,
    pricePerLiter: 70000.0,
    totalPrice: 7000000.0,
    notes: 'Sisa stok akhir musim.',
    createdAt: '2025-10-12T15:00:00Z',
  },
];

export const DEMO_USER = {
  id: 1,
  name: 'I Made Cengkih Artha',
  email: 'petani@cengkihtrack.com',
  phone: '081234567890',
  address: 'Banjar Munduk, Buleleng, Bali',
  role: 'USER',
  createdAt: '2025-01-01T00:00:00Z',
};
