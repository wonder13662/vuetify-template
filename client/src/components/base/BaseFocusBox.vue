<template>
  <div
    :class="classObject"
    @mouseover="onMouseover"
    @mouseleave="onMouseleave"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseFocusBox',
  props: {
    isFocus: {
      type: Boolean,
    },
  },
  computed: {
    classObject() {
      return {
        'box--focus': this.isFocus,
      };
    },
  },
  methods: {
    onMouseover() {
      this.$emit('focus');
    },
    onMouseleave() {
      this.$emit('blur');
    },
  },
};
</script>

<style lang="scss" scoped>
.box--focus {
  background: #E1BEE7;
}
</style>
