<template>
  <v-container
    :fill-height="fillHeight"
    fluid
    class="pa-0"
    :style="styleObject"
  >
    <slot />
  </v-container>
</template>

<script>
// NOTE: BaseContainer 아래의 자식 객체를 flex로 제어하지 않도록 한다.
// 왜냐하면, BaseContainer 안의 자식이 1개가 놓여지는 경우가 많음. 이런 경우, 의도하지 않은 여백이 생김.
// 그리고 BaseContainer의 안의 자식이 여러개 생기는 경우는 BaseRow, BaseCol로 제어하는 것을 기본으로 한다.
export default {
  name: 'BaseContainer',
  props: {
    styleObject: {
      type: Object,
      default: () => ({}),
    },
    fillHeight: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
