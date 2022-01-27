<template>
  <GeoToH3
    title="KRingDistances"
    :show="show"
    :meta="meta"
    @change="onChange"
    @change-h3-index="onChangeH3Index"
    @change-overlays="onChangeOverlays"
  >
    <!-- 1. K-Ring -->
    <BaseContentHorizontalLayout
      col-width-left="100px"
    >
      <template v-slot:left>
        <div class="pl-1 py-3">
          <BaseText
            bold
            text="K-Ring"
          />
        </div>
      </template>
      <template v-slot:right>
        <div class="pa-1">
          <v-slider
            v-model="kDistance"
            dense
            :label="`${kDistance}`"
            :min="1"
            :max="5"
            @change="onChangeKDistance"
          />
        </div>
      </template>
    </BaseContentHorizontalLayout>
  </GeoToH3>
</template>

<script>
import {
  kRingDistances, // https://h3geo.org/docs/api/traversal/#kringdistances
} from 'h3-js';
import GeoToH3 from './GeoToH3';
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
import BaseText from '@/components/base/v1/BaseText';
import hexagonGroupHandler from '@/lib/naverMapV2/hexagonGroupHandler';
import utils from '@/lib/naverMapV2/lib/utils';

export default {
  name: 'KRing',
  components: {
    BaseContentHorizontalLayout,
    BaseText,
    GeoToH3,
  },
  props: {
    show: {
      type: Boolean,
    },
    meta: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      h3Index: null,
      kDistance: 1,
      kRingOriginNaverPolygon: null,
      kRingNeighboringIndicesNaverPolygon: null,
      polygons: [],
      overlaysFromGeoToH3: [],
    };
  },
  watch: {
    show(v) {
      if (!v) {
        this.h3Index = null;
        this.$emit('change-overlays', []);
      }
    },
  },
  methods: {
    onChange({ meta, show }) {
      this.$emit('change', {
        meta,
        show,
      });
    },
    onChangeH3Index({ h3Index }) {
      if (!utils.h3IsValid(h3Index)) {
        return;
      }
      this.h3Index = h3Index;
      this.updateKRingPolygon();
    },
    onChangeOverlays(overlays) {
      this.overlaysFromGeoToH3 = overlays;
    },
    onChangeKDistance(v) {
      if (!utils.h3IsValid(this.h3Index)) {
        return;
      }
      this.kDistance = v;
      this.updateKRingPolygon();
    },
    setKRingDistancePolygon(h3Index, kDistance) {
      // 2. k-ring distance polygon 만들기
      // 2-1. k-ring distance 에 해당하는 h3Index의 배열을 구한다.
      const kRingH3Indexes = kRingDistances(h3Index, kDistance);

      // 2-2. 이전에 그린 모든 polygon을 지운다.
      this.polygons.forEach((v) => {
        v.destroy();
      });
      this.polygons = [];

      // 2-3. polygon을 새로 그린다.
      kRingH3Indexes.forEach((v, idx) => {
        this.polygons.push(hexagonGroupHandler.createHexagonGroup({
          hexagonGroupName: `polygon-${idx}`,
          h3Indexes: v,
        }));
      });
    },
    updateKRingPolygon() {
      this.setKRingDistancePolygon(this.h3Index, this.kDistance);
      this.$emit('change-overlays', [
        ...this.polygons,
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
