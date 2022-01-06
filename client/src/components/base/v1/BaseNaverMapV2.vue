<template>
  <div
    :id="mapId"
    :style="{ height: height, width: width }"
  />
</template>

<script>
import naverMapV2 from '@/lib/naverMapV2';

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
    // 마커 배열
    markerGroups: {
      type: Array,
      default: () => ([]),
    },
    // 거리 polyline 배열
    distanceLineGroups: {
      type: Array,
      default: () => ([]),
    },
    hexagonGroups: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      naverMap: null,
    };
  },
  watch: {
    markerGroups(val) {
      if (!this.naverMap) {
        return;
      }
      this.naverMap.removeMarkerGroups();
      if (val && val.length > 0) {
        this.naverMap.addMarkerGroups(val);
      }
    },
    distanceLineGroups(val) {
      if (!this.naverMap) {
        return;
      }
      this.naverMap.removeDistanceLineGroups();
      if (val && val.length > 0) {
        this.naverMap.addDistanceLineGroups(val);
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
    hexagonGroups(val) {
      if (!this.naverMap) {
        return;
      }
      this.naverMap.removeHexagonGroups();
      if (val && val.length > 0) {
        this.naverMap.addHexagonGroups(val);
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
      this.naverMap = naverMapV2.createNaverMap({
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
        },
        onCompleted: () => {
          this.onLoaded();
          this.naverMap.addCallbackOnBoundChanged(this.onBoundChanged);
          this.naverMap.addCallbackOnZoomChanged(this.onZoomChanged);
          this.naverMap.addCallbackOnClick((v) => {
            // eslint-disable-next-line no-console
            console.log('click / v:', v);
          });

          if (this.bound) {
            this.naverMap.fitBounds(this.bound);
          }
          if (this.markerGroups && this.markerGroups.length > 0) {
            this.naverMap.addMarkerGroups(this.markerGroups);
          }
          if (this.distanceLineGroups && this.distanceLineGroups.length > 0) {
            this.naverMap.addDistanceLineGroups(this.distanceLineGroups);
          }
          if (this.hexagonGroups && this.hexagonGroups.length > 0) {
            this.naverMap.addHexagonGroups(this.hexagonGroups);
          }
        },
        onError: (error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        },
      });
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
