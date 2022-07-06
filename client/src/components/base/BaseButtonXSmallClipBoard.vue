<template>
  <div>
    <v-btn
      class="no-effect-upper-case"
      :disabled="disabled"
      :block="block"
      outlined
      x-small
      @click.stop="onClick"
    >
      {{ name }}
    </v-btn>
    <v-snackbar
      v-model="show"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'BaseButtonXSmall',
  props: {
    disabled: {
      type: Boolean,
    },
    block: {
      type: Boolean,
    },
    name: {
      type: [String, Number],
      required: true,
    },
    clipboardValue: {
      type: [String, Number],
      default: '',
    },
    clipboard: {
      type: Boolean,
    },
  },
  data() {
    return {
      show: false,
      text: this.$t('components.BaseButtonXSmall.snackBarMsgClipBoardCopied'),
    };
  },
  methods: {
    onClick() {
      this.$emit('click');
      if (this.clipboard) {
        navigator.clipboard.writeText(this.clipboardValue);
        this.show = true;
        setTimeout(() => {
          this.show = false;
        }, 3000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.no-effect-upper-case {
  text-transform: none;
}
</style>
