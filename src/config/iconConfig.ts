import L from 'leaflet'
import 'leaflet.markercluster'
import { ButtonKeys } from '../enums/ButtonKeys'
import {
  faCloudShowersHeavy, faSatelliteDish, faTint,
  faWater, faMountain, faHouseCircleExclamation,
  faShieldHalved, faGlassWaterDroplet, faScaleBalanced,
  faWind, faDrawPolygon, faClockRotateLeft
} from '@fortawesome/free-solid-svg-icons'
import { useDebridRiver } from '@/server/api/useDebridRiver'
import { GeoJsonObject } from 'geojson'
import { useRainStation } from '@/server/api/useRainStation'

const createRainStationIcon = (rainfall: number) => {
  const getColor = (value: number) => {
    if (value > 80) return '#FF0000';
    if (value > 50) return '#FFA500';
    if (value > 30) return '#FFFF00';
    if (value > 10) return '#00FF00';
    return '#87CEEB';
  };

  const color = getColor(rainfall);
  const size = Math.max(30, Math.min(30 + rainfall / 2, 50)); // 確保 size 在 30 到 50 之間

  return L.divIcon({
    className: 'custom-rain-station-icon',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.5), inset 0 0 5px rgba(255,255,255,0.5);
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 50%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
          border-radius: 50% 50% 0 0;
        "></div>
        <svg viewBox="0 0 352 512" width="${Math.max(size/2, 1)}" height="${Math.max(size/2, 1)}" style="filter: drop-shadow(0 1px 1px rgba(0,0,0,0.5));">
          <path fill="white" d="M205.22 22.09c-7.94-28.78-49.44-30.12-58.44 0C100.01 179.85 0 222.72 0 333.91 0 432.35 78.72 512 176 512s176-79.65 176-178.09c0-111.75-99.79-153.34-146.78-311.82zM176 448c-61.75 0-112-50.25-112-112 0-8.84 7.16-16 16-16s16 7.16 16 16c0 44.11 35.89 80 80 80 8.84 0 16 7.16 16 16s-7.16 16-16 16z"/>
        </svg>
      </div>
      <div style="
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(255,255,255,0.8);
        color: ${color};
        padding: 2px 4px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      ">
        ${rainfall} mm
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

// 添加這個函數來創建自定義的聚類圖標
const createClusterIcon = (cluster: L.MarkerCluster) => {
  const childCount = cluster.getChildCount();
  let size = 40;
  let className = 'rainfall-cluster-icon small';

  if (childCount > 10) {
    size = 60;
    className = 'rainfall-cluster-icon medium';
  }
  if (childCount > 100) {
    size = 80;
    className = 'rainfall-cluster-icon large';
  }

  return L.divIcon({
    html: `<div><span>${childCount}</span></div>`,
    className: className,
    iconSize: L.point(size, size)
  });
};

export const iconConfig = {
  [ButtonKeys.Weather]: [
    { icon: faCloudShowersHeavy, title: "日累積雨量", action: () => { 
      console.log('日累積雨量')

      return L.imageOverlay(
        'https://alerts.ncdr.nat.gov.tw/DownLoadNewAssistData.ashx/9',
       [[25.3343309654311,120.016611031922],[21.8682756536471,122.034749689268]],{
        opacity: 0.7,
       }
      )
     } },
    { icon: faSatelliteDish, title: "雷達回波", action: () => { 
      return L.imageOverlay(
        'https://alerts.ncdr.nat.gov.tw/DownLoadNewAssistData.ashx/8',
       [[27.2037071362372,114.996294366279],[19.1921270314352,129.225927854919]],{
        opacity: 0.7,
       }
      )

     } },
    { icon: faTint, title: "雨量站", action: async () => { 
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
    }}
  ],
  [ButtonKeys.DisasterPotential]: [
    { icon: faWater, title: "土石流潛勢溪流", action: async() => {
      function debridFlowStyle(feature: { properties: { Potential: string } }) {
        const potentialColorMap: Record<string, string> = {
          '高': 'red',
          '中': 'yellow',
          '低': 'green'
        };

        const getColor = (potential: string) => potentialColorMap[potential] || 'orange';

        return {
          fillColor: getColor(feature?.properties?.Potential),
          weight: 1,
          opacity: 1,
          color: getColor(feature?.properties?.Potential),
          dashArray: '0',
          fillOpacity: 0.4,
        }
      }
      const data = await useDebridRiver()
      return data ? L.geoJSON(data as GeoJsonObject, {
        style: (feature) => {
          if (feature && feature.properties) {
            return debridFlowStyle(feature as { properties: { Potential: string } });
          }
          return {};
        }
      }) : null
     } },
    { icon: faMountain, title: "土石流潛勢範圍", action: () => { /* 實現土石流潛勢範圍功能 */ } },
    { icon: faHouseCircleExclamation, title: "曾發生災害孤島的村里", action: () => { /* 實現曾發生災害孤島的村里功能 */ } }
  ],
  [ButtonKeys.IsolatedDisaster]: [
    { icon: faShieldHalved, title: "韌性力指標", action: () => { /* 實現韌性力指標功能 */ } },
    { icon: faGlassWaterDroplet, title: "脆弱度指標", action: () => { /* 實現脆弱度指標功能 */ } },
    { icon: faScaleBalanced, title: "綜合指標", action: () => { /* 實現綜合指標功能 */ } }
  ],
  [ButtonKeys.RainfallAnalysis]: [
    { icon: faWind, title: "IDW算法", action: () => { /* 實現IDW算法能 */ } },
    { icon: faDrawPolygon, title: "TIN算法", action: () => { /* 實現TIN算法功能 */ } },
    { icon: faClockRotateLeft, title: "未來以小時預測雨量", action: () => { /* 實現未來以小時預測雨量功能 */ } }
  ]
}