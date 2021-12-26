<template>
  <div>
    <div
      v-for="(alert) in alerts"
      :key="`${alert.id}`"
      class="pa-1"
    >
      <BaseAlert
        :alert="alert"
        :is-show="true"
        :auto-dismiss="true"
        @dismiss="onDismiss"
      />
    </div>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <BaseContainer :fill-height="false">
        <router-view />
      </BaseContainer>
    </v-main>
  </div>
</template>

<script>
import store from '@/store';
import BaseContainer from '@/components/base/BaseContainer';
import BaseAlert from '@/components/base/BaseAlert';

export default {
  name: 'AdminLayoutView',
  components: {
    BaseContainer,
    BaseAlert,
  },
  computed: {
    alerts() {
      return store.getters['alert/list'];
    },
  },
  methods: {
    async onDismiss(alert) {
      store.dispatch('alert/removeAlert', { id: alert.id });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
