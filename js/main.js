import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../api/location.js";

let markers = {};
let locationsData = [];
let selectedCategory = "all";
let editingId = null;

const listEl = document.getElementById("locationList");
const filterEl = document.getElementById("categoryFilter");
const form = document.getElementById("locationForm");
const cancelEdit = document.getElementById("cancelEdit");
const formTitle = document.getElementById("formTitle");

// Get all available categories
const CATEGORIES = ["Public Space", "Tempat Wisata", "Restoran", "Toko"];

async function loadLocations() {
  listEl.innerHTML = "";
  locationsData = await getAllLocations();

  // Update kategori filter
  updateCategoryFilter();

  // Clear markers
  Object.values(markers).forEach((m) => map.removeLayer(m));
  markers = {};

  const filtered = locationsData.filter(
    (l) => selectedCategory === "all" || l.category === selectedCategory
  );

  filtered.forEach((loc) => {
    const [lng, lat] = loc.location.coordinates;

    // Create marker dengan icon berdasarkan kategori
    const marker = L.marker([lat, lng], {
      icon: getMarkerIcon(loc.category),
    }).addTo(map).bindPopup(`
        <div style="min-width: 200px;">
          <b>${loc.name}</b><br/>
          <small>${loc.category}</small><br/>
          ${
            loc.description
              ? `<p style="margin: 5px 0; font-size: 12px;">${loc.description}</p>`
              : ""
          }
          <div style="margin-top: 8px; display: flex; gap: 5px;">
            <button onclick="editLocation('${
              loc._id
            }')" style="flex: 1; padding: 5px; cursor: pointer;">✏️ Edit</button>
            <button onclick="removeLocation('${
              loc._id
            }')" style="flex: 1; padding: 5px; cursor: pointer;">🗑 Delete</button>
          </div>
        </div>
      `);

    markers[loc._id] = marker;

    // Add to list
    const li = document.createElement("li");
    li.className = "location-item";
    li.innerHTML = `
      <div class="location-name">${loc.name}</div>
      <div class="location-category">${loc.category}</div>
    `;
    li.onclick = () => {
      map.setView([lat, lng], 16);
      marker.openPopup();
    };
    listEl.appendChild(li);
  });

  // Display count
  console.log(`Total markers: ${filtered.length}`);
}

// Update kategori filter dengan data dari server
function updateCategoryFilter() {
  const categories = [...new Set(locationsData.map((l) => l.category))];
  const currentValue = filterEl.value;

  // Jangan ubah filter options jika sudah ada
}

/* CREATE & UPDATE */
form.onsubmit = async (e) => {
  e.preventDefault();

  const nameEl = document.getElementById("name");
  const descriptionEl = document.getElementById("description");
  const categoryEl = document.getElementById("category");
  const latitudeEl = document.getElementById("latitude");
  const longitudeEl = document.getElementById("longitude");
  const locationIdEl = document.getElementById("locationId");

  const data = {
    name: nameEl.value.trim(),
    description: descriptionEl.value.trim(),
    category: categoryEl.value,
    latitude: latitudeEl.value,
    longitude: longitudeEl.value,
  };

  try {
    if (locationIdEl.value) {
      await updateLocation(locationIdEl.value, data);
      await Swal.fire({
        title: "✅ Berhasil!",
        text: "Lokasi berhasil diupdate",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
        allowOutsideClick: false,
      });
    } else {
      await createLocation(data);
      await Swal.fire({
        title: "✅ Berhasil!",
        text: "Lokasi berhasil ditambahkan",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
        allowOutsideClick: false,
      });
    }

    form.reset();
    locationIdEl.value = "";
    cancelEdit.hidden = true;
    formTitle.textContent = "Tambah Lokasi";
    loadLocations();
  } catch (error) {
    await Swal.fire({
      title: "❌ Error!",
      text: error.message,
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#ef4444",
      allowOutsideClick: false,
    });
  }
};

/* FILTER */
filterEl.onchange = () => {
  selectedCategory = filterEl.value;
  loadLocations();
};

/* MAP CLICK → AUTO FILL & CREATE MARKER */
map.on("click", (e) => {
  const latEl = document.getElementById("latitude");
  const lngEl = document.getElementById("longitude");
  const locationIdEl = document.getElementById("locationId");
  const nameEl = document.getElementById("name");

  // Reset form jika tidak sedang edit
  if (!locationIdEl.value) {
    latEl.value = e.latlng.lat;
    lngEl.value = e.latlng.lng;
    nameEl.focus();
  }
});

/* GLOBAL FUNCTIONS */
window.editLocation = (id) => {
  const loc = locationsData.find((l) => l._id === id);
  if (!loc) return;

  const nameEl = document.getElementById("name");
  const descriptionEl = document.getElementById("description");
  const categoryEl = document.getElementById("category");
  const latitudeEl = document.getElementById("latitude");
  const longitudeEl = document.getElementById("longitude");
  const locationIdEl = document.getElementById("locationId");

  nameEl.value = loc.name;
  descriptionEl.value = loc.description || "";
  categoryEl.value = loc.category;
  latitudeEl.value = loc.location.coordinates[1];
  longitudeEl.value = loc.location.coordinates[0];
  locationIdEl.value = id;

  formTitle.textContent = `Edit: ${loc.name}`;
  cancelEdit.hidden = false;

  nameEl.focus();
};

window.removeLocation = async (id) => {
  const result = await Swal.fire({
    title: "Hapus Lokasi?",
    text: "Data akan dihapus dan tidak bisa dikembalikan",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    allowOutsideClick: false,
  });

  if (result.isConfirmed) {
    try {
      await deleteLocation(id);
      await Swal.fire({
        title: "✅ Terhapus!",
        text: "Lokasi berhasil dihapus",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
        allowOutsideClick: false,
      });
      loadLocations();
    } catch (error) {
      await Swal.fire({
        title: "❌ Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        allowOutsideClick: false,
      });
    }
  }
};

cancelEdit.onclick = () => {
  const locationIdEl = document.getElementById("locationId");
  form.reset();
  locationIdEl.value = "";
  cancelEdit.hidden = true;
  formTitle.textContent = "Tambah Lokasi";
};

loadLocations();
