<template>
  <BaseHeader :names="names" />
</template>

<script>
import BaseHeader from '@/components/base/BaseHeader';
import i18n from '@/plugins/vueI18n';

export default {
  name: 'PhysicalGroupListHeader',
  components: {
    BaseHeader,
  },
  data() {
    return {
      names: [
        i18n.t('views.physicalGroup.physicalGroupList.header.physicalGroupName'),
        i18n.t('views.physicalGroup.physicalGroupList.header.maxNormalDriverCount'),
        i18n.t('views.physicalGroup.physicalGroupList.header.directorGroupCount'),
        i18n.t('views.physicalGroup.physicalGroupList.header.actionButton'),
      ],
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
