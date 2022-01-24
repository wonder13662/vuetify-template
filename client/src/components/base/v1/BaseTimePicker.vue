<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="timeData"
    transition="scale-transition"
    offset-y
    :max-width="width"
    :min-width="width"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="timeData"
        prepend-inner-icon="mdi-clock-time-four-outline"
        outlined
        dense
        hide-details
        readonly
        :disabled="disabled"
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-time-picker
      v-if="menu"
      v-model="timeData"
      full-width
      format="24hr"
      use-seconds
    >
      <v-spacer />
      <v-btn
        text
        color="primary"
        @click="onCancel"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="onOK"
      >
        OK
      </v-btn>
    </v-time-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'BaseTimePicker',
  props: {
    time: {
      type: String,
      default: '00:00',
    },
    width: {
      type: String,
      default: '320px',
    },
    disabled: {
      type: Boolean,
    },
  },
  data() {
    return {
      timeData: this.time,
      menu: false,
    };
  },
  watch: {
    time(v) {
      if (v !== this.timeData) {
        this.timeData = v;
      }
    },
  },
  methods: {
    onCancel() {
      this.reset();
    },
    onOK() {
      this.$refs.menu.save(this.timeData);
      this.$emit('change', { time: this.timeData });
      this.reset();
    },
    reset() {
      this.menu = false;
      this.timeData = null;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
