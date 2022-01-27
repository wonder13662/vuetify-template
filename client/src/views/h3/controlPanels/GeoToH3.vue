<template>
  <div>
    <BaseExpandableRow
      :title="title"
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
          <slot />
        </div>
      </template>
    </BaseExpandableRow>
  </div>
</template>

<script>
import {
  geoToH3, // https://h3geo.org/docs/api/indexing#geotoh3
} from 'h3-js';
import BaseExpandableRow from '@/components/base/v2/BaseExpandableRow';
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
import BaseText from '@/components/base/v1/BaseText';
import BaseSelect from '@/components/base/v1/BaseSelect';
import ControlPanelRow from './ControlPanelRow';
import utils from '@/lib/naverMapV2/lib/utils';
import hexagonHandler from '@/lib/naverMapV2/hexagonGroupHandler/hexagonHandler';

export default {
  name: 'GeoToH3',
  components: {
    BaseExpandableRow,
    BaseContentHorizontalLayout,
    BaseText,
    BaseSelect,
    ControlPanelRow,
  },
  props: {
    title: {
      type: String,
      default: 'GeoToH3',
    },
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
      h3Index: '',
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
      hexagonNaverPolygon: null,
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

        this.updateH3Index();
        this.updatePolygon();

        this.emitOverlays();
        this.emitH3Index();
      }
    },
    show(v) {
      if (!v) {
        this.lat = null;
        this.lng = null;
        this.h3Index = '';
        this.$emit('change-overlays', []);
        this.$emit('change-h3-index', { h3Index: null });
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

      this.updateH3Index();
      this.updatePolygon();

      this.emitOverlays();
      this.emitH3Index();
    },
    setH3Index(lat, lng, resolution) {
      this.h3Index = geoToH3(lat, lng, resolution);
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
    updateH3Index() {
      this.setH3Index(this.lat, this.lng, this.resolution.value);
    },
    updatePolygon() {
      this.setHexagonPolygon(this.h3Index);
    },
    emitOverlays() {
      this.$emit('change-overlays', [
        this.hexagonNaverPolygon,
      ]);
    },
    emitH3Index() {
      this.$emit('change-h3-index', {
        h3Index: this.h3Index,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
