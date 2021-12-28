<template>
  <div>
    <router-view />
    <div v-if="isShow">
      <router-link to="/template/wireframe/base">
        Base
      </router-link>
      <br>
      <router-link to="/template/wireframe/constrained">
        Constrained
      </router-link>
      <br>
      <router-link to="/template/wireframe/data-dog">
        DataDog
      </router-link>
      <br>
      <router-link to="/template/wireframe/discord">
        Discord
      </router-link>
      <br>
      <router-link to="/template/wireframe/extended-toolbar">
        Extended Toolbar
      </router-link>
      <br>
      <router-link to="/template/wireframe/inbox">
        Inbox
      </router-link>
      <br>
      <router-link to="/template/wireframe/side-navigation">
        Side Navigation
      </router-link>
      <br>
      <router-link to="/template/wireframe/steam">
        Steam
      </router-link>
      <br>
      <router-link to="/template/wireframe/system-bar">
        System Bar
      </router-link>
      <br>
      <router-link to="/template/wireframe/three-column">
        Three Column
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wireframes',
  computed: {
    isShow() {
      return this.$route.path === '/template/wireframe';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
