import {
  getAllLocations,
  createLocation,
  deleteLocation,
} from "../api/locations.js";

/* load markers */
const locations = await getAllLocations();

/* contoh create */
await createLocation({
  name: "Contoh Tempat",
  description: "Ini data dari frontend",
  category: "Public Space",
  latitude: -6.921857,
  longitude: 107.608238,
});

/* contoh delete */
await deleteLocation("64fc0e2bxxxxxx");
