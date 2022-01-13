<template>
  <v-textarea
    background-color="grey lighten-5"
    counter="100"
    clearable
    dense
    no-resize
    outlined
    :value="text"
    :rules="rules"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'BaseTextArea',
  props: {
    text: {
      type: String,
      default: '',
    },
    maxCount: {
      type: Number,
      required: true,
      validator(value) {
        return value > 0;
      },
    },
  },
  data() {
    return {
      rules: [
        (value) => (value && value.length > 0) || '내용을 입력해야 합니다.',
        (value) => (value && value.length <= this.maxCount) || `입력된 내용이 ${this.maxCount}자 이하여야 합니다.`,
      ],
    };
  },
  methods: {
    onChange(value) {
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
