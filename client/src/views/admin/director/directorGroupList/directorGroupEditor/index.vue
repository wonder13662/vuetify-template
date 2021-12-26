<template>
  <div>
    <div v-if="isShowPhysicalGroupList">
      <BaseRow>
        <BaseCol :cols="4">
          <DirectorGroupMap
            :hexagon-groups="hexagonGroupsOnMap"
          />
        </BaseCol>
        <BaseCol :cols="4">
          <DirectorGroupPhysicalGroupList
            :physical-group-list="physicalGroupList"
            :selected="selected"
            @change="onChangeDirectorGroupPhysicalGroup"
          />
        </BaseCol>
        <BaseCol :cols="4">
          <DirectorGroupForm
            :director-group="directorGroupData"
            :director-group-physical-groups="directorGroupPhysicalGroupsOnForm"
            :director-list="directorListTransformed"
            :is-show-physical-group-list="isShowPhysicalGroupList"
            @change="onChangeDirectorGroup"
            @toggle-physical-group-list="onTogglePhysicalGroupList"
            @cancel="onCancel"
            @submit="onSubmit"
          />
        </BaseCol>
      </BaseRow>
    </div>
    <div v-else>
      <BaseRow>
        <BaseCol :cols="8">
          <DirectorGroupMap
            :hexagon-groups="hexagonGroupsOnMap"
          />
        </BaseCol>
        <BaseCol :cols="4">
          <DirectorGroupForm
            :director-group="directorGroupData"
            :director-group-physical-groups="directorGroupPhysicalGroupsOnForm"
            :director-list="directorListTransformed"
            :is-show-physical-group-list="isShowPhysicalGroupList"
            @change="onChangeDirectorGroup"
            @toggle-physical-group-list="onTogglePhysicalGroupList"
            @cancel="onCancel"
            @submit="onSubmit"
          />
        </BaseCol>
      </BaseRow>
    </div>
    <BaseDialogSmall
      :title="$t('views.admin.directorGroup.editor.cancelDialog.title')"
      :content="$t('views.admin.directorGroup.editor.cancelDialog.content')"
      :is-show="isShowCancelDialog"
      @no="onNoCancel"
      @yes="onYesCancel"
    />
  </div>
</template>

<script>
import BaseRow from '@/components/base/BaseRow';
import BaseCol from '@/components/base/BaseCol';
import BaseDialogSmall from '@/components/base/BaseDialogSmall';
import DirectorGroupMap from './DirectorGroupMap';
import DirectorGroupForm from './DirectorGroupForm';
import DirectorGroupPhysicalGroupList from './DirectorGroupPhysicalGroupList';
import hexagonGroupHandler from '@/lib/naverMapV2/hexagonGroupHandler';
import {
  HEXAGON_STATUS,
} from '@/lib/naverMapV2/lib/constants';
import {
  PHYSICALGROUP_TYPE,
} from '@/lib/constants';
import i18n from '@/plugins/vueI18n';

export default {
  name: 'DirectorGroupEditor',
  components: {
    BaseRow,
    BaseCol,
    BaseDialogSmall,
    DirectorGroupMap,
    DirectorGroupForm,
    DirectorGroupPhysicalGroupList,
  },
  props: {
    directorGroup: {
      type: Object,
      required: true,
    },
    physicalGroupList: {
      type: Array,
      required: true,
    },
    physicalGroupListForMap: {
      type: Array,
      required: true,
    },
    directorList: {
      type: Array,
      required: true,
    },
    pageMode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isShowPhysicalGroupList: false,
      directorGroupData: this.directorGroup,
      isShowCancelDialog: false,
    };
  },
  computed: {
    directorGroupPhysicalGroupIdSet() {
      return this.directorGroupData.basePhysicalGroupIds.reduce((acc, v) => {
        acc.add(v);
        return acc;
      }, new Set());
    },
    directorGroupPhysicalGroupsOnForm() {
      return this.physicalGroupList
        .filter(({ physicalGroupId: v }) => this.directorGroupPhysicalGroupIdSet.has(v))
        .map(({
          name,
          maxNormalDriverCount,
          h3PolygonCount,
          DirectorGroupPhysicalGroups,
        }) => ({
          name,
          maxNormalDriverCount,
          h3PolygonCount,
          directorGroupCount: DirectorGroupPhysicalGroups ? DirectorGroupPhysicalGroups.length : 0,
        }));
    },
    hexagonGroupsOnMap() {
      const physicalGroupsOnMap = this.physicalGroupListForMap.map(({
        physicalGroupId,
        type,
        name,
        PhysicalGroupH3Polygons,
      }) => ({
        physicalGroupId,
        type,
        name,
        PhysicalGroupH3Polygons,
      }));

      const hexagonGroupDataList = physicalGroupsOnMap.map(({
        physicalGroupId,
        type,
        name,
        PhysicalGroupH3Polygons,
      }) => ({
        hexagonGroupName: name,
        h3Indexes: PhysicalGroupH3Polygons.map(({ H3Polygon: { h3Index } }) => h3Index),
        meta: {
          physicalGroupId,
          type,
        },
      }));

      const hexagonGroups = hexagonGroupDataList.map(({
        hexagonGroupName,
        h3Indexes,
        meta,
      }) => (hexagonGroupHandler.createHexagonGroup({
        hexagonGroupName,
        h3Indexes,
        driverCnt: 100, // TODO 임의로 넣어준 값. 나중에 서버와 연동해야 함.
        subDeliveryCnt: 100, // TODO 임의로 넣어준 값. 나중에 서버와 연동해야 함.
        meta,
        onClick: this.onClickHexagonGroup,
      })));

      // 선택된 physicalGroup은 상태를 HEXAGON_SELECTED로 바꾼다.
      hexagonGroups.forEach((v) => {
        const { meta: { physicalGroupId } } = v;
        if (this.directorGroupPhysicalGroupIdSet.has(physicalGroupId)) {
          v.setStatus(HEXAGON_STATUS.HEXAGON_SELECTED);
        }
      });

      return hexagonGroups;
    },
    directorListTransformed() {
      return this.directorList.map(({ name, serviceUserId }) => ({
        text: name,
        value: serviceUserId,
      }));
    },
    selected() {
      if (!this.directorGroupData) {
        return [];
      }
      const physicalGroupMap = this.physicalGroupList.reduce((acc, v) => {
        acc.set(v.physicalGroupId, v);
        return acc;
      }, new Map());
      const { basePhysicalGroupIds } = this.directorGroupData;
      return basePhysicalGroupIds
        .filter((v) => physicalGroupMap.has(v))
        .map((v) => physicalGroupMap.get(v));
    },
  },
  watch: {
    directorGroup(v) {
      this.directorGroupData = v;
    },
  },
  methods: {
    onChangeDirectorGroup(v) {
      this.directorGroupData = v;
    },
    onTogglePhysicalGroupList(v) {
      this.isShowPhysicalGroupList = v;
    },
    onCancel() {
      // 사용자가 입력을 취소함
      // 얼럿을 띄워서 정말 취소할 것인지 한번 더 확인함(작은 모달이 필요)
      // 사용자가 새로 입력한 데이터와 기존 데이터를 비교하는 것은 하지 않음(예외 상황들을 검증하기가 쉽지 않음)
      this.isShowCancelDialog = true;
    },
    onNoCancel() {
      this.isShowCancelDialog = false;
    },
    onYesCancel() {
      this.isShowCancelDialog = false;
      this.$emit('cancel');
    },
    onChangeDirectorGroupPhysicalGroup(v) {
      const basePhysicalGroupIds = v.map(({ physicalGroupId }) => physicalGroupId);
      this.directorGroupData = {
        ...this.directorGroupData,
        basePhysicalGroupIds,
      };
    },
    onSubmit() {
      this.$emit('submit', this.directorGroupData);
    },
    onClickHexagonGroup(hexagonGroup) {
      const {
        meta: {
          physicalGroupId,
          type,
        },
        status,
      } = hexagonGroup;

      if (PHYSICALGROUP_TYPE.BASE !== type) {
        throw new Error(`type:${type}/${i18n.t('common.error.notValidValue')}`);
      }

      const { basePhysicalGroupIds } = this.directorGroupData;
      if (status === HEXAGON_STATUS.HEXAGON_UNSELECTED) {
        this.directorGroupData = {
          ...this.directorGroupData,
          basePhysicalGroupIds: [...basePhysicalGroupIds, physicalGroupId],
        };
        return;
      }
      if (status === HEXAGON_STATUS.HEXAGON_SELECTED) {
        this.directorGroupData = {
          ...this.directorGroupData,
          basePhysicalGroupIds: basePhysicalGroupIds.filter((v) => v !== physicalGroupId),
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
