import { faWind, faDrawPolygon, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';

export const rainfallAnalysisLayers = [
  {
    icon: faWind,
    title: "IDW算法",
    action: () => {
      // 實現IDW算法功能
      console.log("IDW算法功能尚未實現");
      return null;
    }
  },
  {
    icon: faDrawPolygon,
    title: "TIN算法",
    action: () => {
      // 實現TIN算法功能
      console.log("TIN算法功能尚未實現");
      return null;
    }
  },
  {
    icon: faClockRotateLeft,
    title: "未來以小時預測雨量",
    action: () => {
      // 實現未來以小時預測雨量功能
      console.log("未來以小時預測雨量功能尚未實現");
      return null;
    }
  }
];