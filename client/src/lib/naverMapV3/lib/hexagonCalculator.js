import {
  h3SetToMultiPolygon, // https://h3geo.org/docs/api/regions#h3settolinkedgeo--h3settomultipolygon
  h3ToGeoBoundary, // https://h3geo.org/docs/api/indexing#h3togeoboundary
  polyfill, // https://h3geo.org/docs/api/regions#polyfill
  geoToH3, // https://h3geo.org/docs/api/indexing#geotoh3
  kRing, // https://h3geo.org/docs/api/traversal#kring
} from 'h3-js';
import GeoJSON from 'geojson';
import {
  add,
  subtract,
  round,
} from 'mathjs';
import {
  H3_RESOLUTION,
  Z_INDEX_HEXGON_USER_SELECT,
  Z_INDEX_POLYGON_BORDER,
} from './constants';
import naverMapWrapper from './naverMapWrapper';
import boundHandler from './boundHandler';
import mapUtils from './utils';

/**
 * H3를 좌표값 배열로 바꿔줍니다.
 *
 * @deprecated
 *
 * @param {array} h3Indexes - GeoJSON으로 바꿀 H3 배열
 *
 * @return {object} Point{ lat, lng } 배열 객체
 */
const convertH3IndexToPoints = (h3Indexes) => {
  const points = [];
  h3Indexes.forEach((v) => {
    h3ToGeoBoundary(v).forEach((e) => {
      points.push({ lat: e[0], lng: e[1] });
    });
  });
  return points;
};

/**
 * 좌표값 배열을 경계(Bound) 객체로 바꿔줍니다.
 *
 * @param {array} points - Point{ lat, lng } 배열 객체
 *
 * @return {Bound} 경계 객체
 */
const convertPointsToBound = (points) => {
  const src = points.reduce((acc, v) => {
    const { lat, lng } = v;

    if (!mapUtils.isLatitude(lat)) {
      throw new Error(`lat:${lat}: 유효하지 않음`);
    }
    if (!mapUtils.isLongitude(lng)) {
      throw new Error(`lng:${lng}: 유효하지 않음`);
    }

    const result = {
      ...acc,
    };
    if (!result.maxLat || result.maxLat < lat) {
      result.maxLat = lat;
    }
    if (!result.minLat || result.minLat > lat) {
      result.minLat = lat;
    }
    if (!result.maxLng || result.maxLng < lng) {
      result.maxLng = lng;
    }
    if (!result.minLng || result.minLng > lng) {
      result.minLng = lng;
    }

    return result;
  }, {
    maxLat: null,
    minLat: null,
    maxLng: null,
    minLng: null,
  });

  const {
    maxLat,
    minLat,
    maxLng,
    minLng,
  } = src;

  return boundHandler.createBounds(
    {
      lat: minLat,
      lng: minLng,
    },
    {
      lat: maxLat,
      lng: maxLng,
    },
  );
};

export default {
  /**
   * Point 배열을 h3Index의 배열로 바꿔줍니다
   *
   * @param {array<Point>} - Point의 배열
   *
   * @return {array<H3Index>} - h3Index의 배열
   */
  convertPointsToH3Indexes(points) {
    if (!points) {
      return [];
    }
    points.forEach((p) => {
      if (!mapUtils.isValidPoint(p)) {
        throw new Error(`p:${p}/유효하지 않습니다.`);
      }
    });

    const polygon = points.map(({ lat, lng }) => ([lat, lng]));
    // https://github.com/uber/h3-js#useful-algorithms
    return polyfill(polygon, H3_RESOLUTION);
  },

  /**
   * 좌표값을 H3Index로 바꿔줍니다.
   *
   * @param {object} Point{ lat, lng }
   *
   * @return {object} h3Index
   */
  convertPointToH3Index({ lat, lng }) {
    return geoToH3(lat, lng, H3_RESOLUTION);
  },

  // TODO 아래 예제처럼 polygon에 들어있는 모든 h3Index를 구할 수 있음.
  // 1. 선택된 h3Index의 테두리에 포함된 모든 h3Index를 구함
  // 2. 실제 가지고 있는 h3Index 리스트에서 1번에서 구한 h3Index리스트에 포함되지 않은 h3Index를 구함. 이 h3Index가 제외할 것들이 된다.

  /**
   * 최고 위도, 최고 경도, 최저 위도, 최저 경도값을 받아 이 범위에 포함되거나 걸쳐있는 모든 H3 배열을 구합니다
   * @param {number} maxLat - 최고 위도
   * @param {number} maxLng - 최고 경도
   * @param {number} minLat - 최저 위도
   * @param {number} minLng - 최저 경도
   *
   * @return {array} 범위에 포함되거나 걸쳐있는 모든 H3 배열
   */
  getH3Indexes({
    maxLat, maxLng, minLat, minLng,
  }) {
    const fixedPoint = 7;
    // https://mathjs.org/docs/expressions/syntax.html
    const latDiff = round(subtract(maxLat, minLat) * 0.1, fixedPoint);
    const maxLatExtened = round(add(maxLat, latDiff), fixedPoint);
    const minLatExtened = round(subtract(minLat, latDiff), fixedPoint);

    const lngDiff = round(subtract(maxLng, minLng) * 0.1, fixedPoint);
    const maxLngExtened = round(add(maxLng, lngDiff), fixedPoint);
    const minLngExtened = round(subtract(minLng, lngDiff), fixedPoint);

    const polygon = [
      [minLatExtened, minLngExtened],
      [maxLatExtened, minLngExtened],
      [maxLatExtened, maxLngExtened],
      [minLatExtened, maxLngExtened],
    ];

    // https://github.com/uber/h3-js#useful-algorithms
    const h3Indexes = polyfill(polygon, H3_RESOLUTION);
    return h3Indexes;
  },

  /**
   * 사용자가 선택한 범위 안의 Hexagon들의 h3Index의 배열을 가져옵니다.
   *
   * @param {object} naverMapBounds - Naver 맵에서 선택한 경계(bound) 정보
   *
   * @return {array} 범위에 포함되거나 걸쳐있는 모든 H3 배열
   */
  getH3IndexesInBounds(naverMapBounds) {
    // 맵에서 전달한 범위보다 큰 Bounds로 변경
    const {
      _max: { _lat: maxLat, _lng: maxLng },
      _min: { _lat: minLat, _lng: minLng },
    } = naverMapBounds;

    if (!mapUtils.isLatitude(maxLat)) {
      throw new Error(`lat:${maxLat}: 유효하지 않음`);
    }
    if (!mapUtils.isLongitude(maxLng)) {
      throw new Error(`lng:${maxLng}: 유효하지 않음`);
    }
    if (!mapUtils.isLatitude(minLat)) {
      throw new Error(`lat:${minLat}: 유효하지 않음`);
    }
    if (!mapUtils.isLongitude(minLng)) {
      throw new Error(`lng:${minLng}: 유효하지 않음`);
    }

    return this.getH3Indexes({
      maxLat, maxLng, minLat, minLng,
    });
  },

  /**
   * 사용자가 선택한 범위 안의 Hexagon들의 h3Index의 배열을 가져옵니다.
   *
   * @param {object} naverMapPointBounds - Naver 맵에서 선택한 좌표경계(point bound) 정보
   *
   * @return {array} 범위에 포함되거나 걸쳐있는 모든 H3 배열
   */
  getH3IndexesInPointBounds(naverMapPointBounds) {
    const {
      _max: { y: maxLat, x: maxLng },
      _min: { y: minLat, x: minLng },
    } = naverMapPointBounds;

    if (!mapUtils.isLatitude(maxLat)) {
      throw new Error(`lat:${maxLat}: 유효하지 않음`);
    }
    if (!mapUtils.isLongitude(maxLng)) {
      throw new Error(`lng:${maxLng}: 유효하지 않음`);
    }
    if (!mapUtils.isLatitude(minLat)) {
      throw new Error(`lat:${minLat}: 유효하지 않음`);
    }
    if (!mapUtils.isLongitude(minLng)) {
      throw new Error(`lng:${minLng}: 유효하지 않음`);
    }

    return this.getH3Indexes({
      maxLat, maxLng, minLat, minLng,
    });
  },

  // TODO 아래 메서드를 업데이트해서 가운데가 빈 형태로 만들어야 함.
  /**
   * H3들을 GeoJSON 포맷으로 바꿉니다.(Naver 맵에 그릴 때, GeoJSON 포맷이 필요합니다)
   *
   * @param {array} h3Indexes - GeoJSON으로 바꿀 H3 배열
   * @param {number} zIndex - 화면에 표시될 때의 css z-index
   * @param {object} properties - GeoJSON의 추가적인 속성
   *
   * @return {object} Naver 맵에 그릴 GeoJSON 객체
   */
  convertH3IndexToGeoJson(h3Indexes, zIndex = Z_INDEX_HEXGON_USER_SELECT, properties = {}) {
    const data = h3Indexes.map((hexagon) => {
      const hexBoundary = h3ToGeoBoundary(hexagon, true/* GeoJSON format으로 받음 */);
      return {
        polygon: [hexBoundary],
        h3Index: hexagon,
        // https://navermaps.github.io/maps.js.ncp/docs/tutorial-1-datalayer.example.html
        // TODO style 정보는 외부에서 받아와야 할 수도 있다
        style: {
          zIndex,
          onMouseOver: {
            strokeWeight: 8,
          },
          onMouseOut: {
            strokeWeight: 3,
          },
        },
        ...properties,
      };
    });

    const geoJSON = GeoJSON.parse(data, { Polygon: 'polygon' });
    return geoJSON;
  },

  /**
   * H3를 경계(Bound) 객체로 바꿔줍니다.
   *
   * @deprecated convertH3IndexToPoints가 정확하지 않습니다. 사용을 자제해주세요.
   *
   * @param {array} h3Indexes - GeoJSON으로 바꿀 H3 배열
   *
   * @return {Bound} 경계 객체
   */
  convertH3IndexToBound(h3Indexes) {
    if (!h3Indexes || h3Indexes.length === 0) {
      return null;
    }
    const points = convertH3IndexToPoints(h3Indexes);
    return convertPointsToBound(points);
  },

  /**
   * H3를 Naver polygon을 그리기 위한 path 배열로 바꿔줍니다.
   *
   * @deprecated getPathsFromH3Indexes를 대신 사용해주세요
   *
   * @param {array} h3Indexes - GeoJSON으로 바꿀 H3 배열
   *
   * @return {Bound} 경계 객체
   */
  convertH3IndexesToNaverPolygonPaths(h3Indexes) {
    const points = convertH3IndexToPoints(h3Indexes);
    return points.map(({ lat, lng }) => (naverMapWrapper.getLatLng(lat, lng)));
  },

  /**
   * h3Index의 배열을 naver의 polygon들을 나타내는 ArrayOfCoordsLiteral로 바꿉니다.
   * https://navermaps.github.io/maps.js.ncp/docs/global.html#toc14__anchor
   *
   * @param {array} h3Indexes - h3Index 배열
   *
   * @return {array<ArrayOfCoordsLiteral>} Naver 폴리곤의 paths를 나타내는 배열
   */
  getPathsFromH3Indexes(h3Indexes) {
    const multiPolygons = h3SetToMultiPolygon(h3Indexes);
    // eslint-disable-next-line max-len
    const polygons = [];
    multiPolygons.forEach((multiPolygon) => {
      multiPolygon.forEach((polygon) => {
        polygons.push(polygon);
      });
    });
    return polygons.map((polygon) => polygon.map((point) => ({
      lat: point[0],
      lng: point[1],
    })));
  },

  /**
   * h3Index들의 외곽선을 Naver polygon을 그리기 위한 path 배열로 바꿔줍니다.
   *
   * @param {array} h3Indexes - GeoJSON으로 바꿀 H3 배열
   *
   * @return {array} Naver path 배열
   */

  convertH3IndexesToNaverPolygonPathOutline(h3Indexes) {
    const { naver } = window; // TODO naver 객체를 인자로 받아야 함. global에서 참조하지 말것!
    if (!naver) {
      throw new Error('naver: 유효하지 않음');
    }

    const multiPolygons = h3SetToMultiPolygon(h3Indexes);
    const paths = multiPolygons.reduce((acc, multiPolygon) => {
      const result = multiPolygon.map((points) => {
        const path = points.map((p) => (naverMapWrapper.getLatLng(p[0], p[1])));
        return path;
      });
      return [...acc, ...result];
    }, []);

    return paths;
  },

  /**
   * h3Index가 h3Index의 배열과 이웃해있는지 확인합니다.
   *
   * @param {string} h3Index - 비교할 h3Index 값
   * @param {array} h3Indexes - 비교할 h3Index 값 배열
   *
   * @return {boolean} h3Index가 h3Index의 배열과 이웃해있는지 여부
   */
  isNeighbor(h3Index, h3Indexes) { // TODO 테스트 코드 작성하기
    if (!h3Index || !h3Indexes || h3Indexes.length === 0) {
      return false;
    }

    const kDistance = 1;
    const neighbors = kRing(h3Index, kDistance);
    const neighborSet = neighbors.reduce((acc, v) => {
      acc.add(v);
      return acc;
    }, new Set());
    const found = h3Indexes.find((v) => neighborSet.has(v));
    return !!found;
  },

  /**
   * h3Index가 h3Index의 배열에 둘러싸여 있는지 확인합니다.
   *
   * @param {string} h3Index - 비교할 h3Index 값
   * @param {array} h3Indexes - 비교할 h3Index 값 배열
   *
   * @return {boolean} h3Index가 h3Index의 배열에 둘러싸여 있는지 여부
   */
  isSurrounded(h3Index, h3Indexes) { // TODO 테스트 코드 작성하기
    if (!h3Index || !h3Indexes || h3Indexes.length === 0) {
      return false;
    }

    const kDistance = 1;
    const surroundings = kRing(h3Index, kDistance);
    const surroundingSet = surroundings.reduce((acc, v) => {
      acc.add(v);
      return acc;
    }, new Set());
    h3Indexes.forEach((v) => {
      if (surroundingSet.has(v)) {
        surroundingSet.delete(v);
      }
    });

    return surroundingSet.size === 0;
  },

  /**
   * convertH3IndexToGeoJson 메서드로 포워딩(전달)합니다.
   * 지정된 z-index값(Z_INDEX_HEXGON_USER_SELECT)을 설정해줍니다.
   *
   * @param {array} h3Indexes - GeoJSON으로 바꿀 H3 배열
   * @param {string} h3IndexGroupId - H3 group의 id
   *
   * @return {object} Naver 맵에 그릴 GeoJSON 객체
   */
  convertH3IndexToGeoJsonByUserSelect(h3Indexes, h3IndexGroupId) {
    return this.convertH3IndexToGeoJson(
      h3Indexes,
      Z_INDEX_HEXGON_USER_SELECT,
      { h3IndexGroupId },
    );
  },

  /**
   * Naver map의 폴리곤 경계의 스타일 값을 줍니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Data.html#toc25__anchor
   *
   * Vuetify의 deep-purple 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: deep-purple lighten-1 #7E57C2
   * stokeColor: deep-purple darken-1 #5E35B1
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleReadUnselectedBlur: () => ({
    fillColor: '#7E57C2',
    fillOpacity: 0.6,
    strokeWeight: 2,
    strokeColor: '#5E35B1',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),

  /**
   * Naver map의 폴리곤 경계의 Focus 시의 스타일 값을 줍니다.
   *
   * Vuetify의 purple 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: purple #9C27B0
   * stokeColor: purple darken-4 #4A148C
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleReadUnselectedFocus: () => ({
    fillColor: '#9C27B0',
    fillOpacity: 0.4,
    strokeWeight: 2,
    strokeColor: '#4A148C',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),

  /**
   * Naver map의 폴리곤 경계를 사용자가 선택했을 때의 Blur의 스타일 값을 줍니다.
   * Vuetify의 Orange 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: orange #FF9800
   * stokeColor: orange darken-4 #E65100
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleReadSelectedBlur: () => ({
    fillColor: '#FF9800',
    fillOpacity: 0.4,
    strokeWeight: 2,
    strokeColor: '#E65100',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),

  /**
   * Naver map의 폴리곤 경계를 사용자가 선택했을 때의 Focus의 스타일 값을 줍니다.
   * Vuetify의 yellow 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: yellow #FFEB3B
   * stokeColor: yellow darken-4 #F57F17
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleReadSelectedFocus: () => ({
    fillColor: '#FFEB3B',
    fillOpacity: 0.4,
    strokeWeight: 2,
    strokeColor: '#F57F17',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),

  /**
   * Naver map의 폴리곤 경계가 비활성화 되었을 때의 Blur의 스타일 값을 줍니다.
   * Vuetify의 lime 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: grey darken-1 #757575
   * stokeColor: grey darken-2 #616161
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleDisabledBlur: () => ({
    fillColor: '#757575',
    fillOpacity: 0.9,
    strokeWeight: 2,
    strokeColor: '#616161',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),

  /**
   * Naver map의 폴리곤 경계가 비활성화 되었을 때의 Focus의 스타일 값을 줍니다.
   * Vuetify의 lime 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: grey darken-1 #757575
   * stokeColor: grey darken-2 #616161
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleDisabledFocus: () => ({
    fillColor: '#757575',
    fillOpacity: 0.9,
    strokeWeight: 2,
    strokeColor: '#616161',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),

  /**
   * Naver map의 폴리곤 경계가 편집중일 때의 Blur의 스타일 값을 줍니다.
   * Vuetify의 light-green 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: light-green accent-4 #64DD17
   * stokeColor: light-green darken-4 #33691E
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleEditBlur: () => ({
    fillColor: '#64DD17',
    fillOpacity: 0.5,
    strokeWeight: 2,
    strokeColor: '#33691E',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),

  /**
   * Naver map의 폴리곤 경계가 편집중일 때의 Focus의 스타일 값을 줍니다.
   * Vuetify의 light-green 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: light-green accent-4 #64DD17
   * stokeColor: light-green darken-4 #33691E
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleEditFocus: () => ({
    fillColor: '#64DD17',
    fillOpacity: 0.5,
    strokeWeight: 2,
    strokeColor: '#33691E',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),

  /**
   * Hexagon의 Focus 상태의 스타일(Naver map의 폴리곤) 값을 줍니다.
   *
   * Vuetify의 orange 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: orange lighten-3 #FFCC80
   * stokeColor: orange #FF9800
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleHexagonFocus: () => ({
    fillColor: '#FFCC80',
    fillOpacity: 0.4,
    strokeWeight: 2,
    strokeColor: '#FF9800',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),

  /**
   * Hexagon의 Blur 상태의 스타일(Naver map의 폴리곤) 값을 줍니다.
   * https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Data.html#toc25__anchor
   *
   * Vuetify의 green 사용
   * https://vuetifyjs.com/en/styles/colors/#material-colors
   * fillColor: green lighten-5 #E8F5E9
   * stokeColor: green lighten-3 #A5D6A7
   *
   * @return {object} Naver 맵의 폴리곤 경계의 스타일
   */
  getStyleHexagonBlur: () => ({
    fillColor: '#E8F5E9',
    fillOpacity: 0.4,
    strokeWeight: 2,
    strokeColor: '#A5D6A7',
    zIndex: Z_INDEX_POLYGON_BORDER,
  }),
};
