// API service untuk fetch data lokasi dari backend Express
import { Location, GeoJSONFeatureCollection } from "@/lib/types/location";

// Backend Express URL (default: http://localhost:4000)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_ENDPOINT = `${API_BASE_URL}/locations`;

// ==================== FETCH OPERATIONS ====================

/**
 * Fetch semua lokasi dari backend
 * GET /locations
 */
export async function fetchLocations(): Promise<Location[]> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return [];
  }
}

/**
 * Fetch lokasi berdasarkan ID
 * GET /locations/:id
 */
export async function fetchLocationById(id: string): Promise<Location | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch location by ID:", error);
    return null;
  }
}

/**
 * Fetch lokasi berdasarkan kategori (filter di client)
 */
export async function fetchLocationsByCategory(
  category: string
): Promise<Location[]> {
  try {
    const allLocations = await fetchLocations();
    return allLocations.filter((loc) => loc.category === category);
  } catch (error) {
    console.error("Failed to fetch locations by category:", error);
    return [];
  }
}

// ==================== CREATE OPERATION ====================

/**
 * Buat lokasi baru
 * POST /locations
 */
export async function createLocation(
  name: string,
  description: string,
  category: string,
  latitude: number,
  longitude: number
): Promise<Location | null> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        category,
        latitude, // API mengharapkan latitude dan longitude terpisah
        longitude,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create location:", error);
    return null;
  }
}

// ==================== UPDATE OPERATION ====================

/**
 * Update lokasi
 * PUT /locations/:id
 */
export async function updateLocation(
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
  }>
): Promise<Location | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update location:", error);
    return null;
  }
}

// ==================== DELETE OPERATION ====================

/**
 * Hapus lokasi
 * DELETE /locations/:id
 */
export async function deleteLocation(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete location:", error);
    return false;
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Convert Location array ke GeoJSON FeatureCollection
 */
export function locationsToGeoJSON(
  locations: Location[]
): GeoJSONFeatureCollection {
  return {
    type: "FeatureCollection",
    features: locations.map((location) => ({
      type: "Feature" as const,
      properties: {
        id: location._id,
        name: location.name,
        description: location.description,
        category: location.category,
      },
      geometry: {
        type: "Point" as const,
        coordinates: location.location.coordinates,
      },
    })),
  };
}

/**
 * Dapatkan semua kategori unik dari lokasi
 */
export function getUniqueCategories(locations: Location[]): string[] {
  const categories = new Set(locations.map((loc) => loc.category));
  return Array.from(categories).sort();
}

/**
 * Filter lokasi berdasarkan kategori
 */
export function filterLocationsByCategories(
  locations: Location[],
  categories: string[]
): Location[] {
  if (categories.length === 0) {
    return locations;
  }
  return locations.filter((location) => categories.includes(location.category));
}
