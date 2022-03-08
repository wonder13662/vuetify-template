<template>
  <div>
    <BaseExpandableRow
      title="H3 Polygon Lasso"
      :show="show"
      :meta="meta"
      @click="onClick"
    >
      <template v-slot:body>
        <div>Content</div>
      </template>
    </BaseExpandableRow>
  </div>
</template>

<script>

import BaseExpandableRow from '@/components/base/BaseExpandableRow';
import {
  hexagonSelectorHandler,
} from '@/lib/naverMapV2';

const hexagonSelector = hexagonSelectorHandler.createHexagonSelector({
  meta: {
    name: 'H3PolygonLasso',
  },
  disabled: true,
  visible: false,
});

// TODO 화면을 여닫는 시점에 데이터를 clear 할 수 있어야 한다
// TODO 쌓인 데이터를 표시해야 한다
// TODO 변경된 데이터를 Vue component 단으로 전달할 수 있어야 한다

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
  watch: {
    show(v) {
      hexagonSelector.clear();
      if (!v) {
        hexagonSelector.setVisible(false);
        hexagonSelector.setDisabled(true);
        hexagonSelector.setOnChange(null);
        return;
      }
      hexagonSelector.setVisible(true);
      hexagonSelector.setDisabled(false);
      hexagonSelector.setOnChange((h3Indexes) => {
        this.onChange(h3Indexes);
      });
    },
  },
  created() {
    this.$emit('change-overlays', [
      hexagonSelector,
    ]);
  },
  methods: {
    onClick({ meta, show }) {
      this.$emit('change', {
        meta,
        show,
      });
    },
    onChange(v) {
      // eslint-disable-next-line no-console
      console.log('HERE/onChange/v:', v);
    },

  },
};
</script>

<style lang="scss" scoped>

</style>
