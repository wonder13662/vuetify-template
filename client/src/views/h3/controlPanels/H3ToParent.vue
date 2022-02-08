<template>
  <GeoToH3
    title="H3ToParent"
    :show="show"
    :meta="meta"
    @change="onChange"
    @change-h3-index="onChangeH3Index"
  >
    <!-- 1. 부모 hexagon의 H3 Resolution 슬라이더 -->
    <BaseContentHorizontalLayout
      col-width-left="100px"
    >
      <template v-slot:left>
        <div class="pl-1 py-3">
          <BaseText
            bold
            text="Parent H3 Res"
          />
        </div>
      </template>
      <template v-slot:right>
        <div class="pa-1">
          <v-slider
            v-model="h3IndexResolutionParent"
            dense
            :label="`${h3IndexResolutionParent}`"
            :min="h3IndexResolutionMin"
            :max="h3IndexResolution - 1"
            @change="onChangeParentResolution"
          />
        </div>
      </template>
    </BaseContentHorizontalLayout>
    <!-- 2. 부모 hexagon의 h3Index -->
    <ControlPanelRow
      label="부모 H3Index"
      :value="h3IndexParent"
    />
  </GeoToH3>
</template>

<script>
import {
  h3ToParent, // https://h3geo.org/docs/api/hierarchy#h3toparent
  h3GetResolution, // https://h3geo.org/docs/api/traversal/#h3line
} from 'h3-js';
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseText from '@/components/base/BaseText';
import GeoToH3 from './GeoToH3';
import ControlPanelRow from './ControlPanelRow';
import mapUtils from '@/lib/naverMapV2/lib/utils';
import hexagonHandler from '@/lib/naverMapV2/hexagonGroupHandler/hexagonHandler';

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
      h3Index: '',
      h3IndexParent: '',
      h3IndexResolutionMin: 4,
      h3IndexResolutionMax: 12,
      h3IndexResolution: 9,
      h3IndexResolutionParent: 8,
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
    onChangeParentResolution(v) {
      this.h3IndexResolutionParent = v;
      this.updateOverlays();
    },
    updateOverlays() {
      // 1. Child의 hexagon를 업데이트한다.
      const overlayChild = hexagonHandler.createHexagon({
        h3Index: this.h3Index,
      });

      // 2. Parent의 H3Index를 구한다.
      this.h3IndexParent = h3ToParent(this.h3Index, this.h3IndexResolutionParent);

      // 3. Parent의 hexagon을 업데이트한다
      const overlayParent = hexagonHandler.createHexagon({
        h3Index: this.h3IndexParent,
      });

      // 4. 업데이트한 hexagon을 부모에게 emit 한다
      this.destroyOverlays();
      this.overlays = [overlayParent, overlayChild];
      this.$emit('change-overlays', this.overlays);
    },
    onChangeH3Index({ h3Index }) {
      if (!mapUtils.h3IsValid(h3Index)) {
        return;
      }

      // 0. resolution 검사
      const resolution = h3GetResolution(h3Index);
      if (this.h3IndexResolution !== resolution) {
        // 0-1. resolution이 바뀌면 모든 데이터를 초기화해야 한다.
        this.reset();
        // 0-2. 자식의 Resolution 업데이트
        this.h3IndexResolution = resolution;
        // 0-2. 부모의 Resolution은 반드시 자식의 Resolution보다 작아야 한다
        this.h3IndexResolutionParent = this.h3IndexResolution - 1;
      }

      // 1. Child의 h3Index를 업데이트한다.
      this.h3Index = h3Index;
      // 2. 오버레이 객체를 업데이트한다.
      this.updateOverlays();
    },
    reset() {
      this.destroyOverlays();
      this.h3Index = '';
      this.h3IndexParent = '';
      this.h3IndexResolutionMin = 4;
      this.h3IndexResolutionMax = 12;
      this.h3IndexResolution = 9;
      this.h3IndexResolutionParent = 8;
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
