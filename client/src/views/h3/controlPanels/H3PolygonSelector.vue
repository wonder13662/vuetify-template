<template>
  <div>
    <BaseExpandableRow
      title="H3 Polygon Selector"
      :show="show"
      :meta="meta"
      @click="onClick"
    >
      <template v-slot:body>
        <!-- 4. H3 Resolution -->
        <BaseContentHorizontalLayout
          col-width-left="60px"
        >
          <template v-slot:left>
            <div class="pl-1 py-2">
              <BaseText
                bold
                text="모드"
              />
            </div>
          </template>
          <template v-slot:right>
            <div class="py-2">
              <BaseRadioGroup
                :selected-value="mode"
                :items="radioGroupItems"
                @change="onChangeMode"
              />
            </div>
          </template>
        </BaseContentHorizontalLayout>
      </template>
    </BaseExpandableRow>
  </div>
</template>

<script>
/*
  H3 Polygon Selector
  - 수정모드(추가)
    - 만들어진 영엑의 모든 H3Index가 추가된다.
    - H3Index들로 표시되는 영역은 떨어져 있을 수 있다.
    - 지도 표시는 h3.polyfill로 처리한다.
  - 수정모드(삭제)
    - 만들어진 영역의 모든 H3Index가 삭제된다.
    - 지도 표시는 h3.polyfill로 처리한다.
  - 수정모드:영역그리기
    - 영역의 포인트를 클릭하면 편집모드로 표시된다
    - 영역의 포인트를 편집모드 상태로 바꾸고 지도의 다른 위치를 클릭하면 포인트가 클릭 위치로 이동한다.(드래그는 기존 지도 이동 이벤트가 있으므로 사용하지말자)
    - 영역의 포인트는 삭제가 가능하다
    - 영역의 포인트를 잇슨 직선 사이에 좌표를 추가할 수 있다
    - 영역의 포인트는 Html 마커로 만들어 제어하자(Focus, Blur)
  - 읽기모드
    - 전체 영역에 대한 표시를 해준다
    - 마우스 이벤트는 전체 영역의 Focus, Blur 이벤트만을 처리한다.
*/
import Vue from 'vue';
import BaseExpandableRow from '@/components/base/BaseExpandableRow';
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseRadioGroup from '@/components/base/BaseRadioGroup';
import BaseText from '@/components/base/BaseText';
import {
  pointMarkerHandler,
  mapUtils,
} from '@/lib/naverMapV2';

const MODE_READ = 'MODE_READ';
const MODE_ADD = 'MODE_ADD';
const MODE_REMOVE = 'MODE_REMOVE';

export default {
  name: 'H3PolygonSelector',
  components: {
    BaseExpandableRow,
    BaseContentHorizontalLayout,
    BaseRadioGroup,
    BaseText,
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
      mode: MODE_READ,
      pointMap: {},
      radioGroupItems: [
        {
          text: '읽기',
          value: MODE_READ,
        },
        {
          text: '추가',
          value: MODE_ADD,
        },
        {
          text: '삭제',
          value: MODE_REMOVE,
        },
      ],
      overlays: [],
    };
  },
  watch: {
    meta(v) {
      if (!v
          || !v.point
          || !mapUtils.isLatitude(v.point.lat)
          || !mapUtils.isLongitude(v.point.lng)) {
        return;
      }

      // TODO point가 변경되었을 때, 가장 가까운 좌표끼리 이어주도록 바꾼다면?(이 아이디어는 가능할 것 같다).

      const key = this.createPointKey(v.point.lat, v.point.lng);
      if (!this.pointMap[key] && (this.mode === MODE_ADD || this.mode === MODE_REMOVE)) {
        Vue.set(this.pointMap, key, v.point);
      }
    },
    pointMap(v) {
      // 0. overlays 전체 삭제
      this.overlays.forEach((o) => o.destroy());
      this.overlays = [];
      // 1. 포인트 갯수가 변경되었으므로 overlay도 업데이트해줍니다.
      this.overlays = Object.values(v).reduce((acc, point) => {
        acc.push(pointMarkerHandler.createPointMarker({ point }));
        return acc;
      }, []);
      this.$emit('change-overlays', this.overlays);
    },
  },
  methods: {
    createPointKey(lat, lng) {
      return `${lat}_${lng}`;
    },
    onClick({ meta, show }) {
      this.$emit('change', {
        meta,
        show,
      });
    },
    onChangeMode(v) {
      this.mode = v;
      this.pointMap = {};
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
