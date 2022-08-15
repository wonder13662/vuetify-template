<template>
  <v-btn
    block
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
