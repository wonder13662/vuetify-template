<template>
  <div>
    <BaseHeading
      :text="title"
    />
    <BaseRow>
      <BaseCol :cols="8">
        <v-spacer />
      </BaseCol>
      <BaseCol :cols="2">
        <BaseTextField
          class="mr-1"
          :label="$t('views.admin.directorGroup.searchDirectorGroupByName')"
          :value="searchKeywordName"
          :is-search-type="true"
          @input="onInputName"
        />
      </BaseCol>
      <BaseCol :cols="2">
        <v-btn
          block
          :elevation="0"
          color="primary"
          class="mr-1"
          @click="onClickCreateDirectorGroup"
        >
          {{ `${$t('views.admin.directorGroup.createDirectorGroup')}` }}
        </v-btn>
      </BaseCol>
    </BaseRow>
    <BasePaginationTable
      :headers="headers"
      :items="items"
      :total-cnt="totalCnt"
      :item-cnt-per-page="itemsPerPage"
      :current-page="currentPage"
      @on-change-page="onChangePage"
      @on-click-row="onClickRow"
    />
  </div>
</template>

<script>
import BaseHeading from '@/components/base/BaseHeading';
import BasePaginationTable from '@/components/base/BasePaginationTable';
import BaseTextField from '@/components/base/BaseTextField';
import BaseRow from '@/components/base/BaseRow';
import BaseCol from '@/components/base/BaseCol';

export default {
  name: 'DirectorGroupPagination',
  components: {
    BaseHeading,
    BasePaginationTable,
    BaseTextField,
    BaseRow,
    BaseCol,
  },
  props: {
    totalCnt: {
      type: Number,
      default: 0,
    },
    items: {
      type: Array,
      default: () => ([]),
    },
    searchKeywordName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: this.$t('views.admin.directorGroup.title'),
      headers: [
        {
          text: this.$t('views.admin.directorGroup.header.name'),
          value: 'name',
        },
        {
          text: this.$t('views.admin.directorGroup.header.directorCount'),
          value: 'directorCount',
        },
        {
          text: this.$t('views.admin.directorGroup.header.physicalGroupNames'),
          value: 'physicalGroupNames',
        },
      ],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  methods: {
    async onChangePage(page) {
      this.$emit('on-change-page', page);
    },
    onClickRow(row) {
      this.$emit('on-click-row', row);
    },
    onClickCreateDirectorGroup() {
      this.$emit('on-click-create');
    },
    onInputName(v) {
      this.$emit('on-change-search-keyword-name', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
