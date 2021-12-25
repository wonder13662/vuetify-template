<template>
  <BaseApp>
    <BaseContainer>
      <router-view />
    </BaseContainer>
  </BaseApp>
</template>

<script>
import BaseApp from '@/components/base/BaseApp';
import BaseContainer from '@/components/base/BaseContainer';

export default {
  name: 'SystemLayout',
  components: {
    BaseApp,
    BaseContainer,
  },
};
</script>

<style lang="scss" scoped>

</style>
