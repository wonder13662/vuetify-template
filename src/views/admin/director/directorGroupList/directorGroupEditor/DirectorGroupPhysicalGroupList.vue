<template>
  <BaseTableSelectable
    :title="$t('views.admin.directorGroup.editor.physicalGroupList.title')"
    :headers="headers"
    :items="physicalGroupList"
    item-key="physicalGroupId"
    :selected="selected"
    @change="onChange"
  />
</template>

<script>
import BaseTableSelectable from '@/components/base/BaseTableSelectable';
import i18n from '@/plugins/vueI18n';

export default {
  name: 'DirectorGroupPhysicalGroupList',
  components: {
    BaseTableSelectable,
  },
  props: {
    physicalGroupList: {
      type: Array,
      required: true,
    },
    selected: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      headers: [
        {
          text: i18n.t('views.admin.directorGroup.editor.physicalGroupList.headers.name'),
          value: 'name',
        },
        {
          text: i18n.t('views.admin.directorGroup.editor.physicalGroupList.headers.maxNormalDriverCount'),
          value: 'maxNormalDriverCount',
        },
        {
          text: i18n.t('views.admin.directorGroup.editor.physicalGroupList.headers.h3PolygonCount'),
          value: 'h3PolygonCount',
        },
        {
          text: i18n.t('views.admin.directorGroup.editor.physicalGroupList.headers.directorGroupCount'),
          value: 'directorGroupCount',
        },
      ],
    };
  },
  methods: {
    onChange(v) {
      this.$emit('change', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
