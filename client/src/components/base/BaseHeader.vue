<template>
  <v-row class="row">
    <v-col
      v-for="(name, idx) in names"
      :key="idx"
      :cols="cols"
      class="col"
    >
      <BaseText :text="name" />
    </v-col>
  </v-row>
</template>

<script>
import BaseText from '@/components/base/BaseText';

export default {
  name: 'BaseHeader',
  components: {
    BaseText,
  },
  props: {
    names: {
      type: Array,
      required: true,
    },
  },
  computed: {
    cols() {
      return 12 / this.names.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  margin: 0;
  width: 100%;
}
.col {
  text-align: center;
  padding: 5px;
}
</style>
