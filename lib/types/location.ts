// Type definitions untuk data lokasi dari backend
export interface Coordinates {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Location {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: Coordinates;
  createdAt: string;
  updatedAt: string;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export type Category = string;
