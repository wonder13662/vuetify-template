<template>
  <v-switch
    inset
    dense
    class="pa-0 ma-0"
    :label="label"
    :input-value="value"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'BaseSwitch',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
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
