/**
 * 计算两个经纬度之间的距离（单位：米）
 * @param {Number} lat1 纬度1
 * @param {Number} lon1 经度1
 * @param {Number} lat2 纬度2
 * @param {Number} lon2 经度2
 * @returns {Number} 距离（米）
 */
export function getDistance(lat1, lon1, lat2, lon2) {
	if(!lat1||!lon1||!lat2||!lon2){
		return 0;
	}
  const R = 6371000; // 地球半径，单位：米
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // 单位：米
}