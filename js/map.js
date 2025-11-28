// init map
const map = L.map("map").setView([-6.921857, 107.608238], 13);

// tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// marker color by category
function getMarkerIcon(category) {
  let color = "blue";

  if (category === "Public Space") color = "green";
  if (category === "Tempat Wisata") color = "red";
  if (category === "Restoran") color = "orange";
  if (category === "Toko") color = "purple";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}

// Handle double-click pada map untuk membuka form
map.on("dblclick", (e) => {
  // Isi form dengan koordinat double-click
  document.getElementById("latitude").value = e.latlng.lat;
  document.getElementById("longitude").value = e.latlng.lng;

  // Focus ke input pertama
  document.getElementById("name").focus();
});
