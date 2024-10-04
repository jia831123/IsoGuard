import { useState, useEffect, useRef } from 'react'
import './App.css'
import { MapContainer, TileLayer, ZoomControl, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCloudSun,          // 天氣相關
  faTriangleExclamation, // 災害潛勢
  faHouseFloodWater,   // 孤島災害
  faCloudRain,         // 雨量分析
  faCar,               // 交通相關
  faSquareRootVariable, // 數學模型
  faMicrochip,         // 機器學習
  faChartLine,         // 災害預測
  faLandmark,           // 歷史災害
  faLayerGroup,         // 新增底圖切換圖標
  faLocationCrosshairs,  // 新增定位圖標
  faCloudShowersHeavy,   // 日累積雨量
  faSatelliteDish,       // 雷達回波 (替換 faRadar)
  faTint,                 // 雨量站
  faWater,              // 土石流潛勢溪流
  faMountain,           // 土石流潛勢範圍
  faHouseCircleExclamation, // 曾發生災害孤島的村里
  faShieldHalved,       // 韌性力指標
  faGlassWaterDroplet,  // 脆弱度指標
  faScaleBalanced,      // 綜合指標
  faWind,               // IDW算法
  faDrawPolygon,        // TIN算法
  faClockRotateLeft,    // 未來以小時預測雨量
} from '@fortawesome/free-solid-svg-icons'
import { ButtonKeys } from './enums/ButtonKeys'
import { useMapOperations } from './hooks/useMapOperations'

// 修復 Leaflet 默認圖標問題
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

// 創建自定義圖標
const createCustomIcon = (iconPath: string) => {
  return L.divIcon({
    html: `<div class="custom-icon-background">
             <svg viewBox="0 0 384 512" width="20" height="20">
               <path fill="currentColor" d="${iconPath}"/>
             </svg>
           </div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

// faLocationCrosshairs 的 SVG 路徑
const locationIconPath = "M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"

const locationIcon = createCustomIcon(locationIconPath)

// 定義圖標數組
const icons = [
  faLocationCrosshairs, // 新增定位按鈕
  faLayerGroup,        // 底圖切換
  faCloudSun,          // 天氣相關
  faTriangleExclamation, // 災害潛勢
  faHouseFloodWater,   // 孤島災害
  faCloudRain,         // 雨量分析
  faCar,               // 交通相關
  faSquareRootVariable, // 數學模型
  faMicrochip,         // 機器學習
  faChartLine,         // 災害預測
  faLandmark           // 歷史災害
]

// 定義底圖選項
const basemaps = [
  {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  {
    name: 'Terrain',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
]

// 新增這個組件來更新地圖視圖
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function LocationMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null)
  const map = useMap()

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    })
  }, [map])

  return position === null ? null : (
    <Marker position={position} icon={locationIcon}>
    </Marker>
  )
}

// 定義天氣相關的子圖標
const weatherSubIcons = [
  { icon: faCloudShowersHeavy, title: "日累積雨量" },
  { icon: faSatelliteDish, title: "雷達回波" },  
  { icon: faTint, title: "雨量站" }
]

// 定義災害潛勢相關的子圖標
const disasterPotentialSubIcons = [
  { icon: faWater, title: "土石流潛勢溪流" },
  { icon: faMountain, title: "土石流潛勢範圍" },
  { icon: faHouseCircleExclamation, title: "曾發生災害孤島的村里" }
]

// 定義孤島災害相關的子圖標
const isolatedDisasterSubIcons = [
  { icon: faShieldHalved, title: "韌性力指標" },
  { icon: faGlassWaterDroplet, title: "脆弱度指標" },
  { icon: faScaleBalanced, title: "綜合指標" }
]

// 定義雨量分析相關的子圖標
const rainfallAnalysisSubIcons = [
  { icon: faWind, title: "IDW算法" },
  { icon: faDrawPolygon, title: "TIN算法" },
  { icon: faClockRotateLeft, title: "未來以小時預測雨量" }
]

function App() {
  const [center, setCenter] = useState<[number, number]>([25.0330, 121.5654]) // 初始值設為台北市中心
  const [currentBasemap, setCurrentBasemap] = useState(0)
  const [showLocation, setShowLocation] = useState(false)
  const [activeButtons, setActiveButtons] = useState<{ [key: string]: boolean }>({});
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // 在組件加載時獲取用戶位置
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
          setCenter(newCenter);
          // 使用 mapRef 來更新地圖視圖
          if (mapRef.current) {
            mapRef.current.setView(newCenter, mapRef.current.getZoom());
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          // 如果無法獲取位置，保持默認中心點
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  }, []);

  const changeBasemap = () => {
    setCurrentBasemap((prev) => (prev + 1) % basemaps.length)
  }

  const { handleSubButtonClick: handleSubClick } = useMapOperations(mapRef)

  const handleLocationClick = () => {
    setShowLocation(prev => !prev)
    if (mapRef.current) {
      mapRef.current.setView(center, mapRef.current.getZoom());
    }
  }

  const handleSubButtonClick = (buttonKey: ButtonKeys, subIndex: number) => {
    setActiveButtons(prev => ({
      ...prev,
      [`${buttonKey}-${subIndex}`]: !prev[`${buttonKey}-${subIndex}`]
    }));
    handleSubClick(buttonKey, subIndex)
  };

  return (
    <div className="app-container">
      <MapContainer
        center={center}
        zoom={13}
        className="map-container custom-map"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          url={basemaps[currentBasemap].url}
          attribution={basemaps[currentBasemap].attribution}
        />
        {showLocation && <LocationMarker />}
        <MapUpdater center={center} />
        <div className="controls-wrapper">
          <ZoomControl position="topleft" />
          <div className="custom-buttons">
            {icons.map((icon, index) => (
              <div key={index} className="custom-button-container">
                <button
                  className="custom-button"
                  onClick={index === 0 ? handleLocationClick : index === 1 ? changeBasemap : undefined}
                  title={index === 0 ? "Show current location" : index === 1 ? `Change basemap (Current: ${basemaps[currentBasemap].name})` : undefined}
                >
                  <FontAwesomeIcon icon={icon} />
                </button>
                {index === 2 && (
                  <div className="popover">
                    {weatherSubIcons.map((subIcon, subIndex) => (
                      <button
                        key={subIndex}
                        className={`popover-button ${activeButtons[`${ButtonKeys.Weather}-${subIndex}`] ? 'active' : ''}`}
                        title={subIcon.title}
                        onClick={() => handleSubButtonClick(ButtonKeys.Weather, subIndex)}
                      >
                        <FontAwesomeIcon icon={subIcon.icon} />
                      </button>
                    ))}
                  </div>
                )}
                {index === 3 && (
                  <div className="popover">
                    {disasterPotentialSubIcons.map((subIcon, subIndex) => (
                      <button
                        key={subIndex}
                        className={`popover-button ${activeButtons[`${ButtonKeys.DisasterPotential}-${subIndex}`] ? 'active' : ''}`}
                        title={subIcon.title}
                        onClick={() => handleSubButtonClick(ButtonKeys.DisasterPotential, subIndex)}
                      >
                        <FontAwesomeIcon icon={subIcon.icon} />
                      </button>
                    ))}
                  </div>
                )}
                {index === 4 && (
                  <div className="popover">
                    {isolatedDisasterSubIcons.map((subIcon, subIndex) => (
                      <button
                        key={subIndex}
                        className={`popover-button ${activeButtons[`${ButtonKeys.IsolatedDisaster}-${subIndex}`] ? 'active' : ''}`}
                        title={subIcon.title}
                        onClick={() => handleSubButtonClick(ButtonKeys.IsolatedDisaster, subIndex)}
                      >
                        <FontAwesomeIcon icon={subIcon.icon} />
                      </button>
                    ))}
                  </div>
                )}
                {index === 5 && (
                  <div className="popover">
                    {rainfallAnalysisSubIcons.map((subIcon, subIndex) => (
                      <button
                        key={subIndex}
                        className={`popover-button ${activeButtons[`${ButtonKeys.RainfallAnalysis}-${subIndex}`] ? 'active' : ''}`}
                        title={subIcon.title}
                        onClick={() => handleSubButtonClick(ButtonKeys.RainfallAnalysis, subIndex)}
                      >
                        <FontAwesomeIcon icon={subIcon.icon} />
                      </button>
                    ))}
                  </div>
                )}
                {index > 5 && (
                  <div className="popover">
                    {[0, 1, 2].map((subIndex) => (
                      <button
                        key={subIndex}
                        className={`popover-button ${activeButtons[`button-${index}-${subIndex}`] ? 'active' : ''}`}
                        onClick={() => handleSubButtonClick(ButtonKeys.RainfallAnalysis, 0)}
                      >
                        <FontAwesomeIcon icon={icon} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </MapContainer>
    </div>
  )
}

export default App