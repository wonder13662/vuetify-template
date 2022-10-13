<template>
  <div>
    <BaseTextField
      id="test-base-text-field"
      :label="label"
      :value="value"
      :rules="rules"
      @input="onInput"
      @change="onChange"
    />
  </div>
</template>

<script>
import BaseTextField from '@/components/base/BaseTextField';
import {
  RULE_KEY,
} from '@/lib/constants';
import ruleMap from '@/lib/ruleMap';

export default {
  components: {
    BaseTextField,
  },
  data() {
    return {
      label: '이름',
      // hideDetails: true, // REMOVE ME 사용하는 곳 없음. 확인 뒤 삭제 필요
      value: '손흥민',
      rules: ruleMap.getRule(RULE_KEY.PERSON_NAME),
      // typeNumber // TODO 숫자만 입력받아야 함(별도 테스트 sandbox)
      // typeEmail // TODO 이메일 주소만 입력받아야 함(별도 테스트 sandbox)
      // readonly // TODO 입력이 불가능해야 함(별도 테스트 sandbox)
      // disabled // TODO 입력이 불가능해야 함(별도 테스트 sandbox)
    };
  },
  methods: {
    onInput(v) {
      this.value = v;
    },
    onChange(v) {
      this.value = v;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
