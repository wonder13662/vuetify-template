<template>
  <div>
    <BaseExpandableRow
      title="GeoToH3"
      :show="show"
      :meta="meta"
      @click="onClick"
    >
      <div>
        <!-- 1. 위도(latitude) -->
        <ControlPanelRow
          label="위도(latitude)"
          :value="lat"
        />
        <!-- 2. 경도(longitude) -->
        <ControlPanelRow
          label="경도(longitude)"
          :value="lng"
        />
        <!-- 3. H3 Index -->
        <ControlPanelRow
          label="H3 Index"
          :value="h3Index"
        />
        <!-- 4. H3 Resolution -->
        <BaseContentHorizontalLayout
          col-width-left="100px"
        >
          <template v-slot:left>
            <div class="pl-1 py-3">
              <BaseText
                bold
                text="Resolution"
              />
            </div>
          </template>
          <template v-slot:right>
            <div class="pa-1">
              <BaseSelect
                :select="resolution"
                :items="resolutions"
                outlined
                @select-item="onChange"
              />
            </div>
          </template>
        </BaseContentHorizontalLayout>
      </div>
    </BaseExpandableRow>
  </div>
</template>

<script>
import {
  geoToH3, // https://h3geo.org/docs/api/indexing#geotoh3
} from 'h3-js';
import BaseExpandableRow from '@/components/base/v2/BaseExpandableRow';
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
import BaseText from '@/components/base/v1/BaseText';
import BaseSelect from '@/components/base/v1/BaseSelect';
import ControlPanelRow from './ControlPanelRow';
import utils from '@/lib/naverMapV2/lib/utils';

// TODO h3Index 클립보드 복사 기능
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
// TODO 1개의 Polygon Overlay 객체를 할당받는다.
// TODO 새로운 유효한 좌표를 받을 때마다 이 overlay 객체를 visible을 켜고 지도에 표시
// TODO 유효하지 않은 좌표를 받거나, show가 false이면 이 overlay 객체의 visible을 끈다.
// # 네이버 지도에서 polygon 객체의 path를 새로 설정하는 방법
// https://navermaps.github.io/maps.js/docs/naver.maps.Polygon.html#setPaths__anchor
export default {
  name: 'GeoToH3',
  components: {
    BaseExpandableRow,
    BaseContentHorizontalLayout,
    BaseText,
    BaseSelect,
    ControlPanelRow,
  },
  props: {
    show: {
      type: Boolean,
    },
    meta: {
      type: Object,
      default: () => ({}),
    },
    naverPolygon: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      lat: -1,
      lng: -1,
      h3Index: '',
      resolution: {
        text: '9',
        value: 9,
      },
      resolutions: [
        {
          text: '4(지름 45.2km)',
          value: 4,
        },
        {
          text: '5(지름 17km)',
          value: 5,
        },
        {
          text: '6(지름 6.4km)',
          value: 6,
        },
        {
          text: '7(지름 2.4km)',
          value: 7,
        },
        {
          text: '8(지름 0.9km)',
          value: 8,
        },
        {
          text: '9(지름 340m)',
          value: 9,
        },
        {
          text: '10(지름 131m)',
          value: 10,
        },
        {
          text: '11(지름 49m)',
          value: 11,
        },
        {
          text: '12(지름 18m)',
          value: 12,
        },
      ],
    };
  },
  watch: {
    show(v) {
      this.naverPolygon.setVisible(v);
    },
    meta(v) {
      if (v
          && v.point
          && utils.isLatitude(v.point.lat)
          && utils.isLongitude(v.point.lng)) {
        this.lat = v.point.lat;
        this.lng = v.point.lng;
        // TODO 지도위에 클릭한 좌표로 h3Index를 구한다.
        this.h3Index = geoToH3(this.lat, this.lng, this.resolution.value);
        this.naverPolygon.setH3Index(this.h3Index);
        // 질문: 대한민국 국내지도로 사용시, 표현할 수 있는 가장 큰 크기의 Resolution은 얼마인가?
        // 질문: 대한민국 국내지도로 사용시, 표현할 수 있는 가장 작은 크기의 Resolution은 얼마인가?
        // TODO 컨트롤 패널에 해당 H3Idnex의 naverPolygon의 지름, 반지름 정보를 km, m로 표현해주자
      }
    },
  },
  methods: {
    onClick({ meta, show }) {
      this.$emit('change', {
        meta,
        show,
      });
    },
    onChange(v) {
      this.resolution = v;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
