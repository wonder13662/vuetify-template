<template>
  <div>
    <Layout />
  </div>
</template>

<script>
import store from '@/store';
import Layout from './layout';

export default {
  components: {
    Layout,
  },
  async created() {
    await store.dispatch('physicalGroup/fetchList', { name: '' });
  },
};
</script>

<style lang="scss" scoped>

</style>
