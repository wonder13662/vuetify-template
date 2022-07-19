<template>
  <div>
    <div class="pa-1">
      <BaseText
        bold
        :text="title"
      />
    </div>
    <div class="pa-1">
      <BaseTextArea
        :text="textData"
        :max-count="maxCount"
        :readonly="isModeRead"
        @change="onChangeText"
      />
    </div>
    <!-- 읽기모드: "수정"버튼 노출-->
    <BaseContentHorizontalLayout
      v-if="isModeRead"
      col-width-right="100px"
    >
      <template v-slot:left>
        &nbsp;
      </template>
      <template v-slot:right>
        <div class="pa-1">
          <v-btn
            x-small
            outlined
            elevation="0"
            block
            @click.stop="onClickBtnEdit"
          >
            {{ $t('views.admin.common.btnEdit') }}
          </v-btn>
        </div>
      </template>
    </BaseContentHorizontalLayout>
    <!-- 수정모드: "취소"버튼, "저장"버튼 노출-->
    <BaseContentHorizontalLayout
      v-if="isModeEdit"
      col-width-right="200px"
    >
      <template v-slot:left>
        &nbsp;
      </template>
      <template v-slot:right>
        <BaseContentHorizontalLayout
          col-width-right="100px"
        >
          <template v-slot:left>
            <div class="pa-1">
              <v-btn
                x-small
                color="error"
                elevation="0"
                block
                @click.stop="onClickBtnCancel"
              >
                {{ $t('views.admin.common.btnCancel') }}
              </v-btn>
            </div>
          </template>
          <template v-slot:right>
            <div class="pa-1">
              <v-btn
                x-small
                color="primary"
                elevation="0"
                block
                @click.stop="onClickBtnSave"
              >
                {{ $t('views.admin.common.btnSave') }}
              </v-btn>
            </div>
          </template>
        </BaseContentHorizontalLayout>
      </template>
    </BaseContentHorizontalLayout>
    <v-divider />
  </div>
</template>

<script>
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';
import BaseText from '@/components/base/BaseText';
import BaseTextArea from '@/components/base/BaseTextArea';

const MODE_EDIT = 'MODE_EDIT';
const MODE_READ = 'MODE_READ';

export default {
  name: 'BaseRowLabelTextArea',
  components: {
    BaseText,
    BaseTextArea,
    BaseContentHorizontalLayout,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    maxCount: {
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
      mode: MODE_READ,
      textData: this.text,
    };
  },
  computed: {
    isModeEdit() {
      return this.mode === MODE_EDIT;
    },
    isModeRead() {
      return this.mode === MODE_READ;
    },
  },
  watch: {
    text: {
      handler(v) {
        this.textData = v;
      },
      immediate: true,
    },
  },
  methods: {
    onClickBtnEdit() {
      this.mode = MODE_EDIT;
    },
    onClickBtnCancel() {
      this.mode = MODE_READ;
    },
    onClickBtnSave() {
      this.mode = MODE_READ;
      this.$emit('change', this.textData);
    },
    onChangeText(v) {
      this.textData = v;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
