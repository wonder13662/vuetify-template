<template>
  <div>
    <DirectorGroupPagination
      v-if="isPageModeRead"
      :items="items"
      :total-cnt="totalCnt"
      :search-keyword="searchKeyword"
      @on-change-page="onChangePage"
      @on-click-row="onClickRow"
      @on-change-search-keyword-name="onChangeSearchKeywordName"
      @on-click-create="onClickCreate"
    />
    <DirectorGroupEditor
      v-else
      :director-group="directorGroup"
      :physical-group-list="physicalGroupList"
      :physical-group-list-for-map="physicalGroupListForMap"
      :director-list="directorList"
      :page-mode="pageMode"
      @change="onChangeDirectorGroup"
      @cancel="onCancel"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import store from '@/store';
import DirectorGroupEditor from './directorGroupEditor';
import DirectorGroupPagination from './directorGroupPagination';
import {
  DIRECTOR_GROUP__PAGE_MODE,
} from '@/lib/constants';

const {
  DIRECTOR_GROUP_READ,
  DIRECTOR_GROUP_CREATE,
  DIRECTOR_GROUP_UPDATE,
} = DIRECTOR_GROUP__PAGE_MODE;

export default {
  name: 'DirectorGroupList',
  components: {
    DirectorGroupEditor,
    DirectorGroupPagination,
  },
  data() {
    return {
      itemsPerPage: 10,
    };
  },
  computed: {
    isPageModeRead() {
      const pageMode = store.getters['directorGroupList/pageMode'];
      return pageMode === DIRECTOR_GROUP__PAGE_MODE.DIRECTOR_GROUP_READ;
    },
    totalCnt() {
      return store.getters['directorGroupList/totalCnt'];
    },
    items() {
      return store.getters['directorGroupList/list']
        .filter(({ name }) => name.indexOf(this.searchKeyword) > -1)
        .map((v) => ({
          ...v,
          physicalGroupNames: v.DirectorGroupPhysicalGroups.map((item) => item.PhysicalGroup.name).join(','),
        }));
    },
    searchKeyword() {
      return store.getters['directorGroupList/directorGroupListSearchKeyword'];
    },
    directorGroup() {
      return store.getters['directorGroupList/directorGroup'];
    },
    physicalGroupList() {
      return store.getters['directorGroupList/physicalGroupList'].map(({
        physicalGroupId,
        name,
        DispatchRoom: { maxNormalDriverCount },
        h3PolygonCount,
        DirectorGroupPhysicalGroups,
      }) => ({
        physicalGroupId,
        name,
        maxNormalDriverCount,
        h3PolygonCount,
        directorGroupCount: DirectorGroupPhysicalGroups ? DirectorGroupPhysicalGroups.length : 0,
      }));
    },
    physicalGroupListForMap() {
      return store.getters['directorGroupList/physicalGroupList'].map(({
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
    },
    directorList() {
      return store.getters['directorGroupList/directorList'].map(({ name, serviceUserId }) => ({
        name,
        serviceUserId,
      }));
    },
    pageMode() {
      return store.getters['directorGroupList/pageMode'];
    },
  },
  async created() {
    await store.dispatch('directorGroupList/fetchDirectorList');
    await store.dispatch('directorGroupList/fetchPhysicalGroupList');
    await store.dispatch('directorGroupList/fetchList');
  },
  methods: {
    async onChangePage(page) {
      store.dispatch('directorGroupList/setPagination', {
        pagination: {
          currentPage: page,
          limit: this.itemsPerPage,
        },
      });

      await store.dispatch('directorGroupList/fetchList');
    },
    onClickRow(row) {
      const {
        directorGroupId,
        name,
        DirectorGroupPhysicalGroups: physicalGroups,
        DirectorGroupDirectors: directors,
      } = row;
      store.dispatch('directorGroupList/setDirectorGroup', {
        directorGroupId,
        name,
        basePhysicalGroupIds: physicalGroups.map((v) => v.PhysicalGroup.physicalGroupId),
        directorIds: directors.map((v) => v.Director.serviceUserId),
      });
      store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_UPDATE });
    },
    onClickCreate() {
      store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_CREATE });
    },
    onChangeSearchKeywordName(name) {
      store.dispatch('directorGroupList/setDirectorGroupSearchKeyword', { searchKeyword: name });
    },
    onChangeDirectorGroup({
      name,
      basePhysicalGroupIds,
      directorIds,
    }) {
      store.dispatch('directorGroupList/setDirectorGroup', {
        name,
        basePhysicalGroupIds,
        directorIds,
      });
    },
    onCancel() {
      store.dispatch('directorGroupList/clearDirectorGroup');
      store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_READ });
    },
    async onSubmit(v) {
      const pageMode = store.getters['directorGroupList/pageMode'];
      if (pageMode === DIRECTOR_GROUP_CREATE) {
        store.dispatch('directorGroupList/createDirectorGroup', { directorGroup: v });
        store.dispatch('directorGroupList/clearDirectorGroup');
        store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_READ });
      } else if (pageMode === DIRECTOR_GROUP_UPDATE) {
        store.dispatch('directorGroupList/updateDirectorGroup', { directorGroup: v });
        store.dispatch('directorGroupList/clearDirectorGroup');
        store.dispatch('directorGroupList/setPageMode', { pageMode: DIRECTOR_GROUP_READ });
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
