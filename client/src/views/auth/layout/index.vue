<template>
  <BaseAppCenter>
    <BaseContainer>
      <router-view />
    </BaseContainer>
  </BaseAppCenter>
</template>

<script>
import BaseAppCenter from '@/components/base/BaseAppCenter';
import BaseContainer from '@/components/base/BaseContainer';

export default {
  name: 'AuthLayout',
  components: {
    BaseAppCenter,
    BaseContainer,
  },
};
</script>

<style lang="scss" scoped>

</style>
