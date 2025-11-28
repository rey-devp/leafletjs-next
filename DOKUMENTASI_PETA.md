# Dokumentasi Peta Lokasi dengan Filter Kategori

## Struktur Project

```
lib/
  ├── api/
  │   ├── locations.ts          # API service untuk fetch data
  │   └── index.ts              # Export API functions
  └── types/
      ├── location.ts           # Type definitions
      └── index.ts              # Export types

components/
  └── map/
      ├── MapComponent.tsx      # Komponen peta utama (Leaflet)
      ├── CategoryFilter.tsx    # Komponen filter kategori
      ├── LoadingSpinner.tsx    # Komponen loading
      └── index.ts              # Export components

.env.local                       # Environment variables (API URL)
```

## Instalasi Dependensi

Semua dependensi sudah terinstall:

- ✅ **next** (16.0.5)
- ✅ **react-leaflet** (5.0.0)
- ✅ **leaflet** (1.9.4)
- ✅ **tailwindcss** (untuk styling)

## Konfigurasi Environment

Update file `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Ganti URL sesuai dengan backend Express Anda.

## Menggunakan Komponen

### Di halaman utama (app/page.tsx):

```tsx
import { MapComponent } from "@/components/map";

export default function Home() {
  return <MapComponent />;
}
```

## Fitur-Fitur

### 1. **Fetch Data dari Backend**

- Mendapatkan semua lokasi: `GET /api/locations`
- Filter berdasarkan kategori: `GET /api/locations?category=Public%20Space`

### 2. **Filter Kategori**

- Menampilkan semua kategori unik dari data
- Bisa memilih satu atau lebih kategori
- Tombol "Pilih Semua" dan "Hapus Semua"
- Responsive design (desktop grid, mobile dropdown)

### 3. **Peta Leaflet**

- Menampilkan marker berdasarkan koordinat GeoJSON
- Popup interaktif di setiap marker berisi:
  - Nama lokasi
  - Deskripsi
  - Kategori
- Center default: Bandung (-6.921857, 107.608238)
- Zoom level: 13

### 4. **Loading State**

- Spinner loading saat fetch data
- Error handling jika API gagal

## API Service Functions

### `fetchLocations()`

Fetch semua lokasi dari backend.

```typescript
const locations = await fetchLocations();
```

### `fetchLocationsByCategory(category: string)`

Fetch lokasi berdasarkan kategori tertentu.

```typescript
const locations = await fetchLocationsByCategory("Public Space");
```

### `locationsToGeoJSON(locations: Location[])`

Convert array lokasi ke format GeoJSON FeatureCollection.

```typescript
const geoJson = locationsToGeoJSON(locations);
```

### `getUniqueCategories(locations: Location[])`

Dapatkan semua kategori unik dari lokasi.

```typescript
const categories = getUniqueCategories(locations);
```

### `filterLocationsByCategories(locations: Location[], categories: string[])`

Filter lokasi berdasarkan array kategori yang dipilih.

```typescript
const filtered = filterLocationsByCategories(locations, [
  "Public Space",
  "Park",
]);
```

## Type Definitions

```typescript
// Data lokasi dari database
interface Location {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
  updatedAt: string;
}

// Format GeoJSON Feature
interface GeoJSONFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}
```

## Menjalankan Aplikasi

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

Akses ke: `http://localhost:3000`

## Backend Expected API Response

Backend harus return JSON array dengan struktur seperti ini:

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

## Custom Styling

Edit file `CategoryFilter.tsx` dan `MapComponent.tsx` untuk customize styling sesuai design Anda:

- **Colors**: Ubah `bg-blue-50`, `text-blue-700`, dll
- **Spacing**: Ubah padding, margin dengan Tailwind classes
- **Responsive**: Edit breakpoints `md:`, `lg:` di CategoryFilter

## Troubleshooting

### Peta tidak muncul

- Pastikan `.env.local` sudah dikonfigurasi
- Pastikan backend running di port yang benar
- Buka DevTools Console untuk melihat error

### Filter tidak jalan

- Cek response dari backend di Network tab
- Pastikan `category` field ada di setiap lokasi

### Leaflet CSS tidak muncul

- CSS Leaflet sudah di-import di `app/layout.tsx`
- Jika ada issue, restart dev server

## Customization

### Mengubah default center peta

Di `MapComponent.tsx`, ubah:

```tsx
<MapContainer
  center={[-6.921857, 107.608238]}  // [latitude, longitude]
  zoom={13}
  ...
>
```

### Mengubah tile provider

Di `MapComponent.tsx`, ubah URL TileLayer:

```tsx
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // atau gunakan provider lain seperti CartoDB, Mapbox, dll
/>
```

### Menambah custom marker style

Edit fungsi `onEachFeature` di `MapComponent.tsx` untuk customize marker dan popup.

## Catatan Penting

1. **SSR Disabled untuk Leaflet**: Menggunakan `dynamic import` karena Leaflet memerlukan DOM yang hanya tersedia di browser.

2. **Environment Variable**: `NEXT_PUBLIC_` prefix artinya variable ini bisa diakses dari browser, pastikan aman.

3. **GeoJSON Format**: Leaflet menggunakan [longitude, latitude], pastikan backend return dalam format ini.

4. **Performance**: Untuk data besar (ribuan lokasi), pertimbangkan implementasi clustering atau pagination.
