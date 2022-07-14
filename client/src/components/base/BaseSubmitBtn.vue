<template>
  <v-btn
    block
    depressed
    :disabled="disabled"
    color="primary"
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
