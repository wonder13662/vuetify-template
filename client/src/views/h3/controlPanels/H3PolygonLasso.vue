<template>
  <div>
    <BaseExpandableRow
      title="H3 Polygon Lasso"
      :show="show"
      :meta="meta"
      @click="onClick"
    >
      <template v-slot:body>
        <div
          v-for="h3Index in h3Indexes"
          :key="h3Index"
        >
          <div>{{ h3Index }}</div>
        </div>
      </template>
    </BaseExpandableRow>
  </div>
</template>

<script>

import BaseExpandableRow from '@/components/base/BaseExpandableRow';
import {
  hexagonSelectorHandler,
} from '@/lib/naverMapV3';


// TODO 화면을 여닫는 시점에 데이터를 clear 할 수 있어야 한다
// TODO 쌓인 데이터를 표시해야 한다
// TODO 변경된 데이터를 Vue component 단으로 전달할 수 있어야 한다

let hexagonSelector = null;

export default {
  name: 'H3PolygonLasso',
  components: {
    BaseExpandableRow,
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
      h3Indexes: [],
    };
  },
  watch: {
    show(v) {
      if (!v) {
        this.destroyHexagonSelector();
        return;
      }
      this.destroyHexagonSelector();
      this.createHexagonSelector();
      this.emitChangeOverlays();
    },
  },
  methods: {
    onClick({ meta, show }) {
      this.$emit('change', {
        meta,
        show,
      });
    },
    onChange(v) {
      this.h3Indexes = v;
    },
    destroyHexagonSelector() {
      if (hexagonSelector) {
        hexagonSelector.destroy();
        hexagonSelector = null;
      }
    },
    createHexagonSelector() {
      hexagonSelector = hexagonSelectorHandler.createHexagonSelector({
        meta: {
          name: 'H3PolygonLasso',
        },
        disabled: false,
        visible: true,
        onChange: (h3Indexes) => this.onChange(h3Indexes),
      });
    },
    emitChangeOverlays() {
      this.$emit('change-overlays', [
        hexagonSelector,
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
