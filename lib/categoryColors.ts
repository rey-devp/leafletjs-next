// Color mapping for different categories
export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; marker: string }
> = {
  Restoran: { bg: "#EF4444", text: "#FFFFFF", marker: "#DC2626" },
  Kafe: { bg: "#F97316", text: "#FFFFFF", marker: "#EA580C" },
  Hotel: { bg: "#EAB308", text: "#000000", marker: "#CA8A04" },
  Taman: { bg: "#22C55E", text: "#FFFFFF", marker: "#16A34A" },
  Museum: { bg: "#06B6D4", text: "#FFFFFF", marker: "#0891B2" },
  Perpustakaan: { bg: "#8B5CF6", text: "#FFFFFF", marker: "#7C3AED" },
  Sekolah: { bg: "#EC4899", text: "#FFFFFF", marker: "#DB2777" },
  "Rumah Sakit": { bg: "#EF4444", text: "#FFFFFF", marker: "#DC2626" },
  Toko: { bg: "#F59E0B", text: "#FFFFFF", marker: "#D97706" },
  Bioskop: { bg: "#6366F1", text: "#FFFFFF", marker: "#4F46E5" },
  Olahraga: { bg: "#10B981", text: "#FFFFFF", marker: "#059669" },
  "Tempat Ibadah": { bg: "#8B5CF6", text: "#FFFFFF", marker: "#7C3AED" },
};

/**
 * Dapatkan warna untuk kategori tertentu
 */
export function getCategoryColor(category: string): {
  bg: string;
  text: string;
  marker: string;
} {
  return (
    CATEGORY_COLORS[category] || {
      bg: "#6B7280",
      text: "#FFFFFF",
      marker: "#4B5563",
    }
  );
}

/**
 * Dapatkan warna marker untuk kategori tertentu
 */
export function getMarkerColor(category: string): string {
  return getCategoryColor(category).marker;
}

/**
 * Dapatkan semua kategori dan warnanya
 */
export function getAllCategoryColors(): typeof CATEGORY_COLORS {
  return CATEGORY_COLORS;
}
