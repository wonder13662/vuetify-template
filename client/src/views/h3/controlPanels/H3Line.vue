<template>
  <GeoToH3
    title="H3Line"
    :show="show"
    :meta="meta"
    @change="onChange"
    @change-h3-index="onChangeH3Index"
  >
    <!-- 1. 라디오버튼: 출발,도착 -->
    <BaseContentHorizontalLayout
      col-width-left="100px"
    >
      <template v-slot:left>
        <div class="pa-1">
          <BaseText
            bold
            text="대상"
          />
        </div>
      </template>
      <template v-slot:right>
        <div class="pa-1">
          <BaseRadioGroup
            :items="items"
            :selected-value="selectedValue"
            @change="onChangeRadioGroup"
          />
        </div>
      </template>
    </BaseContentHorizontalLayout>
    <!-- 2. h3Index: 출발 -->
    <ControlPanelRow
      label="출발"
      :value="h3IndexStart"
    />
    <!-- 3. h3Index: 도착 -->
    <ControlPanelRow
      label="도착"
      :value="h3IndexEnd"
    />
    <!-- 4. h3Distance -->
    <ControlPanelRow
      label="h3Distance"
      :value="h3Distance"
    />
    <!-- 5. local I -->
    <ControlPanelRow
      label="local I"
      :value="localIj.i"
    />
    <!-- 6. local J -->
    <ControlPanelRow
      label="local J"
      :value="localIj.j"
    />
  </GeoToH3>
</template>

<script>
import {
  h3Line, // https://h3geo.org/docs/api/traversal/#h3line
  h3GetResolution, // https://h3geo.org/docs/api/traversal/#h3line
  h3Distance, // https://h3geo.org/docs/api/traversal/#h3distance
  experimentalH3ToLocalIj, // https://h3geo.org/docs/api/traversal/#experimentalh3tolocalij
} from 'h3-js';
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseRadioGroup from '@/components/base/BaseRadioGroup';
import BaseText from '@/components/base/BaseText';
import GeoToH3 from './GeoToH3';
import ControlPanelRow from './ControlPanelRow';
import mapUtils from '@/lib/naverMapV2/lib/utils';
import hexagonHandler from '@/lib/naverMapV2/hexagonGroupHandler/hexagonHandler';
import hexagonGroupHandler from '@/lib/naverMapV2/hexagonGroupHandler';

// https://h3geo.org/docs/api/traversal/#h3line

const START_POINT = 'START_POINT';
const END_POINT = 'END_POINT';

export default {
  name: 'H3Line',
  components: {
    BaseContentHorizontalLayout,
    BaseRadioGroup,
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
      items: [
        {
          text: '출발',
          value: START_POINT,
        },
        {
          text: '도착',
          value: END_POINT,
        },
      ],
      selectedValue: START_POINT,
      h3IndexStart: '',
      h3IndexStartOverlay: null,
      h3IndexEnd: '',
      h3IndexEndOverlay: null,
      h3IndexesH3Line: [],
      h3IndexesH3LineOverlay: null,
      h3IndexResolution: -1,
      h3Distance: -1,
      localIj: { i: 0, j: 0 },
    };
  },
  methods: {
    reset() {
      this.h3IndexStart = '';
      this.h3IndexStartOverlay = null;
      this.h3IndexEnd = '';
      this.h3IndexEndOverlay = null;
      this.h3IndexesH3Line = [];
      this.h3IndexesH3LineOverlay = null;
      this.h3Distance = -1;
      this.localIj = { i: 0, j: 0 };
    },
    onChange({ meta, show }) {
      this.$emit('change', {
        meta,
        show,
      });
    },
    onChangeH3Index({ h3Index }) {
      if (!mapUtils.h3IsValid(h3Index)) {
        return;
      }
      // 0. resolution 검사
      const resolution = h3GetResolution(h3Index);
      if (this.h3IndexResolution !== resolution) {
        this.h3IndexResolution = resolution;
        // 0-1. resolution이 바뀌면 모든 데이터를 초기화해야 한다.
        this.reset();
      }

      // 1. h3Index를 업데이트한다.
      if (this.selectedValue === START_POINT) {
        this.h3IndexStart = h3Index;
      } else if (this.selectedValue === END_POINT) {
        this.h3IndexEnd = h3Index;
      }

      // 2. 출발 h3Index, 도착 h3Index가 모두 있다면, h3Line와 h3Distance을 구한다
      if (this.h3IndexStart && this.h3IndexEnd) {
        this.h3IndexesH3Line = h3Line(this.h3IndexStart, this.h3IndexEnd);
        this.h3Distance = h3Distance(this.h3IndexStart, this.h3IndexEnd);
        this.localIj = experimentalH3ToLocalIj(this.h3IndexStart, this.h3IndexEnd);
      }

      // 3. H3Line의 overlay를 구한다.
      if (this.h3IndexesH3Line && this.h3IndexesH3Line.length > 0) {
        this.h3IndexesH3LineOverlay = hexagonGroupHandler.createHexagonGroup({
          h3Indexes: this.h3IndexesH3Line,
          meta: {
            hexagonGroupName: 'H3Line',
          },
        });
      }

      // 4. hexagon을 업데이트한다
      const overlay = hexagonHandler.createHexagon({
        h3Index,
      });
      if (this.selectedValue === START_POINT) {
        this.h3IndexStartOverlay = overlay;
      } else if (this.selectedValue === END_POINT) {
        this.h3IndexEndOverlay = overlay;
      }

      // 5. 업데이트한 hexagon을 부모에게 emit 한다
      const overlays = [];
      if (this.h3IndexesH3LineOverlay) {
        overlays.push(this.h3IndexesH3LineOverlay);
      }
      if (this.h3IndexStartOverlay) {
        overlays.push(this.h3IndexStartOverlay);
      }
      if (this.h3IndexEndOverlay) {
        overlays.push(this.h3IndexEndOverlay);
      }
      this.$emit('change-overlays', overlays);
    },
    onChangeRadioGroup(v) {
      this.selectedValue = v;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
