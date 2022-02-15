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
  TODO
    - Point들 중에 하나만 선택하고 수정하는 기능은 별도의 NaverMap 모듈로 떼어내자(이 기능은 다른 곳에서도 활용할 가능성이 높다)
*/
import { v4 as uuidv4 } from 'uuid';
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
      pointEditing: null,
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

      if (this.mode !== MODE_ADD && this.mode !== MODE_REMOVE) {
        return;
      }

      const selected = this.overlays.find((o) => o.isSelected());
      if (selected) {
        // 사용자가 지도 위의 point를 선택하였다면, 새로운 좌표는 선택한 point에 적용한다.
        selected.setPosition(v.point);
        return;
      }

      // TODO 맵 객체에 좌표를 추가하면 바로 지도에 표시됨. 선택한 point가 변경을 완료한 시점에 맵 객체를 업데이트 해야함(이건 저녁에!)
      // 맵에 저장된 좌표도 업데이트를 해준다.
      this.addPointToMap(v.point.lat, v.point.lng);

      // TODO 가장 가까운 point들끼리 이어준다.
    },
    pointMap(v) {
      // 0. overlays 전체 삭제
      this.overlays.forEach((o) => o.destroy());
      this.overlays = [];
      // TODO 어떤 point가 선택된 뒤에 클릭 이벤트로 들어온 좌표가 자신의 좌표와 다른 좌표라면 해당 point를 이동시켜 줍니다.
      // TODO 아래 로직을 별도 모듈로 떼어내야 합니다. 전체 기능 구현 이후, 모듈 설계를 합시다.
      // 1. 포인트 갯수가 변경되었으므로 overlay도 업데이트해줍니다.
      this.overlays = Object.values(v).reduce((acc, point) => {
        const pointMarker = pointMarkerHandler.createPointMarker({
          point,
          meta: {
            id: uuidv4(),
          },
        });
        pointMarker.addClickListener(({ meta: { id } }) => {
          const found = this.overlays.find((o) => o.meta.id === id);
          if (found && found.isEnabled()) {
            if (found.isSelected()) {
              // SELECTED 상태로 바뀌면, 이외의 다른 point들은 모두 disabled 상태로 바꿉니다.
              this.overlays.forEach((o) => {
                if (o.meta.id !== id) {
                  o.setDisabled();
                }
              });
              // 수정중인 point의 좌표를 등록합니다.
              this.pointEditing = found.getPosition();
            } else if (found.isUnselected()) {
              // UNSELECTED 상태로 바뀌면, 모든 point들을 모두 enabled 상태로 바꿉니다.
              this.overlays.forEach((o) => {
                if (o.meta.id !== id) {
                  o.setEnabled();
                }
              });
              // 클릭한(수정중인) point 객체의 이전 좌표를 맵에서 지웁니다.
              this.removePointFromMap(this.pointEditing.lat, this.pointEditing.lng);
              this.pointEditing = null;
              // 클릭한(수정중인) point 객체의 좌표를 맵에 등록합니다.
              const { lat, lng } = found.getPosition();
              this.addPointToMap(lat, lng);
            }
          }
        });
        acc.push(pointMarker);
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
    addPointToMap(lat, lng) {
      const key = this.createPointKey(lat, lng);
      Vue.set(this.pointMap, key, { lat, lng });
    },
    removePointFromMap(lat, lng) {
      const key = this.createPointKey(lat, lng);
      Vue.delete(this.pointMap, key);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
