<template>
  <BaseContainer>
    <div class="physical-group-list__layout-row">
      <div class="physical-group-list__layout-col-left">
        <LeftView />
      </div>
      <div class="physical-group-list__layout-col-right">
        <RightView />
      </div>
    </div>
  </BaseContainer>
</template>

<script>
import BaseContainer from '@/components/base/BaseContainer';
import LeftView from './LeftView';
import RightView from './RightView';

export default {
  name: 'PhysicalGroupListLayout',
  components: {
    BaseContainer,
    LeftView,
    RightView,
  },
};
</script>

<style lang="scss" scoped>
.physical-group-list__layout {
  height: 100%;
  padding: 0px;
  margin: 0;
}
.physical-group-list__layout-row {
  height: 100%;
  width: calc(100vw - 360px);
  margin: 0;
  display: flex;
  flex-direction: row;
}
.physical-group-list__layout-col-left {
  flex: auto;
}
.physical-group-list__layout-col-right {
  width: 480px;
}
</style>
