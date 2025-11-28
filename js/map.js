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

  // Scroll ke form
  const form = document.getElementById("locationForm");
  form.scrollIntoView({ behavior: "smooth" });

  // Focus ke input pertama
  document.getElementById("name").focus();

  // Highlight form
  form.style.animation = "highlight 0.5s ease-in-out";
});

// CSS Animation untuk highlight form
const style = document.createElement("style");
style.textContent = `
  @keyframes highlight {
    0% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.5); }
    50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.8); }
    100% { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); }
  }
`;
document.head.appendChild(style);
