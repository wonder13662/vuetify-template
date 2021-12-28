<template>
  <v-app id="template-wireframe-leo">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-card
        class="d-flex align-start flex-column"
        color="grey lighten-2"
        flat
        tile
        height="100vh"
      >
        <v-card
          tile
          flat
          class="left-navigation"
          color="grey"
        >
          Head
        </v-card>
        <v-card
          tile
          flat
          class="left-navigation flex-grow-1"
          color="grey lighten-1"
        >
          Body
        </v-card>
        <v-card
          tile
          flat
          class="left-navigation"
          color="grey darken-1"
        >
          Tail
        </v-card>
      </v-card>
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
</style>
