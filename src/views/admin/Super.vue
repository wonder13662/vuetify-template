<template>
  <div>
    <h1>Super</h1>
    <div>
      슈퍼 유저 권한이 있어야 들어올 수 있는 페이지입니다.
    </div>
    <div>
      <v-btn
        @click="onClick"
      >
        대시보드로 돌아가기
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onClick() {
      this.$router.push('/admin/dashboard');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
