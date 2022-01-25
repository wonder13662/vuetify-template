<template>
  <div>
    <BaseExpandableRow
      title="KRing"
      :show="show"
      :meta="meta"
      @click="onClick"
    >
      <template v-slot:body>
        <div>
          <!-- 1. 위도(latitude) -->
          <ControlPanelRow
            label="위도(latitude)"
            :value="latComputed"
          />
          <!-- 2. 경도(longitude) -->
          <ControlPanelRow
            label="경도(longitude)"
            :value="lngComputed"
          />
          <!-- 3. H3 Index -->
          <ControlPanelRow
            label="H3 Index"
            :value="h3IndexComputed"
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
                  @select-item="onChangeResolution"
                />
              </div>
            </template>
          </BaseContentHorizontalLayout>
          <!-- 5. K-Ring -->
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
                  @change="onChangeKRing"
                />
              </div>
            </template>
          </BaseContentHorizontalLayout>
        </div>
      </template>
    </BaseExpandableRow>
  </div>
</template>

<script>
import {
  geoToH3, // https://h3geo.org/docs/api/indexing#geotoh3
  // h3ToGeoBoundary, // https://h3geo.org/docs/api/indexing#h3togeoboundary
  kRing, // https://h3geo.org/docs/api/traversal#kring
} from 'h3-js';
import BaseExpandableRow from '@/components/base/v2/BaseExpandableRow';
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
import BaseText from '@/components/base/v1/BaseText';
import BaseSelect from '@/components/base/v1/BaseSelect';
import ControlPanelRow from './ControlPanelRow';
import utils from '@/lib/naverMapV2/lib/utils';
import hexagonGroupHandler from '@/lib/naverMapV2/hexagonGroupHandler';
import hexagonHandler from '@/lib/naverMapV2/hexagonGroupHandler/hexagonHandler';

export default {
  name: 'KRing',
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
  },
  data() {
    return {
      lat: null,
      lng: null,
      h3Index: null,
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
      kDistance: 1,
      hexagonNaverPolygon: null,
      kRingNaverPolygon: null,
    };
  },
  computed: {
    latComputed() {
      return !this.lat ? '없음' : this.lat;
    },
    lngComputed() {
      return !this.lng ? '없음' : this.lng;
    },
    h3IndexComputed() {
      return !this.h3Index ? '없음' : this.h3Index;
    },
  },
  watch: {
    meta(v) {
      if (v
          && v.point
          && utils.isLatitude(v.point.lat)
          && utils.isLongitude(v.point.lng)) {
        this.lat = v.point.lat;
        this.lng = v.point.lng;
        this.h3Index = geoToH3(this.lat, this.lng, this.resolution.value);

        this.setHexagonPolygon(this.h3Index);
        this.setKRingNaverPolygon(this.h3Index, this.kDistance);
        this.$emit('change-overlays', [
          this.kRingNaverPolygon,
          this.hexagonNaverPolygon,
        ]);
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
    onChangeResolution(v) {
      this.resolution = v;
    },
    onChangeKRing(v) {
      this.kDistance = v;
      this.setKRingNaverPolygon(this.h3Index, this.kDistance);
      this.$emit('change-overlays', [
        this.kRingNaverPolygon,
        this.hexagonNaverPolygon,
      ]);
    },
    setHexagonPolygon(h3Index) {
      // 1. hexagon polygon 만들기
      if (!this.hexagonNaverPolygon) {
        // 1-1. hexagon polygon이 없다면 새로 만든다
        this.hexagonNaverPolygon = hexagonHandler.createHexagon({
          h3Index,
        });
      } else {
        // 1-2. hexagon polygon이 있다면 h3Index만 업데이트해준다.
        this.hexagonNaverPolygon.setH3Index(h3Index);
      }
    },
    setKRingNaverPolygon(h3Index, kDistance) {
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
  },
};
</script>

<style lang="scss" scoped>

</style>
