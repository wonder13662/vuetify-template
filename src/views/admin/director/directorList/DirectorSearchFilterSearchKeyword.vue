<template>
  <div>
    <BaseListItemDense>
      <!-- eslint-disable max-len -->
      <BaseListItemLabel
        :label="$t('views.admin.director.directorList.searchFilterSearchKeyword')"
      />
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseRow>
        <BaseCol>
          <BaseTextField
            :label="$t('views.admin.director.directorList.searchFilterSearchKeywordName')"
            :value="name"
            @change="onChangeName"
          />
        </BaseCol>
      </BaseRow>
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseRow>
        <BaseCol>
          <BaseTextField
            :label="$t('views.admin.director.directorList.searchFilterSearchKeywordEmail')"
            :value="email"
            @change="onChangeEmail"
          />
        </BaseCol>
      </BaseRow>
    </BaseListItemDense>
    <BaseListItemDense>
      <BaseRow>
        <BaseCol>
          <BaseTextField
            :label="$t('views.admin.director.directorList.searchFilterSearchKeywordPhoneNumber')"
            :value="phoneNumber"
            @change="onChangePhoneNumber"
          />
        </BaseCol>
      </BaseRow>
    </BaseListItemDense>
  </div>
</template>

<script>
import BaseRow from '@/components/base/BaseRow';
import BaseCol from '@/components/base/BaseCol';
import BaseListItemDense from '@/components/base/BaseListItemDense';
import BaseListItemLabel from '@/components/base/BaseListItemLabel';
import BaseTextField from '@/components/base/BaseTextField';

export default {
  name: 'DirectorSearchFilterSearchKeyword',
  components: {
    BaseRow,
    BaseCol,
    BaseListItemDense,
    BaseListItemLabel,
    BaseTextField,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  methods: {
    onChangeName(v) {
      this.$emit('change:name', v);
    },
    onChangeEmail(v) {
      this.$emit('change:email', v);
    },
    onChangePhoneNumber(v) {
      this.$emit('change:phone-number', v);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
