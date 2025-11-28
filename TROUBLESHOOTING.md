# 🛠️ Troubleshooting & FAQ

## Troubleshooting

### ❌ Peta Tidak Muncul (Blank)

**Penyebab:**

- Backend belum running
- URL di `.env.local` salah
- CORS issue
- Leaflet CSS tidak ter-load

**Solusi:**

1. Cek console browser (F12 > Console)
2. Cek Network tab > request ke `NEXT_PUBLIC_API_URL`
3. Pastikan backend running di port yang benar
4. Verify URL di `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
5. Restart dev server: `npm run dev`
6. Clear cache: Hapus folder `.next/` dan restart

---

### ❌ API Error 404

**Pesan Error:** `API error: 404`

**Solusi:**

1. Pastikan endpoint `/api/locations` ada di backend
2. Test URL dengan Postman/curl:
   ```bash
   curl http://localhost:3001/api/locations
   ```
3. Verify CORS setting di backend (jika cross-origin)
4. Check backend logs

---

### ❌ CORS Error

**Pesan Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Backend (Express) Fix:**

```javascript
const cors = require("cors");
app.use(cors());
// Atau lebih spesifik:
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

---

### ❌ Filter Tidak Update Peta

**Solusi:**

1. Check browser console untuk error messages
2. Verify response format dari API
3. Pastikan setiap lokasi punya `category` field
4. Test di Network tab - lihat response data

---

### ❌ Leaflet CSS Error (Icons Tidak Muncul)

**Solusi:**

1. Pastikan CSS di-import di `app/layout.tsx`:
   ```tsx
   import "leaflet/dist/leaflet.css";
   ```
2. Restart dev server
3. Clear browser cache (Ctrl+Shift+Delete)
4. Clear Next.js cache: `rm -rf .next` dan `npm run dev`

---

### ❌ TypeScript Errors

**Pesan:** `Property 'center' does not exist` atau similar

**Info:**

- Ini adalah type warning dari react-leaflet v5
- Aplikasi tetap berfungsi normal
- Warning bisa di-ignore untuk now

**Untuk menghilangkan warning:**
Edit `eslint.config.mjs` dan relax rules (sudah dilakukan)

---

### ❌ Komponen Tidak Import dengan Benar

**Error:** `Cannot find module './LoadingSpinner'`

**Solusi:**

1. Restart dev server
2. Check file path capitalization (case-sensitive)
3. Verify file exists: `ls components/map/`

---

### ❌ Backend Response Format Salah

**Expected Format:**

```json
[
  {
    "_id": "...",
    "name": "Nama",
    "description": "Deskripsi",
    "category": "Kategori",
    "location": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

**Jika format berbeda:**

- Buat adapter di `lib/api/locations.ts`
- Transform response sesuai format yang diharapkan

---

### ❌ Marker Tidak Muncul di Peta

**Penyebab:**

- Koordinat invalid
- Format latitude/longitude terbalik
- Map tidak ter-render

**Solusi:**

1. Verify koordinat format: `[latitude, longitude]`
2. Check browser console untuk error
3. Verify data dari backend punya `location.coordinates`

---

### ❌ Performance Lambat (Banyak Marker)

**Jika ada ribuan lokasi:**

**Solusi:**

1. Implementasi clustering:
   ```bash
   npm install leaflet.markercluster
   ```
2. Implementasi pagination
3. Implementasi virtual scrolling
4. Add search untuk reduce data

---

## FAQ

### Q: Bagaimana menambah custom property ke marker?

**A:** Edit `MapComponent.tsx` di bagian Marker/Popup:

```tsx
<Popup>
  <div className="p-2">
    <h3>{location.name}</h3>
    <p>{location.custom_property}</p> {/* Add here */}
  </div>
</Popup>
```

---

### Q: Bisa ganti marker icon?

**A:** Ya! Import L.Icon dan customize:

```tsx
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: '/custom-marker.png',
  iconSize: [32, 32],
});

<Marker position={[lat, lng]} icon={customIcon}>
```

---

### Q: Bagaimana menampilkan polygon atau line?

**A:** Backend harus return GeoJSON dengan type yang sesuai:

```json
{
  "type": "Polygon",
  "coordinates": [[[lat, lng], [lat, lng], ...]]
}
```

react-leaflet akan automatically render sesuai type.

---

### Q: Bisa add search functionality?

**A:** Ya, tambahkan di `CategoryFilter.tsx`:

```tsx
const [searchTerm, setSearchTerm] = useState("");

const filtered = locations.filter((loc) =>
  loc.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

---

### Q: Bagaimana implementasi clustering?

**A:** Install library:

```bash
npm install leaflet.markercluster @types/leaflet.markercluster
```

Lalu gunakan di map untuk group nearby markers.

---

### Q: Perlu backend API khusus?

**A:** Tidak! Cukup provide endpoint GET `/api/locations` yang return array sesuai format.

---

### Q: Bisa integrate dengan database lokal?

**A:** Ya!

1. Simpan data di localStorage:

   ```typescript
   localStorage.setItem("locations", JSON.stringify(locations));
   ```

2. Load dari localStorage jika offline:
   ```typescript
   const cached = JSON.parse(localStorage.getItem("locations") || "[]");
   ```

---

### Q: Bagaimana custom styling?

**A:** Semua component pakai Tailwind CSS. Edit classes:

```tsx
// Dari:
<div className="bg-blue-50 text-blue-700">

// Ke:
<div className="bg-green-50 text-green-700">
```

---

### Q: Deploy ke production bagaimana?

**A:**

1. Build:

   ```bash
   npm run build
   ```

2. Set environment di production:

   ```bash
   NEXT_PUBLIC_API_URL=https://api.production.com
   ```

3. Deploy ke Vercel / hosting:
   ```bash
   npm start
   ```

---

### Q: Bisa integrate dengan authentication?

**A:** Ya! Add auth header di API call:

```typescript
const response = await fetch(`${API_BASE_URL}/api/locations`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

### Q: Performance optimization?

**A:**

1. Gunakan React.memo untuk components
2. Gunakan useCallback untuk functions
3. Implementasi pagination
4. Add virtualization untuk large lists
5. Cache API response

---

### Q: Bisa custom popup styling?

**A:** Ya! Popup di Leaflet support HTML:

```tsx
<Popup>
  <div
    style={{
      backgroundColor: "#fff",
      border: "2px solid red",
      borderRadius: "8px",
      padding: "16px",
    }}
  >
    <h3>{location.name}</h3>
  </div>
</Popup>
```

---

### Q: Bagaimana handle error dengan better UX?

**A:** Ubah error handling:

```tsx
const [error, setError] = useState<string | null>(null);

try {
  const data = await fetchLocations();
} catch (err) {
  setError("Gagal load data. Coba refresh.");
  setTimeout(() => setError(null), 5000); // Auto dismiss
}
```

---

### Q: Bisa add geolocation?

**A:** Ya! Gunakan browser Geolocation API:

```tsx
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  // Center map ke user location
});
```

---

### Q: Offline support?

**A:** Implementasi service worker + caching strategy

---

### Q: Bisa multi-language?

**A:** Gunakan i18n library seperti next-i18next

---

## Common Issues

| Issue            | Quick Fix                      |
| ---------------- | ------------------------------ |
| Peta blank       | Check `.env.local` and backend |
| No markers       | Verify coordinates format      |
| Filter slow      | Implement pagination           |
| CSS broken       | Restart dev server             |
| Type errors      | Run `npm run lint`             |
| Module not found | Check file paths               |
| CORS error       | Enable CORS di backend         |
| API 404          | Check endpoint & backend       |

---

## Getting Help

1. **Check Docs:**

   - `README_SETUP.md` - Quick start
   - `MAP_SETUP.md` - Full API reference
   - `DOKUMENTASI_PETA.md` - Detailed guide

2. **Check Examples:**

   - `lib/api/examples.ts` - Usage examples
   - `TEMPLATE_PETA.tsx` - Template

3. **Browser DevTools:**

   - Console (F12) - Check errors
   - Network tab - Check API calls
   - Elements tab - Check DOM

4. **Check Logs:**
   - Frontend: Browser console
   - Backend: Terminal/logs
   - Database: Query logs

---

## Still Need Help?

1. Verify setup langkah-demi-langkah dari `README_SETUP.md`
2. Check backend logs
3. Test API dengan Postman
4. Check browser console untuk error messages
5. Read error message carefully - biasanya describe masalahnya

---

Semoga membantu! 🚀
