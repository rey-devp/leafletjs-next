# 🚀 QUICK START GUIDE

## 1️⃣ Backend Setup (Express)

Pastikan backend Anda running dengan endpoint:

```
GET http://localhost:3001/api/locations
```

Response format:

```json
[
  {
    "_id": "...",
    "name": "Lokasi Name",
    "description": "Deskripsi",
    "category": "Public Space",
    "location": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    }
  }
]
```

---

## 2️⃣ Frontend Setup

### Install Dependencies (jika belum)

```bash
cd d:\frontend
npm install
```

### Configure Environment

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Start Dev Server

```bash
npm run dev
```

Buka: `http://localhost:3000`

---

## 3️⃣ Verifikasi Aplikasi

✅ Peta tampil di tengah layar
✅ Markers muncul sesuai data
✅ Filter kategori berfungsi
✅ Popup muncul saat marker diklik
✅ Map bisa di-zoom dan di-pan

---

## 4️⃣ Customization (Optional)

### Ubah Center Peta

`components/map/MapComponent.tsx`, line ~106:

```tsx
center={[-6.921857, 107.608238]}  // [latitude, longitude]
```

### Ubah Default Zoom

```tsx
zoom={13}  // Change to desired level (1-20)
```

### Ubah Map Provider

`MapComponent.tsx`, line ~120:

```tsx
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // Atau gunakan provider lain
/>
```

### Customize Popup

`MapComponent.tsx`, fungsi rendering di line ~85-100

---

## 5️⃣ Deploy

### Build

```bash
npm run build
```

### Run Production

```bash
npm start
```

### Deploy ke Vercel

1. Push ke GitHub
2. Connect di Vercel dashboard
3. Set env var: `NEXT_PUBLIC_API_URL`
4. Deploy!

---

## 📖 Dokumentasi Lengkap

- **00_START_HERE.md** - Panduan lengkap
- **MAP_SETUP.md** - Setup detail
- **DOKUMENTASI_PETA.md** - API reference
- **TROUBLESHOOTING.md** - FAQ

---

## ⚡ Common Issues

### Peta tidak muncul

- Check backend running
- Check `.env.local` configured
- Check console for errors (F12)

### Data tidak muncul

- Verify backend response format
- Check network tab untuk API response
- Pastikan coordinates format [lon, lat]

### Filter tidak jalan

- Reload page
- Check browser console
- Verify category field di data

---

## 🎉 Done!

Your map application is ready to use! Enjoy! 🗺️✨
