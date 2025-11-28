# 🚀 Quick Start - Testing Fitur CRUD

Panduan cepat untuk testing semua fitur yang sudah diimplementasikan.

## Prerequisites

1. **Backend berjalan** di `http://localhost:4000`

   - Endpoint: `/api/locations`
   - Method: GET, POST, PATCH, DELETE

2. **Frontend berjalan** di `http://localhost:3000`

   - Jalankan: `npm run dev`

3. **Database sudah ada data** atau API siap menerima data baru

---

## 🎬 Testing Scenarios

### Scenario 1: View All Locations ✅

**Langkah:**

1. Buka `http://localhost:3000`
2. Tunggu data loading
3. Peta menampilkan marker dengan warna sesuai kategori

**Expected Result:**

- Marker muncul di peta dengan warna berbeda-beda
- Status bar menampilkan "Menampilkan X dari Y lokasi"
- Tidak ada error di console

---

### Scenario 2: Filter by Category ✅

**Langkah:**

1. Di filter section, pilih satu kategori (misal: "Restoran")
2. Lihat marker berubah
3. Klik "Tampilkan (X/Y)"

**Expected Result:**

- Hanya marker kategori "Restoran" yang muncul
- Tombol "Tampilkan" menampilkan jumlah yang benar
- Status bar terupdate

---

### Scenario 3: Create New Location ✅

**Langkah:**

1. Klik tombol "Tambah Lokasi" (hijau, di header)
2. Isi form:
   - Nama: "Test Restaurant"
   - Deskripsi: "Tempat makan bagus"
   - Kategori: "Restoran"
   - Latitude: -6.921857
   - Longitude: 107.608238
3. Klik "Simpan"
4. Tunggu loading

**Expected Result:**

- Toast "Lokasi berhasil ditambahkan"
- Dialog tertutup otomatis
- Marker baru muncul di peta dengan warna merah (Restoran)
- Jumlah lokasi bertambah

---

### Scenario 4: Edit Location ✅

**Langkah:**

1. Klik salah satu marker di peta
2. Di popup, klik tombol "Edit"
3. Ubah nama menjadi "Test Updated"
4. Ubah kategori menjadi "Kafe"
5. Klik "Simpan Perubahan"

**Expected Result:**

- Toast "Lokasi berhasil diperbarui"
- Dialog tertutup
- Marker berubah warna (dari merah menjadi orange)
- Nama di popup terupdate

---

### Scenario 5: Delete Location ✅

**Langkah:**

1. Klik marker yang baru dibuat
2. Di popup, klik tombol "Hapus" (merah)
3. Di alert dialog, klik "Hapus"

**Expected Result:**

- Toast "Lokasi berhasil dihapus"
- Dialog tertutup
- Marker hilang dari peta
- Jumlah lokasi berkurang

---

### Scenario 6: Multiple Category Filter ✅

**Langkah:**

1. Pilih 2-3 kategori (misal: Restoran, Kafe, Hotel)
2. Lihat marker berubah
3. Klik "Tampilkan (X/Y)"

**Expected Result:**

- Hanya marker dari kategori terpilih yang muncul
- Marker menampilkan warna sesuai kategori masing-masing
- Toast menampilkan jumlah yang benar

---

### Scenario 7: Clear & Select All ✅

**Langkah:**

1. Pilih beberapa kategori
2. Klik "Hapus Semua"
3. Klik "Pilih Semua"

**Expected Result:**

- Saat "Hapus Semua": Semua kategori tidak terpilih, semua marker hilang
- Saat "Pilih Semua": Semua kategori terpilih, semua marker muncul

---

### Scenario 8: Map Interactions ✅

**Langkah:**

1. Zoom in/out peta
2. Pan/drag peta
3. Klik beberapa marker
4. Tutup popup (click di luar)

**Expected Result:**

- Map responsive terhadap interaksi
- Popup muncul dengan informasi lengkap
- Edit/Hapus button selalu tersedia di popup

---

## 🎨 Verifikasi Warna Marker

Pastikan setiap kategori memiliki warna yang berbeda:

| No  | Kategori     | Warna          |
| --- | ------------ | -------------- |
| 1   | Restoran     | 🔴 Merah Gelap |
| 2   | Kafe         | 🟠 Orange      |
| 3   | Hotel        | 🟡 Kuning      |
| 4   | Taman        | 🟢 Hijau       |
| 5   | Museum       | 🔵 Cyan/Biru   |
| 6   | Perpustakaan | 🟣 Ungu        |

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch locations"

**Solution:**

- Check if backend running di `http://localhost:4000`
- Verify endpoint: `GET /api/locations`
- Check CORS headers di backend
- Look at network tab di browser DevTools

### Issue: "Marker tidak ada warna"

**Solution:**

- Refresh page
- Check if `lib/categoryColors.ts` punya kategori
- Open console, lihat error messages
- Verifikasi SVG generation di `lib/markerIcon.ts`

### Issue: "Dialog tidak muncul"

**Solution:**

- Pastikan `components/ui/` components ter-import dengan benar
- Check browser console untuk React errors
- Verify `sonner` toast component

### Issue: "Toast notification tidak muncul"

**Solution:**

- Buka DevTools > Console
- Lihat if ada error dari `sonner`
- Verify `<Toaster />` ada di layout

---

## 📊 Data Format

### Sample Location Data

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Restoran Bagus",
  "description": "Restoran dengan makanan lezat",
  "category": "Restoran",
  "location": {
    "type": "Point",
    "coordinates": [107.608238, -6.921857]
  },
  "createdAt": "2025-11-29T10:00:00.000Z",
  "updatedAt": "2025-11-29T10:00:00.000Z"
}
```

---

## 🔧 Developer Notes

### File Modifikasi

1. `lib/api/locations.ts` - API calls diperbarui
2. `components/map/MapComponent.tsx` - CRUD integration
3. `components/map/CategoryFilter.tsx` - Show button added

### File Baru

1. `lib/categoryColors.ts` - Color mapping
2. `lib/markerIcon.ts` - SVG marker creation
3. `components/map/CreateLocationDialog.tsx` - Create form
4. `components/map/EditLocationDialog.tsx` - Edit form
5. `components/map/DeleteLocationDialog.tsx` - Delete confirmation

### Dependencies Used

- `react-leaflet` - Map component
- `leaflet` - Map library
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `@radix-ui/*` - UI components

---

## ✅ Checklist Sebelum Deploy

- [ ] Backend running dan accessible
- [ ] API endpoint `/api/locations` working
- [ ] All CRUD operations tested
- [ ] Warna marker sesuai kategori
- [ ] Toast notifications muncul
- [ ] Error handling working
- [ ] Mobile responsive checked
- [ ] No console errors

---

**Last Updated:** November 29, 2025
