<template>
  <v-app id="inspire">
    <v-main>
      <BaseContentHorizontalLayout
        col-width-right="600px"
        divider
      >
        <template v-slot:left>
          <!-- 1. Naver Map -->
          <div>
            <BaseNaverMap
              :map-id="'map-sample'"
              :overlays="overlays"
              draggable
              zoom-control
              scroll-wheel
              @click="onClick"
            />
          </div>
        </template>
        <template v-slot:right>
          <BaseContentVerticalLayout
            body-height="calc(100vh - 96px)"
          >
            <template v-slot:head>
              <!-- 2. 타이틀: "H3 컨트롤" -->
              <div class="pa-1">
                <BaseHeading
                  large
                  text="H3 컨트롤"
                />
              </div>
              <v-divider />
            </template>
            <template v-slot:body>
              <div>
                <!-- 3. 리스트: H3 Api 목록 -->
                <GeoToH3
                  :meta="geoToH3.meta"
                  :show="geoToH3.show"
                  :naver-polygon="geoToH3.overlay"
                  @change="onChange"
                />
                <v-divider />
                <KRing
                  :meta="kRing.meta"
                  :show="kRing.show"
                  :naver-polygon="kRing.overlay"
                  @change="onChange"
                  @change-overlays="onChangeOverlays"
                />
              </div>
            </template>
          </BaseContentVerticalLayout>
        </template>
      </BaseContentHorizontalLayout>
    </v-main>
  </v-app>
</template>

<script>
import BaseNaverMap from '@/components/base/v1/BaseNaverMapV2';
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
import BaseContentVerticalLayout from '@/components/base/v2/BaseContentVerticalLayout';
import BaseHeading from '@/components/base/v1/BaseHeading';
import GeoToH3 from './controlPanels/GeoToH3';
import KRing from './controlPanels/KRing';
import hexagonHandler from '@/lib/naverMapV2/hexagonGroupHandler/hexagonHandler';
/*
H3 Api의 기능을 네이버 맵 위에 표시합니다.
- https://h3geo.org/
*/
export default {
  name: 'Map',
  components: {
    BaseNaverMap,
    BaseContentHorizontalLayout,
    BaseContentVerticalLayout,
    BaseHeading,
    GeoToH3,
    KRing,
  },
  data() {
    return {
      keys: ['geoToH3', 'kRing'],
      geoToH3: {
        meta: {
          key: 'geoToH3',
          point: {
            lat: -1,
            lng: -1,
          },
        },
        show: false,
        overlay: hexagonHandler.createHexagon({
          h3Index: '8930e1d8c0fffff', // 종로구 어딘가...
          visible: false,
        }),
      },
      kRing: {
        meta: {
          key: 'kRing',
          point: {
            lat: null,
            lng: null,
          },
        },
        show: false,
      },
      overlays: [],
    };
  },
  methods: {
    onChangeOverlays(overlays) {
      this.overlays = overlays;
    },
    onChange({ meta, show }) {
      // const { key } = meta;
      this.keys.forEach((key) => {
        if (key === meta.key) {
          this[key] = {
            ...this[key],
            meta: {
              ...meta,
              point: !show ? { lat: -1, lng: -1 } : meta.point,
            },
            show,
          };
        } else {
          this[key] = {
            ...this[key],
            show: false,
          };
        }
      });
      // TODO 다른 모든 패널을 닫는다. show = false;
    },
    // 아래 흐름으로 overlay를 생성 및 전달하면, parent는 overlay 배열을 전달만 할 뿐, 제어할 필요는 없어진다.
    // TODO 네이버 맵에서 클릭한 좌표는 각 controlPanelRow에 전달
    // TODO controlPanel은 전달받은 좌표를 자신의 상태에 따라 그냥 버릴수도, 이를 이용해 overlay 객체를 만들수도 있다.
    // TODO controlPanel은 overlay 객체들를 만들어 parent에게 전달
    // TODO parent는 전달받은 overlay 객체들을 네이버 지도 컴포넌트에 전달
    onClick({ lat, lng }) {
      const foundOpenPanelKey = this.keys.find((key) => (this[key] && this[key].show));
      if (foundOpenPanelKey) {
        this[foundOpenPanelKey] = {
          ...this[foundOpenPanelKey],
          meta: {
            ...this[foundOpenPanelKey].meta,
            point: {
              lat,
              lng,
            },
          },
          show: this[foundOpenPanelKey].show,
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
