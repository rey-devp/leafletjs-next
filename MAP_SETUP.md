# 🗺️ Aplikasi Peta Lokasi dengan Filter Kategori

Aplikasi peta interaktif menggunakan Next.js + Leaflet + React-Leaflet dengan fitur filter kategori real-time.

## 🚀 Quick Start

### 1. Setup Environment Variable

Edit atau buat file `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Sesuaikan dengan URL backend Express Anda.

### 2. Jalankan Development Server

```bash
npm run dev
```

Buka browser ke: `http://localhost:3000`

### 3. Pastikan Backend Running

Backend Express harus sudah running dan menyediakan endpoint:

```
GET http://localhost:3001/api/locations
```

Response format:

```json
[
  {
    "_id": "...",
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

## 📁 Struktur Folder

```
lib/
├── api/
│   ├── locations.ts       # Core API functions
│   ├── index.ts           # Export API
│   └── examples.ts        # Contoh penggunaan
└── types/
    ├── location.ts        # Type definitions
    └── index.ts           # Export types

components/
└── map/
    ├── MapComponent.tsx   # Komponen peta Leaflet
    ├── CategoryFilter.tsx # Komponen filter kategori
    ├── LoadingSpinner.tsx # Loading indicator
    └── index.ts           # Export components

DOKUMENTASI_PETA.md       # Dokumentasi lengkap
MAP_SETUP.md              # File ini
```

## ✨ Fitur Utama

### 🗺️ Peta Interaktif Leaflet

- Menampilkan markers dari data GeoJSON
- Popup informatif di setiap marker
- Zoom dan pan controls
- Default center di Bandung

### 🏷️ Filter Kategori

- Pilih satu atau multiple kategori
- Tombol "Pilih Semua" dan "Hapus Semua"
- Responsive design (desktop grid, mobile dropdown)
- Real-time update peta

### 📡 API Integration

- Fetch data dari backend Express
- Error handling
- Loading state

### 🎨 UI Components

- Built dengan Tailwind CSS + Radix UI
- Responsive design
- Dark mode compatible

## 🔧 API Functions

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

### `fetchLocations(): Promise<Location[]>`

Fetch semua lokasi dari backend.

```typescript
const locations = await fetchLocations();
```

### `fetchLocationsByCategory(category: string): Promise<Location[]>`

Fetch lokasi dengan kategori spesifik.

```typescript
const parks = await fetchLocationsByCategory("Park");
```

### `locationsToGeoJSON(locations: Location[]): GeoJSONFeatureCollection`

Convert array lokasi ke GeoJSON format untuk Leaflet.

```typescript
const geoJson = locationsToGeoJSON(locations);
// Gunakan dengan <GeoJSON data={geoJson} />
```

### `getUniqueCategories(locations: Location[]): string[]`

Dapatkan list kategori unik.

```typescript
const categories = getUniqueCategories(locations);
// Output: ["Park", "Public Space", "Restaurant", ...]
```

### `filterLocationsByCategories(locations: Location[], categories: string[]): Location[]`

Filter lokasi berdasarkan array kategori.

```typescript
// Multiple kategori
const filtered = filterLocationsByCategories(locations, ["Park", "Temple"]);

// Semua kategori (array kosong)
const all = filterLocationsByCategories(locations, []);
```

## 🎯 Implementasi

### Di Page Anda

```typescript
// app/page.tsx
import { MapComponent } from "@/components/map";

export default function Home() {
  return <MapComponent />;
}
```

Komponen `MapComponent` sudah include:

- Fetch data otomatis
- Filter kategori
- Peta Leaflet dengan markers
- Loading state
- Error handling

### Custom Implementasi

Jika ingin membuat custom, lihat file `lib/api/examples.ts` untuk contoh penggunaan setiap function.

## 🎨 Customization

### Ubah Center Peta

Di `components/map/MapComponent.tsx`:

```tsx
<MapContainer
  center={[-6.921857, 107.608238]}  // [latitude, longitude]
  zoom={13}
>
```

### Ubah Tile Provider

Di `components/map/MapComponent.tsx`:

```tsx
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // Ganti dengan provider lain:
  // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png (OpenStreetMap)
  // https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png (OpenTopoMap)
  // https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png (CartoDB)
/>
```

### Ubah Warna Filter

Di `components/map/CategoryFilter.tsx`, ubah class Tailwind:

```tsx
// Dari:
"border-blue-500 bg-blue-50 text-blue-700";

// Ke:
"border-green-500 bg-green-50 text-green-700";
```

### Customize Popup Marker

Di `components/map/MapComponent.tsx`, edit fungsi `onEachFeature`:

```tsx
const onEachFeature = (feature: any, layer: any) => {
  const props = feature.properties;
  const popupContent = `
    <div class="p-3 rounded">
      <h3 class="font-bold">${props.name}</h3>
      <p>${props.description}</p>
      <p>Kategori: ${props.category}</p>
    </div>
  `;
  layer.bindPopup(popupContent);
};
```

## 🐛 Troubleshooting

### Peta tidak muncul

1. Check `.env.local` sudah ada dan benar
2. Dev server berjalan di port 3000
3. Buka DevTools Console untuk error messages

### Filter tidak update peta

1. Cek Network tab - pastikan API response OK
2. Pastikan semua lokasi punya `category` field
3. Check console untuk error messages

### Leaflet CSS error

1. Pastikan CSS sudah di-import di `app/layout.tsx`
2. Restart dev server jika masih error
3. Clear `.next` folder dan rebuild

### API 404 atau timeout

1. Pastikan backend running
2. Check `NEXT_PUBLIC_API_URL` di `.env.local`
3. Pastikan endpoint `/api/locations` ada di backend
4. Check CORS settings di backend jika error

## 📦 Dependencies

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "next": "^16.0.5",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "tailwindcss": "^4"
}
```

## 🔐 Security Notes

- `NEXT_PUBLIC_API_URL` bisa diakses dari browser (aman jika public API)
- Pastikan backend punya CORS configured dengan benar
- Jangan expose sensitive data di environment variables tanpa `NEXT_PUBLIC_` prefix

## 📖 Dokumentasi Lengkap

Lihat `DOKUMENTASI_PETA.md` untuk dokumentasi detail termasuk:

- Semua type definitions
- Advanced customization
- Performance tips
- Backend integration guide

## 🚀 Deploy

### Vercel

```bash
# 1. Push ke GitHub
git push

# 2. Import project ke Vercel
# 3. Add environment variables di Vercel dashboard:
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Self-hosted

```bash
# Build
npm run build

# Start production
npm start
```

Pastikan `NEXT_PUBLIC_API_URL` environment variable di-set di server.

## 📝 Tips

- Untuk data besar (ribuan lokasi), implementasi clustering dengan Leaflet.markercluster
- Pertimbangkan pagination untuk performa lebih baik
- Cache data di localStorage untuk offline support
- Add search functionality untuk mencari lokasi by name

## ❓ FAQ

**Q: Bagaimana kalau data tidak muncul?**
A: Check Network tab di DevTools, lihat response dari API. Pastikan format koordinat benar (longitude, latitude).

**Q: Bisa ganti marker icon?**
A: Ya, edit fungsi `onEachFeature` atau gunakan custom L.Icon.

**Q: Bisa add polygon atau line?**
A: Ya, GeoJSON support feature types lain selain Point (Polygon, LineString, etc).

**Q: Perlu backend logic?**
A: Tidak, ini pure frontend. Backend hanya perlu provide data via API.

---

Happy Mapping! 🗺️✨
