"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Location } from "@/lib/types/location";
import {
  fetchLocations,
  getUniqueCategories,
  filterLocationsByCategories,
} from "@/lib/api/locations";
import { CategoryFilter } from "./CategoryFilter";
import { LoadingSpinner } from "./LoadingSpinner";

// Dynamic import untuk Leaflet (client-side only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export function MapComponent() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data lokasi saat komponen mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLocations();
        setLocations(data);
        setFilteredLocations(data);
        const uniqueCategories = getUniqueCategories(data);
        setCategories(uniqueCategories);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load locations"
        );
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  // Handle perubahan kategori filter
  const handleCategoryChange = useCallback(
    (selected: string[]) => {
      setSelectedCategories(selected);
      const filtered = filterLocationsByCategories(locations, selected);
      setFilteredLocations(filtered);
    },
    [locations]
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Peta Lokasi</h1>
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      <div className="flex-1 w-full">
        <MapContainer
          center={[-6.921857, 107.608238]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredLocations.map((location) => {
            const [lng, lat] = location.location.coordinates;
            return (
              <Marker key={location._id} position={[lat, lng]}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-sm mb-1">{location.name}</h3>
                    <p className="text-xs text-gray-700 mb-2">
                      {location.description}
                    </p>
                    <p className="text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {location.category}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="bg-white border-t px-4 py-3 text-sm text-gray-600">
        Menampilkan {filteredLocations.length} dari {locations.length} lokasi
      </div>
    </div>
  );
}
