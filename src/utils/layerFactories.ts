import L from 'leaflet';
import { GeoJsonObject } from 'geojson';

export const createImageOverlay = (url: string, bounds: L.LatLngBoundsExpression, options?: L.ImageOverlayOptions) => {
  return L.imageOverlay(url, bounds, options);
};

export const createGeoJSONLayer = (data: GeoJsonObject, options?: L.GeoJSONOptions) => {
  return L.geoJSON(data, options);
};

export const createMarkerClusterGroup = (options?: L.MarkerClusterGroupOptions) => {
  return L.markerClusterGroup(options);
};