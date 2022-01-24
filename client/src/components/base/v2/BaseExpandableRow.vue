<template>
  <div>
    <div>
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
    </div>
    <div>
      <slot v-if="expandable && show" />
    </div>
  </div>
</template>

<script>
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
import BaseHeading from '@/components/base/v1/BaseHeading';

export default {
  name: 'BaseExpandableRow',
  components: {
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
