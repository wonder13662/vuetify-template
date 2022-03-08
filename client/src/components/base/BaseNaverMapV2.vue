<template>
  <div
    :id="mapId"
    :style="{ height: height, width: width }"
  />
</template>

<script>
import {
  constants,
  naverMap,
} from '@/lib/naverMapV2';

export default {
  name: 'BaseNaverMapV2',
  props: {
    mapId: {
      type: String,
      required: true,
      validator(v) {
        // TODO kebab-case이어야 함. ex) id="naver-map-main"
        return !!v;
      },
    },
    height: {
      type: String,
      default: '100vh',
    },
    width: {
      type: String,
      default: '100%',
    },
    onLoaded: {
      type: Function,
      default: () => {},
    },
    onBoundChanged: {
      type: Function,
      default: () => {},
    },
    onZoomChanged: {
      type: Function,
      default: () => {},
    },
    // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.html#toc15__anchor
    // 지도의 초기 좌표 경계입니다.
    // 이 값을 설정하면 지도 옵션 중 center와 zoom 옵션을 무시하고,
    // 지정한 좌표 경계에 맞게 지도를 생성합니다.
    bound: {
      type: Object,
      default: null,
    },
    // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.html#toc15__anchor
    // https://navermaps.github.io/maps.js.ncp/docs/tutorial-8-map-maxbounds.example.html
    // https://navermaps.github.io/maps.js.ncp/docs/global.html#toc33__anchor
    // LatLngBoundsObjectLiteral로 변환합니다.
    // 지도에서 보이는 최대 좌표 경계
    maxBounds: {
      type: Object,
      default: () => (constants.NAVER_LAT_LNG_BOUNDS_OBJECT_LITERAL),
    },
    // 마우스 또는 손가락을 이용한 지도 이동(패닝) 허용 여부입니다.
    draggable: {
      type: Boolean,
      default: false,
    },
    // 키보드 방향 키를 이용한 지도 이동(패닝) 허용 여부입니다.
    keyboardShortcuts: {
      type: Boolean,
      default: false,
    },
    // NAVER 로고 컨트롤의 표시 여부입니다. (항상 노출로 변경)
    logoControl: {
      type: Boolean,
      default: false,
    },
    // 지도 데이터 저작권 컨트롤의 표시 여부입니다.
    mapDataControl: {
      type: Boolean,
      default: false,
    },
    // 지도 유형 컨트롤의 표시 여부입니다.
    mapTypeControl: {
      type: Boolean,
      default: false,
    },
    // 핀치 제스처를 이용한 지도 확대/축소 허용 여부입니다.
    pinchZoom: {
      type: Boolean,
      default: false,
    },
    // 지도 축척 컨트롤의 표시 여부입니다.
    scaleControl: {
      type: Boolean,
      default: false,
    },
    // 마우스 스크롤 휠을 이용한 지도 확대/축소 허용 여부입니다.
    scrollWheel: {
      type: Boolean,
      default: false,
    },
    // 줌 컨트롤의 표시 여부입니다.
    zoomControl: {
      type: Boolean,
      default: false,
    },
    // 지도의 최대 줌 레벨
    maxZoom: {
      type: Number,
      default: 18,
    },
    // 지도의 최소 줌 레벨
    minZoom: {
      type: Number,
      default: 14, // 읍,면,동
    },
    // 지도 위에 그려지는 오버레이 객체의 배열
    // 마커, 거리폴리라인, hexagonGroups도 모두 오버레이 객체입니다.
    // 앞으로 overlays로 받아서 지도에 그리도록 합니다.
    overlays: {
      type: Array,
      default: () => ([]),
      validator: (v) => {
        const foundWrong = v.find(({ draw, setNaverMap, remove }) => {
          // 1. draw, setNaverMap 중에서 하나는 반드시 구현해야 합니다.
          if (!draw && !setNaverMap) {
            return true;
          }
          // 2. remove는 반드시 구현해야 합니다.
          if (!remove) {
            return true;
          }
          return false;
        });
        return !foundWrong;
      },
    },
  },
  data() {
    return {
      naverMap: null,
    };
  },
  watch: {
    overlays(v) {
      if (!this.naverMap) {
        return;
      }
      this.naverMap.removeOverlays();
      if (v && v.length > 0) {
        this.naverMap.addOverlays(v);
      }
    },
    bound(val) {
      if (!this.naverMap) {
        return;
      }
      if (val) {
        this.naverMap.fitBounds(val);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initMaps();
    });
  },
  beforeDestroy() {
    if (this.naverMap) {
      this.naverMap.destroy();
    }
  },
  methods: {
    initMaps() {
      const { mapId } = this;
      this.naverMap = naverMap.createNaverMap({
        mapId,
        clientId: process.env.VUE_APP_NAVER_MAP_API_KEY || '',
        mapOptions: {
          draggable: this.draggable,
          keyboardShortcuts: this.keyboardShortcuts,
          logoControl: this.logoControl,
          mapDataControl: this.mapDataControl,
          mapTypeControl: this.mapTypeControl,
          pinchZoom: this.pinchZoom,
          scaleControl: this.scaleControl,
          scrollWheel: this.scrollWheel,
          zoomControl: this.zoomControl,
          maxBounds: this.maxBounds,
          maxZoom: this.maxZoom,
          minZoom: this.minZoom,
        },
        onCompleted: () => {
          this.onLoaded();
          this.naverMap.addCallbackOnBoundChanged(this.onBoundChanged);
          this.naverMap.addCallbackOnZoomChanged(this.onZoomChanged);
          this.naverMap.addCallbackOnClick((v) => {
            this.$emit('click', v);
          });
          if (this.bound) {
            this.naverMap.fitBounds(this.bound);
          }
          if (this.overlays && this.overlays.length > 0) {
            this.naverMap.addOverlays(this.overlays);
          }
        },
        onError: (error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        },
      });
      this.naverMap.init();
    },
    setCallbackOnBoundChanged(callback) {
      this.naverMap.setCallbackOnBoundChanged(callback);
    },
    setCallbackOnZoomChanged(callback) {
      this.naverMap.setCallbackOnZoomChanged(callback);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
