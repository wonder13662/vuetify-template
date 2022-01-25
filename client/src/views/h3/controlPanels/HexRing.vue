<template>
  <GeoToH3
    title="HexRing"
    :show="show"
    :meta="meta"
    @change="onChange"
    @change-h3-index="onChangeH3Index"
    @change-overlays="onChangeOverlays"
  >
    <!-- 1. Hex-Ring -->
    <BaseContentHorizontalLayout
      col-width-left="100px"
    >
      <template v-slot:left>
        <div class="pl-1 py-3">
          <BaseText
            bold
            text="Hex-Ring"
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
            @change="onChangeHexRing"
          />
        </div>
      </template>
    </BaseContentHorizontalLayout>
  </GeoToH3>
</template>

<script>
import {
  hexRing, // https://h3geo.org/docs/api/traversal/#hexring
} from 'h3-js';
import GeoToH3 from './GeoToH3';
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
import BaseText from '@/components/base/v1/BaseText';
import hexagonGroupHandler from '@/lib/naverMapV2/hexagonGroupHandler';
import utils from '@/lib/naverMapV2/lib/utils';

// TODO 빵꾸(hollow) 표현을 해야 함!

export default {
  name: 'HexRing',
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
      hexRingNaverPolygon: null,
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
      this.updateHexRingPolygon();
    },
    onChangeOverlays(overlays) {
      this.overlaysFromGeoToH3 = overlays;
    },
    onChangeHexRing(v) {
      if (!utils.h3IsValid(this.h3Index)) {
        return;
      }
      this.kDistance = v;
      this.updateHexRingPolygon();
    },
    setHexRingPolygon(h3Index, kDistance) {
      // 2. k-ring polygon 만들기
      // 2-1. k-ring에 해당하는 h3Index의 배열을 구한다.
      const hexRingH3Indexes = hexRing(h3Index, kDistance);
      // eslint-disable-next-line no-console
      console.log('hexRingH3Indexes:', hexRingH3Indexes);
      if (!this.hexRingNaverPolygon) {
        // 2-2. k-ring polygon이 없다면 새로 만든다.
        this.hexRingNaverPolygon = hexagonGroupHandler.createHexagonGroup({
          hexagonGroupName: 'k-ring',
          h3Indexes: hexRingH3Indexes,
        });
      } else {
        // 2-3. k-ring polygon이 있다면 k-ring의 h3Index 배열만 업데이트해준다.
        this.hexRingNaverPolygon.setH3Indexes(hexRingH3Indexes);
      }
    },
    updateHexRingPolygon() {
      this.setHexRingPolygon(this.h3Index, this.kDistance);
      this.$emit('change-overlays', [
        this.hexRingNaverPolygon,
        ...this.overlaysFromGeoToH3,
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
