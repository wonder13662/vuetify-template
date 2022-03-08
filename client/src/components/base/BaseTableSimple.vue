<template>
  <v-simple-table
    dense
    dark
    class="base-simple-table"
  >
    <template v-slot:default>
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
            class="text-left"
          >
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.value"
        >
          <td
            v-for="header in headers"
            :key="header.value"
          >
            <div v-if="header.value">
              {{ item[header.value] }}
            </div>
            <div v-if="header.key">
              {{ item[header.key] }}
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'BaseTableSimple',
  props: {
    headers: {
      type: Array,
      required: true,
      validator(v) {
        // FIX ME: value는 하위 호환성을 위해서 유지, 되도록 key를 사용하도록 합니다.
        const found = v.findIndex(({ text, key, value }) => !text || (!value && !key));
        return !(found > -1);
      },
    },
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.base-simple-table {
  width: 100%;
}
</style>
