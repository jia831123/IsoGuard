import { faShieldHalved, faGlassWaterDroplet, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';

export const isolatedDisasterLayers = [
  {
    icon: faShieldHalved,
    title: "韌性力指標",
    action: () => {
      // 實現韌性力指標功能
      console.log("韌性力指標功能尚未實現");
      return null;
    }
  },
  {
    icon: faGlassWaterDroplet,
    title: "脆弱度指標",
    action: () => {
      // 實現脆弱度指標功能
      console.log("脆弱度指標功能尚未實現");
      return null;
    }
  },
  {
    icon: faScaleBalanced,
    title: "綜合指標",
    action: () => {
      // 實現綜合指標功能
      console.log("綜合指標功能尚未實現");
      return null;
    }
  }
];