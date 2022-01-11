<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value="date"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="date"
        dense
        readonly
        :hide-details="!errorMessage"
        :error-messages="errorMessage"
        :error="error"
        :outlined="outlined"
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-date-picker
      :value="date"
      :min="min"
      :max="max"
      no-title
      scrollable
      @change="onChange"
    />
  </v-menu>
</template>

<script>
import utils from '@/lib/utils';

export default {
  name: 'BaseDatePicker',
  props: {
    date: {
      type: String,
      default: utils.getNowYYYYMMDD(),
      // TODO validator
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: false,
    },
    min: {
      type: String,
      default: '',
    },
    max: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      menu: false,
    };
  },
  methods: {
    onChange(v) {
      this.$emit('change', v);
      this.menu = false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
