import { faExclamationTriangle, faRoad, faHouseCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { createGeoJSONLayer } from '../../utils/layerFactories';

import { useIsolateVallage114 } from '@/server/api/useIsolateVallage';
import { GeoJsonObject } from 'geojson';
import L from 'leaflet';
import { useCapRoad } from '@/hooks/useCapRoad';

function capStyle(feature: any) {
  const severityColors = {
    Extreme: "#d32f2f",
    Severe: "#f57c00",
    Moderate: "#fbc02d",
    Minor: "#388e3c",
    Unknown: "#607d8b"
  };

  const severity = feature.properties.severity || "Unknown";
  const color = severityColors[severity] || severityColors.Unknown;

  return L.divIcon({
    className: `cap-marker ${severity.toLowerCase()}`,
    html: `<div style="background-color: ${color};"></div>`,
    iconSize: [16, 16]
  });
}

function roadBlockStyle(feature: any) {
  return {
    radius: 8,
    fillColor: "#ff0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
}

function isolatedVillageStyle(feature: any) {
  return {
    fillColor: '#8B4513',
    weight: 2,
    opacity: 1,
    color: '#D2691E',
    dashArray: '3',
    fillOpacity: 0.7,
  };
}

export const trafficLayers = [
  {
    icon: faExclamationTriangle,
    title: "CAP",
    action: async () => {
      const data = await useCapRoad();
      console.log(data)
      const alertGeoJson = {
        type: 'FeatureCollection',
        features: data.map(item=>({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: (() => {
              const [longitude, latitude] = item.info[0].area[0].circle.match(/^(\d+\.\d+),(\d+\.\d+)/)?.slice(1) ?? [];
              return [Number(latitude), Number(longitude)];
            })(),
          },
          properties: {
            event: item.info[0].event,
            headline: item.info[0].headline,
            senderName: item.info[0].senderName,
            description: item.info[0].description,
            circle: item.info[0].area[0].circle,
            effective: item.info[0].effective,
            expires: item.info[0].expires,
            instruction: item.info[0].instruction,
            severity: item.info[0].severity,
          }
        })),
      }
      return data ? createGeoJSONLayer(alertGeoJson as GeoJsonObject, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, { icon: capStyle(feature) });
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            layer.bindPopup(`
              <div class="custom-popup cap-popup">
                <h3>CAP 警報資訊</h3>
                <p><strong>事件：</strong> ${feature.properties.event || '未知'}</p>
                <p><strong>標題：</strong> ${feature.properties.headline || '未知'}</p>
                <p><strong>發布單位：</strong> ${feature.properties.senderName || '未知'}</p>
                <p><strong>描述：</strong> ${feature.properties.description || '未知'}</p>
                <p><strong>嚴重程度：</strong> <span class="severity ${feature.properties.severity?.toLowerCase()}">${feature.properties.severity || '未知'}</span></p>
              </div>
            `,{
              className: 'custom-popup-container',
              maxWidth: 300
            });
          }
        }
      }) : null;
    }
  },
  {
    icon: faRoad,
    title: "道路中斷點",
    action: async () => {
      return null
    }
  },
  {
    icon: faHouseCircleExclamation,
    title: "孤島發生村里",
    action: async () => {
      const data = await useIsolateVallage114();
      return data ? createGeoJSONLayer(data as GeoJsonObject, {
        style: isolatedVillageStyle,
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            layer.bindPopup(`
              <div class="custom-popup isolated-village-popup">
                <h3>孤島村里資訊</h3>
                <p><strong>村里名稱：</strong>${feature.properties.VILLNAME || '未知'}</p>
                <p><strong>鄉鎮市區：</strong>${feature.properties.TOWNNAME || '未知'}</p>
                <p><strong>縣市：</strong>${feature.properties.COUNTYNAME || '未知'}</p>
                <p><strong>人口數：</strong>${feature.properties.POPULATION || '未知'}</p>
                <p><strong>面積：</strong>${feature.properties.AREA ? (feature.properties.AREA / 10000).toFixed(2) + ' 平方公里' : '未知'}</p>
              </div>
            `);
          }
        }
      }) : null;
    }
  }
];