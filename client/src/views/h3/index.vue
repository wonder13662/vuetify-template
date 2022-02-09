<template>
  <v-app id="inspire">
    <v-main>
      <BaseContentHorizontalLayout
        col-width-right="300px"
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
              @click="onClickAtNaverMap"
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
                  :meta="GeoToH3.meta"
                  :show="GeoToH3.show"
                  @change="onChange"
                  @change-overlays="onChangeOverlays"
                />
                <v-divider />
                <KRing
                  :meta="KRing.meta"
                  :show="KRing.show"
                  @change="onChange"
                  @change-overlays="onChangeOverlays"
                />
                <v-divider />
                <KRingDistances
                  :meta="KRingDistances.meta"
                  :show="KRingDistances.show"
                  @change="onChange"
                  @change-overlays="onChangeOverlays"
                />
                <v-divider />
                <HexRing
                  :meta="HexRing.meta"
                  :show="HexRing.show"
                  @change="onChange"
                  @change-overlays="onChangeOverlays"
                />
                <v-divider />
                <H3Line
                  :meta="H3Line.meta"
                  :show="H3Line.show"
                  @change="onChange"
                  @change-overlays="onChangeOverlays"
                />
                <v-divider />
                <H3ToParent
                  :meta="H3ToParent.meta"
                  :show="H3ToParent.show"
                  @change="onChange"
                  @change-overlays="onChangeOverlays"
                />
                <v-divider />
                <H3ToChildren
                  :meta="H3ToChildren.meta"
                  :show="H3ToChildren.show"
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
import BaseNaverMap from '@/components/base/BaseNaverMapV2';
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseContentVerticalLayout from '@/components/base/BaseContentVerticalLayout';
import BaseHeading from '@/components/base/BaseHeading';
import GeoToH3 from './controlPanels/GeoToH3';
import KRing from './controlPanels/KRing';
import KRingDistances from './controlPanels/KRingDistances';
import HexRing from './controlPanels/HexRing';
import H3Line from './controlPanels/H3Line';
import H3ToParent from './controlPanels/H3ToParent';
import H3ToChildren from './controlPanels/H3ToChildren';
/*
H3 Api의 기능을 네이버 맵 위에 표시합니다.
- https://h3geo.org/
*/
const CONTROL_PANEL_KEYS = [
  'GeoToH3',
  'KRing',
  'KRingDistances',
  'HexRing',
  'H3Line',
  'H3ToParent',
  'H3ToChildren',
];
const createControlPanelMap = () => CONTROL_PANEL_KEYS.reduce((acc, key) => {
  acc[key] = {
    meta: {
      key,
      point: {
        lat: null,
        lng: null,
      },
    },
    show: false,
  };
  return acc;
}, {});

export default {
  name: 'H3',
  components: {
    BaseNaverMap,
    BaseContentHorizontalLayout,
    BaseContentVerticalLayout,
    BaseHeading,
    GeoToH3,
    KRing,
    KRingDistances,
    HexRing,
    H3Line,
    H3ToParent,
    H3ToChildren,
  },
  data() {
    return {
      keys: CONTROL_PANEL_KEYS,
      ...createControlPanelMap(),
      overlays: [],
    };
  },
  methods: {
    onChangeOverlays(overlays) {
      this.overlays = overlays;
    },
    // TODO 여기서 자식 컴포넌트가 클릭한 좌표 정보를 알아야할 이유가 있을까? 없어도 될 것 같은데?
    onChange({ meta, show }) {
      this.keys.forEach((key) => {
        if (key === meta.key) {
          this[key] = {
            ...this[key],
            show,
          };
        } else {
          this[key] = {
            ...this[key],
            show: false,
          };
        }
      });
    },
    // eslint-disable-next-line no-unused-vars
    onClickAtNaverMap({ lat, lng }) {
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
