<template>
  <v-card
    :elevation="0"
  >
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-list class="pa-0">
        <BaseListItemDense>
          <BaseListItemHeading
            :label="`${$t('views.admin.director.directorList.searchFilterTitle')}`"
          />
        </BaseListItemDense>
        <DirectorSearchFilterApproveStatusCheckBox
          :selected-items="approveStatusList"
          @change="onChangeStatus"
        />
        <DirectorSearchFilterSearchKeyword
          :name="query.name"
          :email="query.email"
          :phone-number="query.phoneNumber"
          @change:name="onChangeName"
          @change:email="onChangeEmail"
          @change:phone-number="onChangePhoneNumber"
        />
        <BaseListItemDense>
          <BaseRow>
            <BaseCol>
              <v-btn
                block
                depressed
                :disabled="!valid"
                color="primary"
                @click="onSubmit"
              >
                {{ $t('views.admin.director.directorList.searchFilterSearchBtn') }}
              </v-btn>
            </BaseCol>
          </BaseRow>
        </BaseListItemDense>
      </v-list>
    </v-form>
  </v-card>
</template>

<script>
import BaseRow from '@/components/base/BaseRow';
import BaseCol from '@/components/base/BaseCol';
import BaseListItemDense from '@/components/base/BaseListItemDense';
import BaseListItemHeading from '@/components/base/BaseListItemHeading';
import DirectorSearchFilterApproveStatusCheckBox from './DirectorSearchFilterApproveStatusCheckBox';
import DirectorSearchFilterSearchKeyword from './DirectorSearchFilterSearchKeyword';

export default {
  name: 'DirectorSearchFilter',
  components: {
    BaseRow,
    BaseCol,
    BaseListItemDense,
    BaseListItemHeading,
    DirectorSearchFilterApproveStatusCheckBox,
    DirectorSearchFilterSearchKeyword,
  },
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: this.query.name,
      email: this.query.email,
      phoneNumber: this.query.phoneNumber,
      approveStatusList: this.query.approveStatusList,
      valid: true,
    };
  },
  watch: {
    query(v) {
      const {
        name,
        email,
        phoneNumber,
        approveStatusList,
      } = v;
      this.name = name;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.approveStatusList = approveStatusList;
    },
  },
  methods: {
    onChangeStatus(v) {
      this.approveStatusList = v;
      this.emit();
    },
    onChangeName(v) {
      this.name = v;
      this.emit();
    },
    onChangeEmail(v) {
      this.email = v;
      this.emit();
    },
    onChangePhoneNumber(v) {
      this.phoneNumber = v;
      this.emit();
    },
    emit() {
      this.$emit('change', {
        approveStatusList: this.approveStatusList,
        name: this.name,
        email: this.email,
        phoneNumber: this.phoneNumber,
      });
    },
    onSubmit() {
      // TODO 입력한 데이터가 유효한 것을 확인한 뒤에 이를 저장할 것인지를 묻는 마지막 단계가 필요할까?
      // 1. 입력한 데이터를 검증한다.(필수값이 입력되었는지 확인)
      const isValid = this.$refs.form.validate();
      if (isValid) {
        // 1-1. 입력한 조건을 부모에게 전달한다.
        this.$emit('submit');
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
