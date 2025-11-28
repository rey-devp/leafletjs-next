// Use deployed MongoDB API endpoint
const BASE_URL = "https://leafletjs-express.vercel.app/places";

/* ===================== GET ALL ===================== */
export async function getAllLocations() {
  try {
    console.log("Fetching from:", BASE_URL);
    const res = await fetch(BASE_URL);
    console.log("Response status:", res.status);

    if (!res.ok) {
      console.error("Failed to fetch, status:", res.status);
      return [];
    }

    const data = await res.json();
    console.log("Data loaded:", data);
    return data;
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
    console.log("Creating location with data:", data);
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

    console.log("Create response status:", res.status);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create location");
    }

    const result = await res.json();
    console.log("Location created:", result);
    return result;
  } catch (err) {
    console.error("createLocation error:", err);
    throw err;
  }
}

/* ===================== UPDATE ===================== */
export async function updateLocation(id, data) {
  try {
    console.log("Updating location:", id, data);
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

    console.log("Update response status:", res.status);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update location");
    }

    const result = await res.json();
    console.log("Location updated:", result);
    return result;
  } catch (err) {
    console.error("updateLocation error:", err);
    throw err;
  }
}

/* ===================== DELETE ===================== */
export async function deleteLocation(id) {
  try {
    console.log("Deleting location:", id);
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    console.log("Delete response status:", res.status);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete location");
    }

    const result = await res.json();
    console.log("Location deleted:", result);
    return result;
  } catch (err) {
    console.error("deleteLocation error:", err);
    throw err;
  }
}
