<template>
  <div>
    <div>
      <BaseContentHorizontalLayout
        col-width-right="36px"
      >
        <template v-slot:left>
          <slot
            name="head"
          />
          <div
            v-if="title"
            class="pa-1"
          >
            <BaseText
              v-if="small"
              bold
              :text="title"
            />
            <BaseHeading
              v-else
              :text="title"
            />
          </div>
        </template>
        <template v-slot:right>
          <v-btn
            icon
            :disabled="!expandable"
            :small="small"
            @click="onClick"
          >
            <v-icon
              :small="small"
            >
              {{ expandable && show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </v-btn>
        </template>
      </BaseContentHorizontalLayout>
    </div>
    <div>
      <slot
        v-if="expandable && show"
        name="body"
      />
    </div>
  </div>
</template>

<script>
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
import BaseHeading from '@/components/base/v1/BaseHeading';
import BaseText from '@/components/base/v1/BaseText';

export default {
  name: 'BaseExpandableRow',
  components: {
    BaseContentHorizontalLayout,
    BaseHeading,
    BaseText,
  },
  props: {
    title: {
      type: String,
      default: '',
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
    small: {
      type: Boolean,
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
