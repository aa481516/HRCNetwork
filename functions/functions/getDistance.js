
// eslint-disable-next-line require-jsdoc
function getDistance(lat1, lng1, lat2, lng2, unit) {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lng1 - lng2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) *
    Math.sin(radlat2) +
    Math.cos(radlat1) *
    Math.cos(radlat2) *
    Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;

  return dist <= unit;
}

module.exports = getDistance;

