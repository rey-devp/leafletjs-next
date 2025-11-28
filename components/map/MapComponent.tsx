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
import { CreateLocationDialog } from "./CreateLocationDialog";
import { EditLocationDialog } from "./EditLocationDialog";
import { DeleteLocationDialog } from "./DeleteLocationDialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { createColoredMarkerIcon } from "@/lib/markerIcon";
import { toast } from "sonner";

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

// Lazy load leaflet on client side
let LeafletIcon: any = null;
const getLeafletIcon = async () => {
  if (!LeafletIcon) {
    const L = await import("leaflet");
    LeafletIcon = L.icon;
  }
  return LeafletIcon;
};

export function MapComponent() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markerIcons, setMarkerIcons] = useState<Record<string, any>>({});

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  // Fetch data lokasi saat komponen mount
  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLocations();
      setLocations(data);
      setFilteredLocations(data);
      const uniqueCategories = getUniqueCategories(data);
      setCategories(uniqueCategories);

      // Generate marker icons for each category
      const L = await import("leaflet");
      const icons: Record<string, any> = {};
      uniqueCategories.forEach((cat) => {
        const iconConfig = createColoredMarkerIcon(cat);
        icons[cat] = L.icon(iconConfig);
      });
      setMarkerIcons(icons);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat lokasi");
      toast.error(err instanceof Error ? err.message : "Gagal memuat lokasi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  // Handle perubahan kategori filter
  const handleCategoryChange = useCallback(
    (selected: string[]) => {
      setSelectedCategories(selected);
      const filtered = filterLocationsByCategories(locations, selected);
      setFilteredLocations(filtered);
    },
    [locations]
  );

  // Handle show filtered
  const handleShowFiltered = useCallback(() => {
    if (selectedCategories.length === 0) {
      toast.info("Pilih minimal satu kategori untuk ditampilkan");
      return;
    }
    // Filtered locations sudah ditampilkan, just show toast
    toast.success(
      `Menampilkan ${filteredLocations.length} lokasi dari kategori yang dipilih`
    );
  }, [selectedCategories.length, filteredLocations.length]);

  // CRUD Handlers
  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setEditDialogOpen(true);
  };

  const handleDelete = (location: Location) => {
    setSelectedLocation(location);
    setDeleteDialogOpen(true);
  };

  const handleLocationCreated = () => {
    loadLocations();
  };

  const handleLocationUpdated = () => {
    loadLocations();
  };

  const handleLocationDeleted = () => {
    loadLocations();
  };

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
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={loadLocations}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Peta Lokasi</h1>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Lokasi
            </Button>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            onShowFiltered={handleShowFiltered}
            filteredCount={filteredLocations.length}
            totalCount={locations.length}
          />
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <MapContainer
          center={[-6.921857, 107.608238]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredLocations.map((location) => {
            const [lng, lat] = location.location.coordinates;
            const icon =
              markerIcons[location.category] ||
              (() => {
                // Fallback: create icon on the fly
                const L = require("leaflet");
                const iconConfig = createColoredMarkerIcon(location.category);
                return L.icon(iconConfig);
              })();

            return (
              <Marker key={location._id} position={[lat, lng]} icon={icon}>
                <Popup>
                  <div className="p-3 min-w-64">
                    <h3 className="font-bold text-sm mb-1">{location.name}</h3>
                    <p className="text-xs text-gray-700 mb-2">
                      {location.description || "Tidak ada deskripsi"}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {location.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {lat.toFixed(4)}, {lng.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(location)}
                        className="text-xs"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(location)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="bg-white border-t px-4 py-3 text-sm text-gray-600 flex justify-between items-center">
        <div>
          Menampilkan{" "}
          <span className="font-semibold text-gray-800">
            {filteredLocations.length}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-gray-800">
            {locations.length}
          </span>{" "}
          lokasi
        </div>
        {selectedCategories.length > 0 && (
          <div className="text-xs text-gray-500">
            Filter: {selectedCategories.join(", ")}
          </div>
        )}
      </div>

      {/* CRUD Dialogs */}
      <CreateLocationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        categories={categories}
        onLocationCreated={handleLocationCreated}
      />

      <EditLocationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        location={selectedLocation}
        categories={categories}
        onLocationUpdated={handleLocationUpdated}
      />

      <DeleteLocationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        location={selectedLocation}
        onLocationDeleted={handleLocationDeleted}
      />
    </div>
  );
}
