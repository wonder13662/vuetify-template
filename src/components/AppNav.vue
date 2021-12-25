<template>
  <v-card
    class="mx-auto"
    max-width="500"
    outlined
  >
    <v-card-text>
      <v-treeview
        hoverable
        dense
        activatable
        return-object
        :active="activeItems"
        :open="openItems"
        :items="items"
        @update:active="onChange"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        depressed
        @click="logout"
      >
        로그아웃
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import auth from '@/lib/auth';
import store from '@/store';
import i18n from '@/plugins/vueI18n';

export default {
  data: () => ({
    items: [
      {
        id: 10,
        name: i18n.t('models.router.links.dashboard'),
        url: '/admin/dashboard',
      },
      {
        id: 20,
        name: i18n.t('models.router.links.notice'),
        url: '/admin/notice',
      },
      {
        id: 30,
        name: i18n.t('models.router.links.physicalGroup'),
        children: [
          {
            id: 31,
            name: i18n.t('models.router.links.physicalGroupList'),
            url: '/admin/physical-group/list',
          },
          {
            id: 32,
            name: i18n.t('models.router.links.physicalGroupOutOfBound'),
            url: '/admin/physical-group/out-of-bound',
          },
          {
            id: 33,
            name: i18n.t('models.router.links.physicalGroupExtraCharge'),
            url: '/admin/physical-group/extra-charge',
          },
        ],
      },
      {
        id: 40,
        name: i18n.t('models.router.links.director'),
        children: [
          {
            id: 41,
            name: i18n.t('models.router.links.directorApprove'),
            url: '/admin/director/approve',
          },
          {
            id: 42,
            name: i18n.t('models.router.links.directorList'),
            url: '/admin/director/director-list',
          },
          {
            id: 43,
            name: i18n.t('models.router.links.directorGroupList'),
            url: '/admin/director/director-group-list',
          },
        ],
      },
      {
        id: 50,
        name: i18n.t('models.router.links.driver'),
        children: [
          {
            id: 51,
            name: i18n.t('models.router.links.driverApprove'),
            url: '/admin/driver/driver-approve',
          },
          {
            id: 52,
            name: i18n.t('models.router.links.blackDriverApprove'),
            url: '/admin/driver/black-driver-approve',
          },
          {
            id: 53,
            name: i18n.t('models.router.links.driverList'),
            url: '/admin/driver/driver-list',
          },
          {
            id: 54,
            name: i18n.t('models.router.links.driverGroupList'),
            url: '/admin/driver/driver-group-list',
          },
        ],
      },
      {
        id: 60,
        name: i18n.t('models.router.links.csTicket'),
        url: '/admin/cs-ticket',
      },
      {
        id: 70,
        name: i18n.t('models.router.links.feeAdjust'),
        url: '/admin/fee-adjust',
      },
      {
        id: 80,
        name: i18n.t('models.router.links.stats'),
        url: '/admin/stats',
      },
      {
        id: 900,
        name: '맵',
        children: [
          {
            id: 901,
            name: '기본맵',
            url: '/admin/map/default',
          },
          {
            id: 902,
            name: '마커맵',
            url: '/admin/map/marker-map',
          },
          {
            id: 903,
            name: '폴리곤맵',
            url: '/admin/map/h3-map',
          },
        ],
      },
    ],
    activeItems: [],
    openItems: [],
  }),
  created() {
    const { path } = this.$router.currentRoute;
    this.updateActiveItems(path);
  },
  methods: {
    updateActiveItems(path) {
      const openItems = [];
      const activeItems = [];
      this.items.forEach((parent) => {
        if (path === parent.url) {
          activeItems.push({
            ...parent,
          });
        }
        if (parent.children) {
          parent.children.forEach((child) => {
            if (path === child.url) {
              openItems.push({
                ...parent,
              });
              activeItems.push({
                ...child,
              });
            }
          });
        }
      });
      this.openItems = openItems;
      this.activeItems = activeItems;
    },
    onChange(activeItems) {
      if (!activeItems || activeItems.length === 0) return;

      const { url } = activeItems[0];
      if (!url) return;

      this.$router.push(url);
      this.updateActiveItems(url);
    },
    async logout() {
      try {
        auth.postProcessSignOut();
        await store.dispatch('auth/signOut');
        this.$router.push('/auth/sign-in');
      } catch (error) {
        store.dispatch('error/addError', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
