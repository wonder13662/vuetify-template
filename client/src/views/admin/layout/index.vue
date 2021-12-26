<template>
  <BaseApp>
    <BaseContainer :fill-height="false">
      <v-row no-gutters>
        <v-col
          cols="4"
          class="left-col flex-grow-1 flex-shrink-0"
        >
          <LeftView />
        </v-col>
        <v-col
          cols="4"
          style=""
          class="right-col flex-grow-1 flex-shrink-0 right-col v-col--right"
        >
          <RightView />
        </v-col>
      </v-row>
    </BaseContainer>
  </BaseApp>
</template>

<script>
import BaseApp from '@/components/base/BaseApp';
import BaseContainer from '@/components/base/BaseContainer';
import LeftView from './LeftView';
import RightView from './RightView';

export default {
  name: 'AdminLayout',
  components: {
    BaseApp,
    BaseContainer,
    LeftView,
    RightView,
  },
};
</script>

<style lang="scss" scoped>
.left-col {
  min-width: 360px;
  max-width: 360px;
}
.right-col {
  max-width: 100%;
}
</style>
