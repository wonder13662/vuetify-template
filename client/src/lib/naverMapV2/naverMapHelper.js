import boundHandler from './lib/boundHandler';
import naverMapWrapper from './lib/naverMapWrapper';

/**
 * 네이버 맵 API를 로드할 url을 가져옵니다.
 *
 * @param {object} url - (required)script를 로딩할 실제 url 주소
 * @param {array} subModules - (optional)naver map api에서 사용할 submodule들의 배열
 * @param {boolean} useGovAPI - (optional)공공기관 전용 API 여부
 *
 * @return {string} naver map api를 다운로드하는 url
 */
const getNaverMapUrl = ({
  clientId,
  useGovAPI = false,
  subModules = [],
}) => {
  if (!clientId) {
    throw new Error('clientId가 없습니다.');
  }

  const apiType = useGovAPI ? 'gov' : 'ncp';
  const subModulesQuery = subModules ? `submodules=${subModules.join(',')}` : '';
  const params = `${apiType}ClientId=${clientId}&${subModulesQuery}`;
  return `https://openapi.map.naver.com/openapi/v3/maps.js?${params}`;
};

/**
 * 네이버 맵 API를 로드할 script tag를 DOM에 추가합니다.
 *
 * @param {object} document - 브라우저의 document 객체
 * @param {string} id - script tag에 추가될 id. 이것으로 동일한 script tag가 이미 추가되었는지 확인할 수 있습니다
 * @param {object} url - script를 로딩할 실제 url 주소
 * @param {object} async - 스크립트(이하 defer 스크립트 또는 지연 스크립트)를 '백그라운드’에서 async 방식으로 다운로드하는 여부
 * @param {object} defer - 스크립트(이하 defer 스크립트 또는 지연 스크립트)를 '백그라운드’에서 defer 방식으로 다운로드하는 여부
 * @param {function} onLoad - 스크립트 다운로드 완료시 콜백 함수
 * @param {function} onError - 스크립트 다운로드 실패시 콜백 함수
 *
 * @return {object} 선(Naver Polyline)을 제어하는 기능을 가진 인스턴스 반환
 */
const scriptLoad = ({
  document,
  id,
  url,
  async = true,
  defer = true,
  onLoad = () => {},
  onError = () => {},
}) => {
  if (!document) {
    throw new Error('document 객체가 없습니다.');
  }
  if (!id) {
    throw new Error('id가 없습니다.');
  }
  if (!url) {
    throw new Error('id가 없습니다.');
  }

  const script = document.createElement('script');
  if (script) {
    script.id = id;
    script.setAttribute('src', url);
    script.onload = onLoad;
    script.onerror = onError;
    if (async) {
      script.setAttribute('async', '');
    }
    if (defer) {
      script.setAttribute('defer', '');
    }
    document.body.appendChild(script);
  } else throw new Error('script loading failed');
};

export default {
  /**
   * 네이버 맵 인스턴스를 만듭니다
   *
   * @param {string} mapId - (required)Naver 지도 인스턴스의 id
   * @param {function} onCreated - (optional)Naver 지도 인스턴스가 생성되었을 때, 호출하는 콜백함수
   * @param {object} mapOptions - (optional)Naver 지도 인스턴스의 설정값 객체
   *
   * @return {string} naver map api를 다운로드하는 url
   */
  createNaverMapInstance({
    mapId,
    mapOptions = null, // TODO mapOption은 실제로 맵이 로딩 된 이후에 접근할 수 있는 값들이 있다. 이를 매핑해서 관리해야 함
    onCreated = () => {},
  }) {
    if (!mapId) {
      throw new Error('mapId가 유효하지 않습니다.');
    }

    const map = naverMapWrapper.getMap(mapId, mapOptions);
    naverMapWrapper.once(map, 'init_stylemap', () => (onCreated(map)));
  },
  /**
   * 네이버 맵 API를 로드합니다.
   *
   * @param {string} clientId - (required)naver map api를 사용할 권한을 가진 clientid
   * @param {object} document - (required)브라우저의 document 객체
   * @param {string} id - (required)script tag에 추가될 id. 이것으로 동일한 script tag가 이미 추가되었는지 확인할 수 있습니다
   * @param {function} onLoad - (optional)스크립트 다운로드 완료시 콜백 함수
   * @param {function} onError - (optional)스크립트 다운로드 실패시 콜백 함수
   *
   * @return {string} naver map api를 다운로드하는 url
   */
  loadScriptNaverMapApi({
    clientId,
    id,
    onLoad = () => {},
    onError = () => {},
  }) {
    const hasLoaded = !!document.getElementById(id);
    if (hasLoaded) {
      onLoad();
      return;
    }
    // 2. naverMap이 DOM에 없다. 새로 만든다.
    const naverMapUrl = getNaverMapUrl({ clientId });
    scriptLoad({
      document,
      id,
      url: naverMapUrl,
      onLoad: () => (onLoad()),
      onError,
    });
  },
  setEventListeners({
    map,
    callbacksOnBoundChanged = [],
    callbacksOnZoomChanged = [],
    callbacksOnClick = [],
  }) {
    // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Map.html#event:bounds_changed__anchor
    const eventListenerOnBoundChanged = naverMapWrapper.addListener(
      map,
      'bounds_changed',
      (bounds) => {
        callbacksOnBoundChanged.forEach((f) => f.call(null, bounds));
      },
    );

    // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Map.html#event:zoom_changed__anchor
    const eventListenerOnZoomChanged = naverMapWrapper.addListener(
      map,
      'zoom_changed',
      (v) => {
        callbacksOnZoomChanged.forEach((f) => f.call(null, v));
      },
    );

    const eventListenerOnClick = naverMapWrapper.addListener(
      map,
      'mouseup',
      (pointerEvent) => {
        const {
          coord: {
            _lat,
            _lng,
          },
        } = pointerEvent;
        const point = { lat: _lat, lng: _lng };
        callbacksOnClick.forEach((f) => f.call(null, point));
      },
    );

    return {
      eventListenerOnBoundChanged,
      eventListenerOnZoomChanged,
      eventListenerOnClick,
    };
  },
  removeEventListener(eventListeners = []) {
    if (!eventListeners || eventListeners.length === 0) {
      return;
    }
    naverMapWrapper.removeListener(eventListeners);
  },
  createBounds(sw, ne) {
    return boundHandler.createBounds(sw, ne);
  },
  fitBounds({
    map,
    bound,
  }) {
    if (!map) {
      throw new Error('map 객체가 없습니다.');
    }
    if (!bound) {
      throw new Error('지도 경계 정보 유효하지 않습니다.'); // TODO CUSTOM_ERROR 및 ERROR 매핑 작업 필요
    }

    const {
      sw,
      ne,
    } = bound;
    map.fitBounds(
      naverMapWrapper.getLatLngBounds(
        naverMapWrapper.getLatLng(sw.lat, sw.lng),
        naverMapWrapper.getLatLng(ne.lat, ne.lng),
      ),
    );
  },
};
