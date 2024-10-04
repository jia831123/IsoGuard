import L from 'leaflet'
import { ButtonKeys } from '../enums/ButtonKeys'
import {
  faCloudShowersHeavy, faSatelliteDish, faTint,
  faWater, faMountain, faHouseCircleExclamation,
  faShieldHalved, faGlassWaterDroplet, faScaleBalanced,
  faWind, faDrawPolygon, faClockRotateLeft
} from '@fortawesome/free-solid-svg-icons'
import {useDebridRiver} from '@/server/api/useDebridRiver'
import { GeoJsonObject } from 'geojson'

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
      return null
     } }
  ],
  [ButtonKeys.DisasterPotential]: [
    { icon: faWater, title: "土石流潛勢溪流", action: async() => {
      const data = await useDebridRiver()
      return  L.geoJSON(data as GeoJsonObject)
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
    { icon: faWind, title: "IDW算法", action: () => { /* 實現IDW算法功能 */ } },
    { icon: faDrawPolygon, title: "TIN算法", action: () => { /* 實現TIN算法功能 */ } },
    { icon: faClockRotateLeft, title: "未來以小時預測雨量", action: () => { /* 實現未來以小時預測雨量功能 */ } }
  ]
}