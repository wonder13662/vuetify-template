<template>
  <GeoToH3
    title="Compact"
    :show="show"
    :meta="meta"
    @change="onChange"
    @change-h3-index="onChangeH3Index"
  >
    <!-- 1. Compact의 K-distance 슬라이더 -->
    <BaseContentHorizontalLayout
      col-width-left="100px"
    >
      <template v-slot:left>
        <div class="pl-1 py-3">
          <BaseText
            bold
            text="K-distance"
          />
        </div>
      </template>
      <template v-slot:right>
        <div class="pa-1">
          <v-slider
            v-model="kDistance"
            dense
            :label="`${kDistance}`"
            :min="kDistanceMin"
            :max="kDistanceMax"
            @change="onChangeKDistance"
          />
        </div>
      </template>
    </BaseContentHorizontalLayout>
    <!-- 2. K-Ring h3 갯수 -->
    <ControlPanelRow
      label="K-Ring 갯수"
      :value="h3IndexesKRing.length"
    />
    <!-- 3. Compact h3 갯수 -->
    <ControlPanelRow
      label="Compact 갯수"
      :value="h3IndexesCompact.length"
    />
  </GeoToH3>
</template>

<script>
import {
  compact, // https://h3geo.org/docs/api/hierarchy/#compact
  kRing, // https://h3geo.org/docs/api/traversal#kring
  h3GetResolution, // https://h3geo.org/docs/api/traversal/#h3line
} from 'h3-js';
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseText from '@/components/base/BaseText';
import GeoToH3 from './GeoToH3';
import mapUtils from '@/lib/naverMapV2/lib/utils';
import hexagonHandler from '@/lib/naverMapV2/hexagonGroupHandler/hexagonHandler';
import hexagonGroupHandler from '@/lib/naverMapV2/hexagonGroupHandler';
import ControlPanelRow from './ControlPanelRow';

export default {
  name: 'H3ToParent',
  components: {
    BaseContentHorizontalLayout,
    BaseText,
    GeoToH3,
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
  },
  data() {
    return {
      h3IndexCenter: '',
      h3IndexesKRing: [],
      h3IndexesCompact: [],
      kDistanceMin: 1,
      kDistanceMax: 20,
      kDistance: 1,
      resolutionCenter: -1,
      overlays: [],
    };
  },
  watch: {
    show(v) {
      if (!v) {
        this.reset();
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
    onChangeKDistance(v) {
      this.kDistance = v;
      this.updateOverlays();
    },
    updateOverlays() {
      // 1. Center의 hexagon를 업데이트한다.
      const overlayCenter = hexagonHandler.createHexagon({
        h3Index: this.h3IndexCenter,
      });

      // 2. Compact를 구하기위한 K-ring을 구한다.
      this.h3IndexesKRing = kRing(this.h3IndexCenter, this.kDistance);
      const overlayNearBy = hexagonGroupHandler.createHexagonGroup({
        h3Indexes: this.h3IndexesKRing,
      });

      // 3. Compact의 H3Index의 배열을 구한다.
      this.h3IndexesCompact = compact(this.h3IndexesKRing);

      // 4. Compact의 hexagon들을 업데이트한다
      const overlaysCompact = this.h3IndexesCompact.map((h) => (hexagonHandler.createHexagon({
        h3Index: h,
      })));

      // 5. 업데이트한 hexagon을 부모에게 emit 한다
      this.destroyOverlays();
      this.overlays = [
        overlayNearBy,
        ...overlaysCompact,
        overlayCenter,
      ];
      this.$emit('change-overlays', this.overlays);
    },
    onChangeH3Index({ h3Index }) {
      if (!mapUtils.h3IsValid(h3Index)) {
        return;
      }

      // 0. resolution 검사
      const resolution = h3GetResolution(h3Index);
      if (this.resolutionCenter !== resolution) {
        // 0-1. resolution이 바뀌면 모든 데이터를 초기화해야 한다.
        this.reset();
        // 0-2. Center의 Resolution 업데이트
        this.resolutionCenter = resolution;
      }

      // 1. Center의 h3Index를 업데이트한다.
      this.h3IndexCenter = h3Index;
      // 2. 오버레이 객체를 업데이트한다.
      this.updateOverlays();
    },
    reset() {
      this.destroyOverlays();
      this.h3IndexCenter = '';
      this.h3IndexesKRing = [];
      this.h3IndexesCompact = [];
      this.kDistance = 1;
      this.resolutionCenter = -1;
      this.overlays = [];
    },
    destroyOverlays() {
      if (this.overlays && this.overlays.length > 0) {
        this.overlays.forEach((o) => o.destroy());
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
