import { faCloudShowersHeavy, faSatelliteDish, faTint } from '@fortawesome/free-solid-svg-icons';
import { createImageOverlay, createMarkerClusterGroup } from '../../utils/layerFactories';
import { createRainStationIcon, createClusterIcon } from '../../utils/iconFactories';
import { useRainStation } from '@/server/api/useRainStation';
import 'leaflet.markercluster'
import { GeoJsonObject } from 'geojson';
import L from 'leaflet';

export const weatherLayers = [
  {
    icon: faCloudShowersHeavy,
    title: "日累積雨量",
    action: () => createImageOverlay(
      'https://alerts.ncdr.nat.gov.tw/DownLoadNewAssistData.ashx/9',
      [[25.3343309654311,120.016611031922],[21.8682756536471,122.034749689268]],
      { opacity: 0.7 }
    )
  },
  {
    icon: faSatelliteDish,
    title: "雷達回波",
    action: () => createImageOverlay(
      'https://alerts.ncdr.nat.gov.tw/DownLoadNewAssistData.ashx/8',
      [[27.2037071362372,114.996294366279],[19.1921270314352,129.225927854919]],
      { opacity: 0.7 }
    )
  },
  {
    icon: faTint,
    title: "雨量站",
    action: async () => {
      const data = await useRainStation()
      if(data){
        const geojson = {
          type: 'FeatureCollection',
          features: [
            ...data.records.Station.map(station => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [station.GeoInfo.Coordinates[1].StationLongitude, station.GeoInfo.Coordinates[1].StationLatitude]
              },
              properties: {
                siteName: station.StationName,
                siteId: station.StationId,
                publishTime: station.ObsTime.DateTime,
                rainfall: parseFloat(String(station.WeatherElement.Now.Precipitation)) || 0,
                county: station.GeoInfo.CountyName,
                town: station.GeoInfo.TownName,
              }
            }))
          ],
        };

        const markers = L.markerClusterGroup({
          chunkedLoading: true,
          spiderfyOnMaxZoom: false,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          iconCreateFunction: createClusterIcon,
          maxClusterRadius: 80, // 調整聚類的最大半徑
          disableClusteringAtZoom: 12 // 在縮放級別 12 及以上時禁用聚類
        });

        const geoJsonLayer = L.geoJSON(geojson as GeoJsonObject, {
          pointToLayer: (feature, latlng) => {
            return L.marker(latlng, {
              icon: createRainStationIcon(feature.properties.rainfall)
            });
          },
          onEachFeature: (feature, layer) => {
            const popupContent = `
              <div class="rain-station-popup">
                <h3>${feature.properties.siteName}</h3>
                <div class="rain-station-info">
                  <p><strong>站點ID:</strong> ${feature.properties.siteId}</p>
                  <p><strong>位置:</strong> ${feature.properties.county}${feature.properties.town}</p>
                  <p><strong>雨量:</strong> <span class="rainfall">${feature.properties.rainfall} mm</span></p>
                  <p><strong>發布時間:</strong> ${new Date(feature.properties.publishTime).toLocaleString()}</p>
                </div>
              </div>
            `;
            layer.bindPopup(popupContent, {
              className: 'rain-station-popup-container',
              maxWidth: 300
            });
          }
        });

        markers.addLayer(geoJsonLayer);
        return markers;
      }
      return null
    }
  }
];