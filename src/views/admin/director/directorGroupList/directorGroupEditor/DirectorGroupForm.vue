<template>
  <div>
    <BaseCard>
      <BaseList>
        <v-form
          v-model="valid"
        >
          <BaseListItemDense>
            <BaseListItemHeading
              :label="$t('views.admin.directorGroup.editor.form.title')"
            />
          </BaseListItemDense>
          <v-divider class="ma-2" />
          <BaseListItemDense>
            <BaseListItemLabel
              :label="$t('views.admin.directorGroup.editor.form.name')"
            />
          </BaseListItemDense>
          <BaseListItemDense>
            <BaseTextField
              :value="directorGroup.name"
              :rules="rulesName"
              @change="onChangeName"
            />
          </BaseListItemDense>
          <v-divider class="ma-2" />
          <BaseListItemDense>
            <BaseListItemHeading
              :label="$t('views.admin.directorGroup.editor.form.assignedPhysicalGroups')"
            />
          </BaseListItemDense>
          <BaseListItemDense>
            <BaseSwitch
              :label="$t('views.admin.directorGroup.editor.form.physicalGroupList')"
              :value="isShowPhysicalGroupList"
              @change="onClickTogglePhysicalGroupList"
            />
          </BaseListItemDense>
          <BaseListItemDense>
            <BaseTableSimple
              :headers="headers"
              :items="directorGroupPhysicalGroups"
            />
          </BaseListItemDense>
          <v-divider class="ma-2" />
          <BaseListItemLabelComboBox
            :label="$t('views.admin.directorGroup.editor.form.assignedDirectors')"
            :items="directorList"
            :vertical="true"
            :select="selectedDirectorList"
            @select-item="onChangeDirectorList"
          />
          <v-divider class="ma-2" />
        </v-form>
        <BaseListItemDense>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              elevation="0"
              @click="onCancel"
            >
              {{ `${$t('views.admin.directorGroup.editor.form.btnCancel')}` }}
            </v-btn>
            <v-btn
              color="primary"
              elevation="0"
              :disabled="!valid"
              @click="onSubmit"
            >
              {{ `${$t('views.admin.directorGroup.editor.form.btnSubmit')}` }}
            </v-btn>
          </v-card-actions>
        </BaseListItemDense>
      </BaseList>
    </BaseCard>
  </div>
</template>

<script>
import BaseCard from '@/components/base/BaseCard';
import BaseList from '@/components/base/BaseList';
import BaseListItemDense from '@/components/base/BaseListItemDense';
import BaseListItemHeading from '@/components/base/BaseListItemHeading';
import BaseListItemLabel from '@/components/base/BaseListItemLabel';
import BaseTextField from '@/components/base/BaseTextField';
import BaseTableSimple from '@/components/base/BaseTableSimple';
import BaseListItemLabelComboBox from '@/components/base/BaseListItemLabelComboBox';
import BaseSwitch from '@/components/base/BaseSwitch';
import utils from '@/lib/utils';
import i18n from '@/plugins/vueI18n';

export default {
  name: 'DirectorGroupForm',
  components: {
    BaseCard,
    BaseList,
    BaseListItemDense,
    BaseListItemHeading,
    BaseListItemLabel,
    BaseTextField,
    BaseTableSimple,
    BaseListItemLabelComboBox,
    BaseSwitch,
  },
  props: {
    directorGroup: {
      type: Object,
      required: true,
    },
    directorGroupPhysicalGroups: {
      type: Array,
      required: true,
    },
    directorList: {
      type: Array,
      required: true,
    },
    isShowPhysicalGroupList: {
      type: Boolean,
    },
  },
  data() {
    return {
      valid: false,
    };
  },
  computed: {
    headers() {
      return [
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
      ];
    },
    rulesName() {
      return utils.getDirectorGroupNameRules();
    },
    selectedDirectorList() {
      const { directorIds } = this.directorGroup;
      const idSet = directorIds.reduce((acc, id) => {
        acc.add(id);
        return acc;
      }, new Set());

      return this.directorList.filter(({ value: v }) => idSet.has(v)).map((v) => ({ ...v }));
    },
  },
  methods: {
    onChangeName(v) {
      this.$emit('change', {
        ...this.directorGroup,
        name: v,
      });
    },
    onClickTogglePhysicalGroupList(v) {
      this.$emit('toggle-physical-group-list', v);
    },
    onChangeDirectorList(v) {
      const directorIds = v.map(({ value }) => value);
      this.$emit('change', {
        ...this.directorGroup,
        directorIds,
      });
    },
    onCancel() {
      this.$emit('cancel');
    },
    onSubmit() {
      this.$emit('submit');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
