/**
 * CONTOH PENGGUNAAN API SERVICE
 * File ini hanya untuk dokumentasi, tidak dijalankan
 * Backend: Express.js di http://localhost:4000
 */

import {
  fetchLocations,
  fetchLocationById,
  fetchLocationsByCategory,
  createLocation,
  updateLocation,
  deleteLocation,
  getUniqueCategories,
  filterLocationsByCategories,
  locationsToGeoJSON,
} from "@/lib/api/locations";

// ============ CONTOH 1: Fetch Semua Lokasi ============
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function example1_fetchAll() {
  const locations = await fetchLocations();
  console.log("Semua lokasi:", locations);
}

// ============ CONTOH 2: Fetch Lokasi by ID ============
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function example2_fetchById() {
  const location = await fetchLocationById("6929ae2345ebbf1640269df9");
  console.log("Lokasi by ID:", location);
}

// ============ CONTOH 3: Fetch Berdasarkan Kategori ============
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function example3_fetchByCategory() {
  const publicSpaces = await fetchLocationsByCategory("Public Space");
  console.log("Lokasi kategori Public Space:", publicSpaces);
}

// ============ CONTOH 4: Buat Lokasi Baru ============
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function example4_createLocation() {
  const newLocation = await createLocation(
    "Taman Merdeka",
    "Taman indah di pusat kota",
    "Park",
    -6.9271, // latitude
    107.6411 // longitude
  );
  console.log("Lokasi dibuat:", newLocation);
}

// ============ CONTOH 5: Update Lokasi ============
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function example5_updateLocation() {
  const updated = await updateLocation("6929ae2345ebbf1640269df9", {
    name: "Alun-Alun Bandung (Updated)",
    category: "Public Space",
  });
  console.log("Lokasi diupdate:", updated);
}

// ============ CONTOH 6: Hapus Lokasi ============
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function example6_deleteLocation() {
  const deleted = await deleteLocation("6929ae2345ebbf1640269df9");
  console.log("Lokasi dihapus:", deleted);
}

// ============ CONTOH 7: Filter & Kategori ============
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function example7_filteringLogic() {
  const locations = await fetchLocations();
  const categories = getUniqueCategories(locations);
  console.log("Kategori tersedia:", categories);

  const selectedCategories = ["Park", "Temple"];
  const filtered = filterLocationsByCategories(locations, selectedCategories);
  const geoJSON = locationsToGeoJSON(filtered);

  console.log("GeoJSON untuk peta:", geoJSON);
}

// ============ CONTOH 8: Kombinasi Complex ============
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function example8_complexWorkflow() {
  const locations = await fetchLocations();
  const parkLocations = filterLocationsByCategories(locations, ["Park"]);
  const geoJSON = locationsToGeoJSON(parkLocations);

  console.log(`Found ${parkLocations.length} parks`);
  return geoJSON;
}

export {};
