<!-- https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/wireframes/base.vue -->
<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    />
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
export default {
  data: () => ({ drawer: null }),
};
</script>
