import L from 'leaflet';

export const createRainStationIcon = (rainfall: number) => {
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
export const createClusterIcon = (cluster: L.MarkerCluster) => {
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