<template>
  <GeoToH3
    title="KRing"
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
  kRing, // https://h3geo.org/docs/api/traversal#kring
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
      kRingNaverPolygon: null,
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
      this.updatePolygon(this.h3Index, this.kDistance);
      this.emitOverlays();
    },
    onChangeOverlays(overlays) {
      this.overlaysFromGeoToH3 = overlays;
    },
    onChangeKDistance(v) {
      if (!utils.h3IsValid(this.h3Index)) {
        return;
      }
      this.kDistance = v;
      this.updatePolygon(this.h3Index, this.kDistance);
      this.emitOverlays();
    },
    updatePolygon(h3Index, kDistance) {
      // 2. k-ring polygon 만들기
      // 2-1. k-ring에 해당하는 h3Index의 배열을 구한다.
      const kRingH3Indexes = kRing(h3Index, kDistance);
      if (!this.kRingNaverPolygon) {
        // 2-2. k-ring polygon이 없다면 새로 만든다.
        this.kRingNaverPolygon = hexagonGroupHandler.createHexagonGroup({
          hexagonGroupName: 'k-ring',
          h3Indexes: kRingH3Indexes,
        });
      } else {
        // 2-3. k-ring polygon이 있다면 k-ring의 h3Index 배열만 업데이트해준다.
        this.kRingNaverPolygon.setH3Indexes(kRingH3Indexes);
      }
    },
    emitOverlays() {
      this.$emit('change-overlays', [
        this.kRingNaverPolygon,
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
