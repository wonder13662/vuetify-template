<template>
  <BaseApp>
    <BaseContainer>
      <router-view />
    </BaseContainer>
  </BaseApp>
</template>

<script>
import BaseApp from '@/components/base/v1/BaseApp';
import BaseContainer from '@/components/base/v1/BaseContainer';

export default {
  name: 'AuthLayout',
  components: {
    BaseApp,
    BaseContainer,
  },
};
</script>

<style lang="scss" scoped>

</style>
