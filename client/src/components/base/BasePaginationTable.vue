<template>
  <v-card
    :elevation="0"
  >
    <BaseContentHorizontalLayout
      v-if="!hideTotalCnt"
      col-width-left="200px"
    >
      <template v-slot:left>
        <div class="pa-2">
          <BaseHeading
            :text="labelTotal"
          />
        </div>
      </template>
      <template v-slot:right>
        <slot name="top-right-box" />
      </template>
    </BaseContentHorizontalLayout>
    <v-divider />
    <v-data-table
      :headers="headers"
      :items="items"
      dense
      :page="currentPage"
      :items-per-page="itemCntPerPage"
      :no-data-text="textNoData"
      :server-items-length="totalCnt"
      :loading="loading"
      :loading-text="textLoading"
      hide-default-footer
      @click:row="onClickRow"
    >
      <template v-slot:item.actions="{ item, header }">
        <slot
          :item="item"
          :header="header"
        />
      </template>
    </v-data-table>
    <div class="text-center pt-2 pb-2">
      <v-pagination
        :value="currentPage"
        :length="pageCount"
        :total-visible="totalVisible"
        @input="onChangePage"
      />
    </div>
  </v-card>
</template>

<script>
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseHeading from '@/components/base/BaseHeading';

// https://v2.vuejs.org/v2/guide/components-slots.html#Scoped-Slots
const TOTAL_VISIBLE_DEFAULT = 10;
export default {
  name: 'BasePaginationTable',
  components: {
    BaseContentHorizontalLayout,
    BaseHeading,
  },
  props: {
    headers: {
      type: Array,
      required: true,
      validator(v) {
        const found = v.findIndex((item) => !item.text || !item.value);
        return !(found > -1);
      },
    },
    items: {
      type: Array,
      required: true,
    },
    totalCnt: {
      type: Number,
      required: true,
    },
    hideTotalCnt: {
      type: Boolean,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    itemCntPerPage: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      textTotal: this.$t('components.total'),
      textRowUnit: this.$t('components.rowUnit'),
      textNoData: this.$t('components.noData'),
      textLoading: this.$t('components.loadingText'),
    };
  },
  computed: {
    labelTotal() {
      return `${this.textTotal} ${this.totalCnt}${this.textRowUnit}`;
    },
    pageCount() {
      const remainder = this.totalCnt % this.itemCntPerPage;
      return Math.floor(this.totalCnt / this.itemCntPerPage) + (remainder > 0 ? 1 : 0);
    },
    totalVisible() {
      return TOTAL_VISIBLE_DEFAULT;
    },
  },
  methods: {
    async onChangePage(v) {
      this.$emit('change:page', v);
    },
    onClickRow(v) {
      this.$emit('click:row', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
