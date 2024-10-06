import { faWater, faMountain, faHouseCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { createGeoJSONLayer } from '../../utils/layerFactories';
import { useDebridRiver } from '@/server/api/useDebridRiver';
import { useDebridRiverImpack } from '@/server/api/useDebridRiverImpack';
import { useIsolateVallage114 } from '@/server/api/useIsolateVallage';
import { GeoJsonObject } from 'geojson';
import L from 'leaflet';

function debridFlowStyle(feature: { properties: { Potential: string } }) {
  const potentialColorMap: Record<string, string> = {
    '高': '#FF0000',
    '中': '#FFA500',
    '低': '#FFFF00'
  };

  const getColor = (potential: string) => potentialColorMap[potential] || '#FFA500';

  return {
    fillColor: getColor(feature?.properties?.Potential),
    weight: 2,
    opacity: 1,
    color: '#000',
    dashArray: '3',
    fillOpacity: 0.7,
  }
}

function debridImpactStyle(feature: any) {
  return {
    fillColor: '#FF1493',
    weight: 2,
    opacity: 1,
    color: '#800080',
    dashArray: '5',
    fillOpacity: 0.5,
  }
}

function isolatedVillageStyle(feature: any) {
  return {
    fillColor: '#8B4513',  // 深棕色
    weight: 2,
    opacity: 1,
    color: '#D2691E',  // 淺棕色邊框
    dashArray: '3',
    fillOpacity: 0.7,
  };
}

export const disasterPotentialLayers = [
  {
    icon: faWater,
    title: "土石流潛勢溪流",
    action: async () => {
      const data = await useDebridRiver();
      return data ? createGeoJSONLayer(data as GeoJsonObject, {
        style: (feature) => {
          if (feature && feature.properties) {
            return debridFlowStyle(feature as { properties: { Potential: string } });
          }
          return {};
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            layer.bindPopup(`
              <div class="debrid-flow-popup">
                <h3>土石流潛勢溪流資訊</h3>
                <p><strong>編號：</strong>${feature.properties.DebrisID || '未知'}</p>
                <p><strong>潛勢等級：</strong>${feature.properties.Potential || '未知'}</p>
                <p><strong>縣市：</strong>${feature.properties.County || '未知'}</p>
                <p><strong>鄉鎮：</strong>${feature.properties.Town || '未知'}</p>
              </div>
            `);
          }
          layer.on({
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.9
              });
              layer.bringToFront();
            },
            mouseout: (e) => {
              const layer = e.target;
              layer.setStyle(debridFlowStyle(feature as { properties: { Potential: string } }));
            },
            click: (e) => {
              const map = e.target._map;
              map.fitBounds(e.target.getBounds());
            }
          });
        }
      }) : null;
    }
  },
  {
    icon: faMountain,
    title: "土石流潛勢範圍",
    action: async() => {
      const data = await useDebridRiverImpack();
      if(data){
        return createGeoJSONLayer(data as GeoJsonObject, {
          style: debridImpactStyle,
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              layer.bindPopup(`
                <div class="debrid-impact-popup">
                  <h3>土石流影響範圍資訊</h3>
                  <p><strong>編號：</strong>${feature.properties.DebrisID || '未知'}</p>
                  <p><strong>影響面積：</strong>${feature.properties.Area ? feature.properties.Area.toFixed(2) + ' 平方公里' : '未知'}</p>
                  <p><strong>縣市：</strong>${feature.properties.County || '未知'}</p>
                  <p><strong>鄉鎮：</strong>${feature.properties.Town || '未知'}</p>
                </div>
              `);
            }
            layer.on({
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  weight: 5,
                  color: '#666',
                  dashArray: '',
                  fillOpacity: 0.9
                });
                layer.bringToFront();
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(debridImpactStyle(feature));
              },
              click: (e) => {
                const map = e.target._map;
                map.fitBounds(e.target.getBounds());
              }
            });
          }
        });
      }
      return null;
    }
  },
  {
    icon: faHouseCircleExclamation,
    title: "曾發生災害孤島的村里",
    action: async() => {
      const data = await useIsolateVallage114()
      if(data){
        return createGeoJSONLayer(data as GeoJsonObject, {
          style: isolatedVillageStyle,
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              layer.bindPopup(`
                <div class="isolated-village-popup">
                  <h3>災害孤島村里資訊</h3>
                  <p><strong>村里名稱：</strong>${feature.properties.VILLNAME || '未知'}</p>
                  <p><strong>鄉鎮市區：</strong>${feature.properties.TOWNNAME || '未知'}</p>
                  <p><strong>縣市：</strong>${feature.properties.COUNTYNAME || '未知'}</p>
                  <p><strong>人口數：</strong>${feature.properties.POPULATION || '未知'}</p>
                  <p><strong>面積：</strong>${feature.properties.AREA ? (feature.properties.AREA / 10000).toFixed(2) + ' 平方公里' : '未知'}</p>
                </div>
              `);
            }
            layer.on({
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  weight: 5,
                  color: '#FF8C00',  // 深橙色
                  dashArray: '',
                  fillOpacity: 0.9
                });
                layer.bringToFront();
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(isolatedVillageStyle(feature));
              },
              click: (e) => {
                const map = e.target._map;
                map.fitBounds(e.target.getBounds());
              }
            });
          }
        });
      }
      return null;
    }
  }
];