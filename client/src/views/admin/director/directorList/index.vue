<template>
  <BaseContainer>
    <BaseRow>
      <BaseCol
        :cols="3"
      >
        <DirectorSearchFilter
          :query="query"
          @change="onChangeSearchFilter"
          @submit="onSubmit"
        />
      </BaseCol>
      <BaseCol
        :cols="9"
        class="pl-3"
      >
        <DirectorPaginationTable
          :items="items"
          :total-cnt="totalCnt"
          @on-change-page="onChangePage"
          @on-click-row="onClickRow"
        />
      </BaseCol>
    </BaseRow>
  </BaseContainer>
</template>

<script>
import store from '@/store';
import BaseContainer from '@/components/base/BaseContainer';
import BaseRow from '@/components/base/BaseRow';
import BaseCol from '@/components/base/BaseCol';
import DirectorPaginationTable from './DirectorPaginationTable';
import DirectorSearchFilter from './DirectorSearchFilter';

export default {
  name: 'DirectorList',
  components: {
    BaseContainer,
    BaseRow,
    BaseCol,
    DirectorPaginationTable,
    DirectorSearchFilter,
  },
  computed: {
    query() {
      return store.getters['directorList/query'];
    },
    totalCnt() {
      return store.getters['directorList/totalCnt'];
    },
    items() {
      return store.getters['directorList/list'];
    },
  },
  async created() {
    await store.dispatch('directorList/fetchList');
  },
  methods: {
    onChangeSearchFilter(v) {
      const {
        name = '',
        email = '',
        phoneNumber = '',
        approveStatusList,
      } = v;
      store.dispatch('directorList/setQuery', {
        query: {
          name,
          email,
          phoneNumber,
          approveStatusList,
        },
      });
    },
    async onSubmit() {
      await store.dispatch('directorList/fetchList');
    },
    async onChangePage(v) {
      const {
        currentPage,
        itemsPerPage,
      } = v;
      store.dispatch('directorList/setPagination', {
        pagination: {
          currentPage,
          limit: itemsPerPage,
        },
      });

      await store.dispatch('directorList/fetchList');
    },
    onClickRow(row) {
      // eslint-disable-next-line no-console
      console.log('onClickRow / row:', row);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
