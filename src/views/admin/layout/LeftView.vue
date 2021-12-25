<template>
  <div
    class="left-view--container"
  >
    <BaseContainer :fill-height="false">
      <AppNav />
    </BaseContainer>
  </div>
</template>

<script>
import BaseContainer from '@/components/base/BaseContainer';
import AppNav from '@/components/AppNav';

export default {
  name: 'LeftView',
  components: {
    BaseContainer,
    AppNav,
  },
};
</script>

<style lang="scss" scoped>
.left-view--container {
  position: fixed;
  height: 100vh;
  width: 360px; /* FIX ME SCSS 변수 참조하도록 변경 */
  overscroll-behavior: contain ; /* Prevent SCROLL-CHAINING to parent elements. */
};
</style>
