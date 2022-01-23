<template>
  <div>
    <BaseExpandableRow
      title="GeoToH3"
      :show="show"
      :meta="meta"
      @click="onClick"
    >
      <div>
        GeoToH3 - 여기에 조작기능 추가
      </div>
    </BaseExpandableRow>
  </div>
</template>

<script>
import {
  geoToH3, // https://h3geo.org/docs/api/indexing#geotoh3
} from 'h3-js';
import BaseExpandableRow from '@/components/base/v2/BaseExpandableRow';
import utils from '@/lib/naverMapV2/lib/utils';
// import hexagonCalculator from '@/lib/naverMapV2/lib/hexagonCalculator';

// TODO 1개의 Polygon Overlay 객체를 할당받는다.
// TODO 새로운 유효한 좌표를 받을 때마다 이 overlay 객체를 visible을 켜고 지도에 표시
// TODO 유효하지 않은 좌표를 받거나, show가 false이면 이 overlay 객체의 visible을 끈다.
// # 네이버 지도에서 polygon 객체의 path를 새로 설정하는 방법
// https://navermaps.github.io/maps.js/docs/naver.maps.Polygon.html#setPaths__anchor
export default {
  name: 'GeoToH3',
  components: {
    BaseExpandableRow,
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
  watch: {
    show(v) {
      this.naverPolygon.setVisible(v);
    },
    meta(v) {
      if (v
          && v.point
          && utils.isLatitude(v.point.lat)
          && utils.isLongitude(v.point.lng)) {
        // TODO 지도위에 클릭한 좌표로 h3Index를 구한다.
        const h3Index = geoToH3(v.point.lat, v.point.lng, 9);
        this.naverPolygon.setH3Index(h3Index);
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
    // TODO onChange 추가 필요합니다.(H3 관련 정보 업데이트)
  },
};
</script>

<style lang="scss" scoped>

</style>
