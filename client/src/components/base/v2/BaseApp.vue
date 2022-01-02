<template>
  <v-app id="template-wireframe-leo">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <slot name="nav-drawer" />
    </v-navigation-drawer>
    <v-app-bar
      dense
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <slot name="content" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'BaseApp',
  data: () => ({ drawer: null }),
};
</script>

<style lang="scss" scoped>

</style>
