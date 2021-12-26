<template>
  <v-simple-table
    dense
    class="container pa-0 mb-2"
  >
    <template v-slot:default>
      <thead>
        <tr>
          <th
            v-for="(label, index) in labels"
            :key="`${index}`"
            class="text-left"
          >
            {{ label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            v-for="(value, index) in values"
            :key="`${index}`"
          >
            <BaseText :text="`${value}`" />
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import BaseText from '@/components/base/BaseText';

export default {
  components: {
    BaseText,
  },
  props: {
    labels: {
      type: Array,
      required: true,
      validator(value) {
        return value.length > 0 && value.length < 12;
      },
    },
    values: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  border: 1px solid #eee;
}
</style>
