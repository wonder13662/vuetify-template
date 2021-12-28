<template>
  <v-app id="template-wireframe-leo">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <div
        class="grey lighten-2 d-flex align-start flex-column left-navigation-box"
      >
        <div
          class="grey left-navigation-child"
        >
          Head
        </div>
        <div
          class="grey lighten-1 left-navigation-child flex-grow-1"
        >
          Body
        </div>
        <div
          class="grey darken-1 left-navigation-child"
        >
          Tail
        </div>
      </div>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <!-- Content is here! -->
    </v-main>
  </v-app>
</template>

<script>
/*
Admin을 기준으로 wireframe을 작성해보자.
+ Base.vue
*/
export default {
  data: () => ({ drawer: null }),
};
</script>

<style lang="scss" scoped>
.left-navigation {
  width: 100%;
}
.left-navigation-box {
  height: 100vh;
}
.left-navigation-child {
  width: 100%;
}
</style>
