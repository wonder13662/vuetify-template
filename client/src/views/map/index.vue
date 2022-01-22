<template>
  <v-app id="inspire">
    <v-main>
      <BaseContentHorizontalLayout
        col-width-right="600px"
        divider
      >
        <template v-slot:left>
          <div>
            <BaseNaverMap
              :map-id="'map-sample'"
            />
          </div>
        </template>
        <template v-slot:right>
          <div>
            여기에 H3 컨트롤 패널이 들어갑니다
          </div>
        </template>
      </BaseContentHorizontalLayout>
    </v-main>
  </v-app>
</template>

<script>
import BaseNaverMap from '@/components/base/v1/BaseNaverMapV2';
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';
/*
H3 Api의 기능을 네이버 맵 위에 표시합니다.
*/
export default {
  name: 'Map',
  components: {
    BaseNaverMap,
    BaseContentHorizontalLayout,
  },
};
</script>

<style lang="scss" scoped>

</style>
