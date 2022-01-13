<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    max-width="600px"
    @input="onChange"
    @click:outside="onCancel"
  >
    <template
      v-if="!activatorHidden"
      v-slot:activator="{ on, attrs }"
    >
      <v-btn
        v-if="isIconBtn"
        x-small
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>{{ iconName }}</v-icon>
      </v-btn>
      <v-btn
        v-else
        x-small
        :block="activatorBlock"
        text
        v-bind="attrs"
        v-on="on"
      >
        {{ activatorBtnName }}
      </v-btn>
    </template>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-list
        class="pa-0"
      >
        <slot /><!-- 여기에 Dialog에 필요한 내용이 부모컴포넌트에서 주입됩니다. -->
        <v-divider />
        <BaseListItemDense>
          <v-spacer />
          <v-btn
            x-small
            depressed
            color="error"
            class="mr-1"
            @click="onCancel"
          >
            {{ cancelBtnName }}
          </v-btn>
          <v-btn
            x-small
            depressed
            color="primary"
            @click="onSubmit"
          >
            {{ submitBtnName }}
          </v-btn>
        </BaseListItemDense>
      </v-list>
    </v-form>
  </v-dialog>
</template>

<script>
import BaseListItemDense from '@/components/base/v1/BaseListItemDense';

export default {
  components: {
    BaseListItemDense,
  },
  props: {
    activatorHidden: {
      type: Boolean,
      default: true,
    },
    activatorBtnName: {
      type: String,
      default: 'Open dialog',
    },
    activatorBlock: {
      type: Boolean,
      default: false,
    },
    iconName: {
      type: String,
      default: '',
    },
    isIconBtn: {
      type: Boolean,
      default: false,
    },
    cancelBtnName: {
      type: String,
      default: '취소하기',
    },
    submitBtnName: {
      type: String,
      default: '저장하기',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: this.isShow,
      valid: false,
    };
  },
  watch: {
    isShow(v) {
      this.dialog = v;
    },
  },
  methods: {
    onCancel() {
      // 1. 부모 컴포넌트에 모달이 닫히는 이벤트를 전달한다.
      this.$emit('on-close-dialog');
      // 2. 부모 컴포넌트에 취소 버튼이 클릭된 이벤트를 전달한다.
      this.$emit('cancel');
      // 3. Dialog를 닫는다.
      this.dialog = false;
      // 4. 진행되었던 validation을 리셋한다.
      this.$refs.form.resetValidation();
      // 5. 입력했던 모든 내용을 삭제한다.
      this.$refs.form.reset();
    },
    onSubmit() {
      // TODO 입력한 데이터가 유효한 것을 확인한 뒤에 이를 저장할 것인지를 묻는 마지막 단계가 필요할까?
      // 1. 입력한 데이터를 검증한다.(필수값이 입력되었는지 확인)
      const isValid = this.$refs.form.validate();
      if (isValid) {
        // 2-1-2. 부모 컴포넌트에 모달이 닫히는 이벤트를 전달한다.
        this.$emit('on-close-dialog');
        // 2-1-1. 부모 컴포넌트에 입력 내용을 전달한다.
        this.$emit('submit');
        // 2-1-3. Dialog를 닫는다.
        this.dialog = false;
        // 2-1-5. 진행되었던 validation을 리셋한다.
        this.$refs.form.resetValidation();
        // 2-1-4. 입력했던 모든 내용을 삭제한다.
        this.$refs.form.reset();
      }

      // 2-2. 엽력한 데이터가 유효하지 않으면, 자동적으로 form에서 경고 메시지를 사용자에게 보여준다.
      // 사용자는 이에 따라 데이터를 맞게 수정한다.
    },
    onChange(v) {
      if (!v) {
        // 4. 진행되었던 validation을 리셋한다.
        this.$refs.form.resetValidation();
        // 부모 컴포넌트에 모달이 닫히는 이벤트를 전달한다.
        this.$emit('on-close-dialog');
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
