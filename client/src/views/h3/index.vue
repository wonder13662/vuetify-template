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
  },
  data() {
    return {
      keys: ['geoToH3'],
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
    };
  },
  computed: {
    overlays() {
      return this.keys.map((key) => this[key].overlay);
    },
  },
  methods: {
    onChange({ meta, show }) {
      const { key } = meta;
      if (this[key]) {
        this[key] = {
          ...this[key],
          meta: {
            ...meta,
            point: !show ? { lat: -1, lng: -1 } : meta.point,
          },
          show,
        };
      }
      // TODO 다른 모든 패널을 닫는다. show = false;
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
