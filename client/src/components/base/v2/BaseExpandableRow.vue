<template>
  <BaseContentVerticalLayout
    body-height="calc(100vh - 100px)"
  >
    <template v-slot:head>
      <BaseContentHorizontalLayout
        col-width-right="36px"
      >
        <template v-slot:left>
          <div class="pa-1">
            <BaseHeading
              :text="title"
            />
          </div>
        </template>
        <template v-slot:right>
          <v-btn
            icon
            :disabled="!expandable"
            @click="onClick"
          >
            <v-icon>{{ expandable && show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </template>
      </BaseContentHorizontalLayout>
    </template>
    <template v-slot:body>
      <slot v-if="expandable && show" />
    </template>
  </BaseContentVerticalLayout>
</template>

<script>
import BaseContentVerticalLayout from '@/components/base/v2/BaseContentVerticalLayout';
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
import BaseHeading from '@/components/base/v1/BaseHeading';

export default {
  name: 'BaseExpandableRow',
  components: {
    BaseContentVerticalLayout,
    BaseContentHorizontalLayout,
    BaseHeading,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
    },
    expandable: {
      type: Boolean,
      default: true,
    },
    meta: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    onClick() {
      this.$emit('click', {
        meta: {
          ...this.meta,
        },
        show: !this.show,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
