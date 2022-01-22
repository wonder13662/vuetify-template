<template>
  <BaseAppCenter>
    <BaseContainer>
      <router-view />
    </BaseContainer>
  </BaseAppCenter>
</template>

<script>
import BaseAppCenter from '@/components/base/v1/BaseAppCenter';
import BaseContainer from '@/components/base/v1/BaseContainer';

export default {
  name: 'SystemLayout',
  components: {
    BaseAppCenter,
    BaseContainer,
  },
};
</script>

<style lang="scss" scoped>

</style>
