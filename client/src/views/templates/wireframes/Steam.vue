<!-- https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/wireframes/steam.vue -->
<template>
  <v-app id="inspire">
    <v-system-bar app>
      <v-spacer />

      <v-icon>mdi-square</v-icon>

      <v-icon>mdi-circle</v-icon>

      <v-icon>mdi-triangle</v-icon>
    </v-system-bar>

    <v-app-bar
      app
      clipped-left
      flat
    >
      <v-avatar
        v-for="n in 2"
        :key="`avatar--${n}`"
        class="mr-3"
        color="grey lighten-1"
        size="36"
      />

      <div class="mx-2" />

      <v-btn
        v-for="n in 4"
        :key="n"
        class="mr-3"
        color="grey lighten-1"
        depressed
        min-width="96"
        rounded
        small
      />

      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      class="pa-2"
      clipped
      width="300"
    >
      <div class="d-flex align-center pa-1">
        <v-btn
          rounded
          depressed
          color="grey lighten-3"
          class="grow"
        />

        <v-btn
          min-width="0"
          depressed
          class="ml-3"
          color="grey lighten-3"
        />
      </div>

      <div class="d-flex align-center pa-1">
        <v-btn
          rounded
          depressed
          color="grey lighten-3"
          class="grow"
        />

        <v-btn
          v-for="n in 2"
          :key="`btn--${n}`"
          class="ml-3"
          color="grey lighten-1"
          fab
          x-small
          depressed
        />
      </div>

      <div class="pa-1 mb-4">
        <v-text-field
          dense
          flat
          hide-details
          rounded
          solo-inverted
        />
      </div>
    </v-navigation-drawer>

    <v-main>
      <!--  -->
    </v-main>

    <v-footer
      app
      color="transparent"
      height="72"
      inset
    >
      <v-text-field
        background-color="grey lighten-1"
        dense
        flat
        hide-details
        rounded
        solo
      />
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    links: [
      'Store',
      'Library',
      'Community',
      'Profile',
    ],
  }),
};
</script>
