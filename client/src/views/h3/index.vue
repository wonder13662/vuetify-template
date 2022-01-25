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
                  @change="onChange"
                  @change-overlays="onChangeOverlays"
                />
                <v-divider />
                <KRing
                  :meta="kRing.meta"
                  :show="kRing.show"
                  @change="onChange"
                  @change-overlays="onChangeOverlays"
                />
                <v-divider />
                <HexRing
                  :meta="hexRing.meta"
                  :show="hexRing.show"
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
import HexRing from './controlPanels/HexRing';
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
    HexRing,
  },
  data() {
    return {
      keys: ['geoToH3', 'kRing', 'hexRing'],
      geoToH3: {
        meta: {
          key: 'geoToH3',
          point: {
            lat: null,
            lng: null,
          },
        },
        show: false,
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
      hexRing: {
        meta: {
          key: 'hexRing',
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
              point: !show ? { lat: null, lng: null } : meta.point,
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
    },
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
