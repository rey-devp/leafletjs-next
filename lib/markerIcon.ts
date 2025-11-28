"use client";

import { getMarkerColor } from "@/lib/categoryColors";

/**
 * Create a custom SVG marker for Leaflet with specific color
 */
export function createColoredMarkerIcon(
  category: string,
  isHighlighted: boolean = false
) {
  const color = getMarkerColor(category);
  const scale = isHighlighted ? 1.3 : 1;

  const svg = `
    <svg width="${32 * scale}" height="${
    41 * scale
  }" viewBox="0 0 32 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C9.38 0 4 5.38 4 12c0 8 12 29 12 29s12-21 12-29c0-6.62-5.38-12-12-12z" 
            fill="${color}" 
            stroke="white" 
            stroke-width="2"/>
      <circle cx="16" cy="12" r="4" fill="white"/>
    </svg>
  `;

  // Return lazy-loaded Leaflet icon
  const iconUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

  return {
    iconUrl,
    iconSize: [32 * scale, 41 * scale] as [number, number],
    iconAnchor: [16 * scale, 41 * scale] as [number, number],
    popupAnchor: [0, -41 * scale] as [number, number],
  };
}

/**
 * Get all available marker icons by category
 */
export function getMarkerIconsByCategory(categories: string[]) {
  return categories.reduce(
    (acc, cat) => {
      acc[cat] = createColoredMarkerIcon(cat);
      return acc;
    },
    {} as Record<
      string,
      {
        iconUrl: string;
        iconSize: [number, number];
        iconAnchor: [number, number];
        popupAnchor: [number, number];
      }
    >
  );
}
