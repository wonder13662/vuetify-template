<template>
  <v-alert
    class="base-alert"
    :type="alert.type"
    :value="value"
    dense
  >
    {{ alert.message }}
  </v-alert>
</template>

<script>
import { ALERT_TYPE_LIST } from '@/lib/constants';
import utils from '@/lib/utils';
// TODO 5초 뒤에 스스로 사라져야 함
export default {
  name: 'BaseAlert',
  props: {
    alert: {
      type: Object,
      required: true,
      validator: (alert) => {
        if (ALERT_TYPE_LIST.indexOf(alert.type) === -1) {
          return false;
        }
        if (!alert.message) {
          return false;
        }
        if (!utils.isUUIDType(alert.id)) {
          return false;
        }
        return true;
      },
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    autoDismiss: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: this.isShow,
    };
  },
  created() {
    if (this.autoDismiss) {
      // 3초 뒤에 자동으로 사라집니다.
      setTimeout(() => {
        this.$emit('dismiss', this.alert);
        this.value = false;
      }, 3000);
    }
  },
};
</script>

<style lang="scss" scoped>
.base-alert {
  z-index: 150;
}
</style>
