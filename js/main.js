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
      alert("✅ Lokasi berhasil diupdate!");
    } else {
      await createLocation(data);
      alert("✅ Lokasi berhasil ditambahkan!");
    }

    form.reset();
    locationIdEl.value = "";
    cancelEdit.hidden = true;
    formTitle.textContent = "Tambah Lokasi";
    loadLocations();
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
};

/* FILTER */
filterEl.onchange = () => {
  selectedCategory = filterEl.value;
  loadLocations();
};

/* MAP CLICK → AUTO FILL (single click) */
map.on("click", (e) => {
  const latEl = document.getElementById("latitude");
  const lngEl = document.getElementById("longitude");

  if (!latEl.value || !lngEl.value) {
    latEl.value = e.latlng.lat;
    lngEl.value = e.latlng.lng;
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

  // Scroll ke form
  form.scrollIntoView({ behavior: "smooth" });
  nameEl.focus();
};

window.removeLocation = async (id) => {
  if (confirm("Yakin hapus lokasi ini?")) {
    try {
      await deleteLocation(id);
      alert("✅ Lokasi berhasil dihapus!");
      loadLocations();
    } catch (error) {
      alert("❌ Error: " + error.message);
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
