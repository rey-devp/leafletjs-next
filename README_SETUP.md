# 🚀 Panduan Cepat - Aplikasi Peta Lokasi dengan Filter Kategori

**Proyek sudah siap dijalankan!** Berikut langkah-langkah untuk menjalankan aplikasi.

## 📋 Daftar yang Sudah Dibuat

✅ **Type Definitions** (`lib/types/location.ts`)

- Tipe data untuk lokasi dari backend
- Format GeoJSON
- Type safety untuk seluruh aplikasi

✅ **API Service** (`lib/api/locations.ts`)

- `fetchLocations()` - Ambil semua lokasi
- `fetchLocationsByCategory()` - Filter berdasarkan kategori
- `locationsToGeoJSON()` - Convert ke format GeoJSON
- `getUniqueCategories()` - Dapatkan kategori unik
- `filterLocationsByCategories()` - Filter client-side

✅ **Komponen React**

- `MapComponent.tsx` - Komponen peta utama Leaflet dengan markers
- `CategoryFilter.tsx` - Komponen filter kategori (responsive)
- `LoadingSpinner.tsx` - Komponen loading indicator

✅ **Dokumentasi**

- `MAP_SETUP.md` - Quick start & API reference
- `DOKUMENTASI_PETA.md` - Dokumentasi lengkap
- `lib/api/examples.ts` - Contoh penggunaan setiap fungsi

✅ **Konfigurasi**

- `.env.local` - Environment variables
- `eslint.config.mjs` - ESLint configuration
- `app/page.tsx` - Homepage updated dengan MapComponent

## ⚙️ Langkah Setup

### 1. Update `.env.local`

Edit file `d:\frontend\.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Ganti `http://localhost:3001` dengan URL backend Anda**

### 2. Pastikan Backend Running

Backend Express harus menyediakan endpoint:

```
GET /api/locations
```

Response format (sesuai data yang Anda berikan):

```json
[
  {
    "_id": "6929ae2345ebbf1640269df9",
    "name": "Alun-Alun Kota Bandung",
    "description": "Ruang terbuka hijau di pusat kota Bandung.",
    "category": "Public Space",
    "location": {
      "type": "Point",
      "coordinates": [107.608238, -6.921857]
    },
    "createdAt": "2025-11-28T14:13:55.685Z",
    "updatedAt": "2025-11-28T14:13:55.685Z"
  }
]
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka: `http://localhost:3000`

## 📁 Struktur File

```
lib/
├── api/
│   ├── locations.ts       ← Core API functions
│   ├── index.ts
│   └── examples.ts        ← Contoh penggunaan
├── types/
│   ├── location.ts        ← Type definitions
│   └── index.ts
└── utils.ts

components/
└── map/
    ├── MapComponent.tsx   ← Peta Leaflet
    ├── CategoryFilter.tsx ← Filter kategori
    ├── LoadingSpinner.tsx ← Loading state
    └── index.ts

app/
├── page.tsx               ← Updated dengan MapComponent
├── layout.tsx             ← Leaflet CSS sudah di-import
└── globals.css

.env.local                  ← API URL configuration
MAP_SETUP.md               ← Quick start guide
DOKUMENTASI_PETA.md       ← Dokumentasi lengkap
```

## 🎯 Features

✨ **Peta Interaktif Leaflet**

- Markers untuk setiap lokasi
- Popup informatif (nama, deskripsi, kategori)
- Zoom & pan controls
- Default center di Bandung (-6.921857, 107.608238)

🏷️ **Filter Kategori**

- Tampilkan/sembunyikan kategori
- Tombol "Pilih Semua" & "Hapus Semua"
- Responsive design (desktop grid, mobile dropdown)
- Real-time peta update

📡 **API Integration**

- Fetch dari backend Express
- Error handling
- Loading state

🎨 **UI/UX**

- Built dengan Tailwind CSS + Radix UI
- Responsive design
- Professional styling

## 🔌 API Functions

### Import

```typescript
import {
  fetchLocations,
  fetchLocationsByCategory,
  locationsToGeoJSON,
  getUniqueCategories,
  filterLocationsByCategories,
} from "@/lib/api/locations";
```

### Contoh Penggunaan

```typescript
// Ambil semua lokasi
const locations = await fetchLocations();

// Ambil kategori
const categories = getUniqueCategories(locations);

// Filter berdasarkan kategori
const filtered = filterLocationsByCategories(locations, ["Park", "Temple"]);

// Convert ke GeoJSON
const geoJson = locationsToGeoJSON(filtered);
```

## 📱 Responsive Design

- **Desktop**: Kategori ditampilkan sebagai grid buttons
- **Mobile**: Kategori dalam dropdown untuk space-efficient

## 🎯 Implementasi di Page

Sudah siap! Cukup import di halaman:

```typescript
import { MapComponent } from "@/components/map";

export default function Home() {
  return <MapComponent />;
}
```

MapComponent sudah handle:

- ✅ Fetch data otomatis
- ✅ Filter kategori
- ✅ Peta Leaflet dengan markers
- ✅ Loading & error states

## 🔧 Customization

### Ubah Center Peta

Di `components/map/MapComponent.tsx`:

```typescript
<MapContainer
  center={[-6.921857, 107.608238]}  // [latitude, longitude]
  zoom={13}
>
```

### Ubah Tile Provider

```typescript
<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
// Atau: CartoDB, Mapbox, OpenTopoMap, dll
```

### Customize Filter Styling

Di `components/map/CategoryFilter.tsx`, ubah Tailwind classes:

- Warna: `bg-blue-50` → `bg-green-50`
- Border: `border-blue-500` → `border-green-500`

## 🐛 Troubleshooting

| Issue              | Solusi                                       |
| ------------------ | -------------------------------------------- |
| Peta blank         | Cek `.env.local`, restart dev server         |
| Filter tidak jalan | Cek response API di Network tab              |
| API error 404      | Pastikan backend URL benar di `.env.local`   |
| Leaflet CSS error  | Restart dev server atau clear `.next` folder |

## 📚 Dokumentasi

- **MAP_SETUP.md** - Quick reference & API docs
- **DOKUMENTASI_PETA.md** - Dokumentasi detail
- **lib/api/examples.ts** - Contoh kode

## 🚀 Next Steps

1. ✅ Jalankan development server
2. ✅ Test peta dan filter
3. ✅ Customize sesuai kebutuhan
4. ✅ Deploy ke production

## 💡 Tips

- Untuk data besar (ribuan lokasi), implementasi clustering
- Tambah search functionality untuk cari lokasi by name
- Implementasi pagination untuk better performance
- Add offline support dengan service workers

---

**Selamat! Aplikasi peta Anda sudah siap!** 🗺️✨

Jika ada pertanyaan, lihat dokumentasi di `MAP_SETUP.md` atau `DOKUMENTASI_PETA.md`.
