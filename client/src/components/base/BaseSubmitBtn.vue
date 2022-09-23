<template>
  <v-btn
    :block="block"
    depressed
    :disabled="disabled"
    :color="color"
    @click="onClick"
  >
    {{ text }}
  </v-btn>
</template>

<script>
export default {
  name: 'BaseSubmitBtn',
  props: {
    disabled: {
      type: Boolean,
    },
    text: {
      type: String,
      default: 'Submit',
    },
    typeError: {
      type: Boolean,
    },
    block: {
      type: Boolean,
      // TODO 추후 일괄적으로 기본값은 false로 전환
      default: true,
    },
  },
  computed: {
    color() {
      if (this.typeError) {
        return 'error';
      }
      return 'primary';
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
