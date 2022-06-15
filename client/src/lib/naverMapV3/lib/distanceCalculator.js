import {
  UNIT_DISTANCE,
} from './constants';
import mapUtils from './utils';

// NOTE: server/app/lib/common/distance.js 파일과 동일한 내용입니다.

// from https://www.geodatasource.com/developers/javascript
//
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::                                                                         :::
// :::  This routine calculates the distance between two points (given the     :::
// :::  latitude/longitude of those points). It is being used to calculate     :::
// :::  the distance between two locations using GeoDataSource (TM) prodducts  :::
// :::                                                                         :::
// :::  Definitions:                                                           :::
// :::    South latitudes are negative, east longitudes are positive           :::
// :::                                                                         :::
// :::  Passed to function:                                                    :::
// :::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
// :::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
// :::    unit = the unit you desire for results                               :::
// :::           where: 'MILE' is statute miles                                :::
// :::                  'KILOMETER' is kilometers                              :::
// :::                  'METER' is meters       (default)                      :::
// :::                  'NAUTICALMILE' is nautical miles                       :::
// :::                                                                         :::
// :::  Worldwide cities and other features databases with latitude longitude  :::
// :::  are available at https://www.geodatasource.com                         :::
// :::                                                                         :::
// :::  For enquiries, please contact sales@geodatasource.com                  :::
// :::                                                                         :::
// :::  Official Web site: https://www.geodatasource.com                       :::
// :::                                                                         :::
// :::               GeoDataSource.com (C) All Rights Reserved 2018            :::
// :::                                                                         :::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const distance = (lat1, lon1, lat2, lon2, unit = UNIT_DISTANCE.METER) => {
  if (![...Object.values(UNIT_DISTANCE)].includes(unit)) return 0;
  if ((lat1 === lat2) && (lon1 === lon2)) return 0;

  const radlat1 = Math.PI * (lat1 / 180);
  const radlat2 = Math.PI * (lat2 / 180);
  const theta = lon1 - lon2;
  const radtheta = Math.PI * (theta / 180);
  // eslint-disable-next-line max-len
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist) * (180 / Math.PI) * (60 * 1.1515);

  switch (unit) {
    case UNIT_DISTANCE.METER: // meter
      return dist * 1609.344;
    case UNIT_DISTANCE.KILOMETER: // kilometers
      return dist * 1.609344;
    case UNIT_DISTANCE.MILE: // miles
      return dist * 0.8684;
    case UNIT_DISTANCE.NAUTICALMILE: // nautical miles
      return dist;
    default:
      break;
  }
  return 0;
};

const calculateActualDistance = (lat1, lon1, lat2, lon2, rate, unit) => {
  const linerDistance = distance(lat1, lon1, lat2, lon2, unit);
  const actualDistance = Math.ceil(linerDistance * rate);
  return actualDistance;
};

/**
 * 2 개의 point 간의 거리(m)를 구합니다.
 * 직선거리의 1.3 배율을 적용합니다.
 *
 * @param {object} p1 - lat(위도), lng(경도)를 가지는 위치 정보
 * @param {object} p2 - lat(위도), lng(경도)를 가지는 위치 정보
 *
 * @return {number} 2 개의 point 간의 거리(m) number 값
 */
const calculateActualDistanceBy2Points = (p1, p2) => {
  if (!mapUtils.isValidPoint(p1)) {
    return 0;
  }
  if (!mapUtils.isValidPoint(p2)) {
    return 0;
  }
  const rate = 1;
  return calculateActualDistance(p1.lat, p1.lng, p2.lat, p2.lng, rate);
};

export default {
  distance,
  calculateActualDistance,
  calculateActualDistanceBy2Points,
};
