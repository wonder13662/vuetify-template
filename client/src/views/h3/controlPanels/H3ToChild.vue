<template>
  <GeoToH3
    title="H3ToChild"
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
            text="Child H3 Res"
          />
        </div>
      </template>
      <template v-slot:right>
        <div class="pa-1">
          <v-slider
            v-model="h3IndexResolutionChildren"
            dense
            :label="`${h3IndexResolutionChildren}`"
            :min="h3IndexResolutionParent + 1"
            :max="h3IndexResolutionMax"
            @change="onChangeChildrenResolution"
          />
        </div>
      </template>
    </BaseContentHorizontalLayout>
    <!-- 2. 자식 hexagon들의 h3Index 배열 -->
    <BaseContentHorizontalLayout
      col-width-left="100px"
    >
      <template v-slot:left>
        <div class="pa-1">
          <BaseText
            bold
            text="Children H3Index"
          />
        </div>
      </template>
      <template v-slot:right>
        <div class="pa-1">
          <div
            v-for="(h3Index) in h3IndexesChildren"
            :key="h3Index"
          >
            <BaseText
              :text="h3Index"
            />
          </div>
        </div>
      </template>
    </BaseContentHorizontalLayout>
  </GeoToH3>
</template>

<script>
import {
  h3ToChildren, // https://h3geo.org/docs/api/hierarchy/#h3tochildren
  h3GetResolution, // https://h3geo.org/docs/api/traversal/#h3line
} from 'h3-js';
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseText from '@/components/base/BaseText';
import GeoToH3 from './GeoToH3';
import mapUtils from '@/lib/naverMapV2/lib/utils';
import hexagonHandler from '@/lib/naverMapV2/hexagonGroupHandler/hexagonHandler';

export default {
  name: 'H3ToParent',
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
      h3IndexParent: '',
      h3IndexesChildren: [],
      h3IndexResolutionMin: 4,
      h3IndexResolutionMax: 12,
      h3IndexResolutionParent: 9,
      h3IndexResolutionChildren: 10,
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
    onChangeChildrenResolution(v) {
      this.h3IndexResolutionChildren = v;
      this.updateOverlays();
    },
    updateOverlays() {
      // 1. Parent의 hexagon를 업데이트한다.
      const overlayParent = hexagonHandler.createHexagon({
        h3Index: this.h3IndexParent,
      });

      // 2. Children의 H3Index의 배열을 구한다.
      this.h3IndexesChildren = h3ToChildren(this.h3IndexParent, this.h3IndexResolutionChildren);

      // 3. Parent의 hexagon을 업데이트한다
      const overlayChildren = this.h3IndexesChildren.reduce((acc, v) => {
        acc.push(hexagonHandler.createHexagon({
          h3Index: v,
        }));
        return acc;
      }, []);

      // 4. 업데이트한 hexagon을 부모에게 emit 한다
      this.destroyOverlays();
      this.overlays = [overlayParent, ...overlayChildren];
      this.$emit('change-overlays', this.overlays);
    },
    onChangeH3Index({ h3Index }) {
      if (!mapUtils.h3IsValid(h3Index)) {
        return;
      }

      // 0. resolution 검사
      const resolution = h3GetResolution(h3Index);
      if (this.h3IndexResolutionParent !== resolution) {
        // 0-1. resolution이 바뀌면 모든 데이터를 초기화해야 한다.
        this.reset();
        // 0-2. Parent의 Resolution 업데이트
        this.h3IndexResolutionParent = resolution;
        // 0-2. Children의 Resolution은 반드시 Parent의 Resolution보다 커야 한다
        this.h3IndexResolutionChildren = this.h3IndexResolutionParent + 1;
      }

      // 1. Parent의 h3Index를 업데이트한다.
      this.h3IndexParent = h3Index;
      // 2. 오버레이 객체를 업데이트한다.
      this.updateOverlays();
    },
    reset() {
      this.destroyOverlays();
      this.h3IndexParent = '';
      this.h3IndexesChildren = [];
      this.h3IndexResolutionMin = 4;
      this.h3IndexResolutionMax = 12;
      this.h3IndexResolutionParent = 9;
      this.h3IndexResolutionChildren = 10;
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
