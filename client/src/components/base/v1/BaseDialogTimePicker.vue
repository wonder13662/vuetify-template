<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="time"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        label="Picker in dialog"
        prepend-inner-icon="mdi-clock-time-four-outline"
        outlined
        dense
        hide-details
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-time-picker
      v-if="modal"
      v-model="time"
      full-width
    >
      <v-spacer />
      <v-btn
        text
        color="primary"
        @click="modal = false"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="$refs.dialog.save(time)"
      >
        OK
      </v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script>
export default {
  name: 'BaseDialogTimePicker',
  data() {
    return {
      time: null,
      modal: false,
    };
  },
  methods: {
    onCancel() {
      this.reset();
    },
    onOK() {
      this.$refs.dialog.save(this.time);
      this.$emit('change', { time: this.time });
      this.reset();
    },
    reset() {
      this.modal = false;
      this.time = null;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
