<template>
  <v-row
    class="ma-0 pa-0"
    :class="rowClassObject"
  >
    <v-col
      class="ma-0 pa-0"
      :class="rightColClassObject"
      :cols="6"
    >
      <slot name="left" />
    </v-col>
    <v-col
      class="ma-0 pa-0 white"
      :class="leftColClassObject"
      :cols="6"
    >
      <slot name="right" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'BaseTinyTableRow',
  props: {
    last: {
      type: Boolean,
    },
    border: {
      type: Boolean,
    },
    color: {
      type: Boolean,
    },
  },
  computed: {
    rowClassObject() {
      return {
        'row-border-bottom': !this.last && this.border,
      };
    },
    rightColClassObject() {
      return {
        grey: this.color,
      };
    },
    leftColClassObject() {
      return {
        'col-border-left': this.border,
        white: this.color,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.row-border-bottom {
  border-bottom: solid 1px #BDBDBD;
}
.col-border-left {
  border-left: solid 1px #BDBDBD;
}
</style>
