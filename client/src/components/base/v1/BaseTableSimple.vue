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
            {{ item[header.value] }}
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
        const found = v.findIndex((item) => !item.text || !item.value);
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
