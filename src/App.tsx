import { useState } from 'react'
import './App.css'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
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
  faLandmark           // 歷史災害
} from '@fortawesome/free-solid-svg-icons'

// 修復 Leaflet 默認圖標問題
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

// 定義圖標數組
const icons = [
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

function App() {
  const [center] = useState<[number, number]>([25.0330, 121.5654]) // 台北市中心的經緯度

  return (
    <div className="app-container">
      <MapContainer center={center} zoom={13} className="map-container custom-map" zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <div className="controls-wrapper">
          <ZoomControl position="topleft" />
          <div className="custom-buttons">
            {icons.map((icon, index) => (
              <div key={index} className="custom-button-container">
                <button className="custom-button"><FontAwesomeIcon icon={icon} /></button>
                <div className="popover">
                  <button className="popover-button"><FontAwesomeIcon icon={icon} /></button>
                  <button className="popover-button"><FontAwesomeIcon icon={icon} /></button>
                  <button className="popover-button"><FontAwesomeIcon icon={icon} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MapContainer>
    </div>
  )
}

export default App
