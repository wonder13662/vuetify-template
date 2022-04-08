<template>
  <v-tabs
    color="indigo"
    grow
    slider-size="4"
    @change="onChange"
  >
    <v-tab
      v-for="v in names"
      :key="v"
    >
      {{ v }}
    </v-tab>
    <v-tab-item
      v-for="(v, idx) in names"
      :key="v"
    >
      <slot
        name="item"
        :idx="idx"
      />
    </v-tab-item>
  </v-tabs>
</template>

<script>
export default {
  name: 'BaseTab',
  props: {
    names: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onChange(v) {
      this.$emit('change', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
