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
// TODO 경계 h3Index를 받는다면, 외부와 내부의 h3Index를 어떻게 구분할 것인지?
// TODO point가 선택된 h3Index들 안에 있는지 판단할 수 있는 가장 빠른 방법은?
// 1. point로 기준 resolution의 h3Index를 구한 다음에 h3Index 배열에 있는지 1:1 비교(느림)
// 2. h3Index들을 부모 h3Index와의 연결관계를 만들어서 가장 큰 부모 h3Index부터 차례대로 비교(빠름).
// 2-1. 최소 resolution부터 최대 resolution의 단계 횟수만큼 비교하면 됨. 다만 이 연결관계를 만드는 데 시간이 걸림.
// 3. 경계에 있는 h3Index들의 모음들로 해당 point가 외부인지 내부인지 판단하는 더 나은 방법이 있지 않을까?

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
      naverPolygon: null,
      overlaysFromGeoToH3: [],
    };
  },
  watch: {
    show(v) {
      if (!v) {
        this.h3Index = null;
        if (this.naverPolygon) {
          this.naverPolygon.destroy();
          this.naverPolygon = null;
        }
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
    onChangeHexRing(v) {
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
      const hexRingH3Indexes = hexRing(h3Index, kDistance);
      if (!this.naverPolygon) {
        // 2-2. k-ring polygon이 없다면 새로 만든다.
        this.naverPolygon = hexagonGroupHandler.createHexagonGroup({
          hexagonGroupName: 'k-ring',
          h3Indexes: hexRingH3Indexes,
        });
      } else {
        // 2-3. k-ring polygon이 있다면 k-ring의 h3Index 배열만 업데이트해준다.
        this.naverPolygon.setH3Indexes(hexRingH3Indexes);
      }
    },
    emitOverlays() {
      this.$emit('change-overlays', [
        this.naverPolygon,
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
