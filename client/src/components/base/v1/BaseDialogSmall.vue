<template>
  <v-dialog
    :value="isShow"
    max-width="290"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ content }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          elevation="0"
          @click="no"
        >
          {{ btnNameNo }}
        </v-btn>

        <v-btn
          color="primary"
          elevation="0"
          @click="yes"
        >
          {{ btnNameYes }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'BaseDialogSmall',
  props: {
    isShow: {
      type: Boolean,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    btnNameNo: {
      type: String,
      default: '아니오',
    },
    btnNameYes: {
      type: String,
      default: '예',
    },
  },
  methods: {
    no() {
      this.$emit('no');
    },
    yes() {
      this.$emit('yes');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
