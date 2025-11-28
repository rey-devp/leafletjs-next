// API service untuk fetch data lokasi dari backend Express
import { Location, GeoJSONFeatureCollection } from "@/lib/types/location";

// Backend Express URL (default: http://localhost:4000)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_ENDPOINT = `${API_BASE_URL}/places`;

// ==================== FETCH OPERATIONS ====================

/**
 * Fetch semua lokasi dari backend
 * GET /api/locations
 */
export async function fetchLocations(): Promise<Location[]> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Handle both direct array and data wrapper
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    throw error;
  }
}

/**
 * Fetch lokasi berdasarkan ID
 * GET /api/locations/:id
 */
export async function fetchLocationById(id: string): Promise<Location | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Failed to fetch location by ID:", error);
    throw error;
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
 * POST /api/locations
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
        location: {
          type: "Point",
          coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Failed to create location:", error);
    throw error;
  }
}

// ==================== UPDATE OPERATION ====================

/**
 * Update lokasi
 * PATCH /api/locations/:id
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
    const payload: Record<string, unknown> = { ...updates };

    // Convert latitude/longitude to GeoJSON format if provided
    if (updates.latitude !== undefined && updates.longitude !== undefined) {
      payload.location = {
        type: "Point",
        coordinates: [updates.longitude, updates.latitude],
      };
      delete payload.latitude;
      delete payload.longitude;
    }

    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Failed to update location:", error);
    throw error;
  }
}

// ==================== DELETE OPERATION ====================

/**
 * Hapus lokasi
 * DELETE /api/locations/:id
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
    throw error;
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
