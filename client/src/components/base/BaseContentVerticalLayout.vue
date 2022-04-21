<!-- eslint-disable max-len -->
<template>
  <div
    class="base-content-vertial-layout d-flex align-start flex-column"
  >
    <div
      class="bcvl-head base-content-vertial-layout-row transparent"
    >
      <div
        :class="classObjectHead"
      >
        <slot name="head" />
      </div>
    </div>
    <div
      class="bcvl-body base-content-vertial-layout-row base-content-vertial-layout-row-body transparent lighten-1 flex-grow-1"
      :style="{ height: bodyHeight }"
    >
      <slot
        name="body"
      />
    </div>
    <div
      class="bcvl-tail base-content-vertial-layout-row transparent darken-1"
    >
      <div
        :class="classObjectTail"
      >
        <slot name="tail" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseContentVerticalLayout',
  props: {
    bodyHeight: {
      type: String,
      required: true,
    },
    dividerHead: {
      type: Boolean,
    },
    dividerHeadBody: {
      type: Boolean,
    },
    dividerBodyTail: {
      type: Boolean,
    },
    dividerTail: {
      type: Boolean,
    },
  },
  computed: {
    classObjectHead() {
      return {
        'divider-head': this.dividerHead,
        'divider-head-body': this.dividerHeadBody,
      };
    },
    classObjectTail() {
      return {
        'divider-body-tail': this.dividerBodyTail,
        'divider-tail': this.dividerTail,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.base-content-vertial-layout {
  height: 100%;
}
.base-content-vertial-layout-row {
  width: 100%;
}
.base-content-vertial-layout-row-body {
  overflow-y: auto;
  overflow-x: hidden;
}
.divider-head {
  border-top: solid 1px rgba(0, 0, 0, 0.12);
}
.divider-head-body {
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);
}
.divider-body-tail {
  border-top: solid 1px rgba(0, 0, 0, 0.12);
}
.divider-tail {
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);
}
</style>
