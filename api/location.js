// Use deployed MongoDB API endpoint
const BASE_URL = "https://leafletjs-express.vercel.app/places";

/* ===================== GET ALL ===================== */
export async function getAllLocations() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch locations");
    return await res.json();
  } catch (err) {
    console.error("getAllLocations error:", err);
    return [];
  }
}

/* ===================== GET BY ID ===================== */
export async function getLocationById(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Location not found");
    return await res.json();
  } catch (err) {
    console.error("getLocationById error:", err);
    return null;
  }
}

/* ===================== CREATE ===================== */
export async function createLocation(data) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        category: data.category,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create location");
    }

    return await res.json();
  } catch (err) {
    console.error("createLocation error:", err);
    throw err;
  }
}

/* ===================== UPDATE ===================== */
export async function updateLocation(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        category: data.category,
        latitude:
          data.latitude !== undefined ? Number(data.latitude) : undefined,
        longitude:
          data.longitude !== undefined ? Number(data.longitude) : undefined,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update location");
    }

    return await res.json();
  } catch (err) {
    console.error("updateLocation error:", err);
    throw err;
  }
}

/* ===================== DELETE ===================== */
export async function deleteLocation(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete location");
    }

    return await res.json();
  } catch (err) {
    console.error("deleteLocation error:", err);
    throw err;
  }
}
