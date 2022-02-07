<template>
  <BaseApp>
    <template v-slot:nav-drawer>
      <BaseContentVerticalLayout
        body-height="calc(100vh - 100px)"
      >
        <template v-slot:head>
          Head
        </template>
        <template v-slot:body>
          Body
        </template>
        <template v-slot:tail>
          Tail
        </template>
      </BaseContentVerticalLayout>
    </template>
    <template v-slot:content>
      <BaseContentHorizontalLayout
        col-width-right="400px"
      >
        <template v-slot:left>
          <BaseContentVerticalLayout
            body-height="calc(100vh - 96px)"
          >
            <template v-slot:head>
              Inner Head: 타이틀
            </template>
            <template v-slot:body>
              Inner Body: 검색 키워드 필드 리스트
              <div
                v-for="n in items"
                :key="n"
              >
                {{ `${n}` }}
              </div>
            </template>
            <template v-slot:tail>
              Inner Tail: 검색 버튼
            </template>
          </BaseContentVerticalLayout>
        </template>
        <template v-slot:right>
          <BaseContentVerticalLayout
            body-height="calc(100vh - 72px)"
          >
            <template v-slot:head>
              Inner Head: 타이틀
            </template>
            <template v-slot:body>
              Inner Body: 검색 키워드 필드 리스트
              <div
                v-for="n in items"
                :key="n"
              >
                {{ `${n}` }}
              </div>
            </template>
            <template v-slot:tail>
              Inner Tail: 검색 버튼
            </template>
          </BaseContentVerticalLayout>
        </template>
      </BaseContentHorizontalLayout>
    </template>
  </BaseApp>
</template>

<script>
import BaseApp from '@/components/base/BaseApp';
import BaseContentVerticalLayout from '@/components/base/BaseContentVerticalLayout';
import BaseContentHorizontalLayout from '@/components/base/BaseContentHorizontalLayout';

export default {
  name: 'Leo',
  components: {
    BaseApp,
    BaseContentVerticalLayout,
    BaseContentHorizontalLayout,
  },
  data() {
    return {
      items: [],
    };
  },
  created() {
    setTimeout(() => {
      this.items = Array.from(Array(200).keys());
    }, 500);
  },
};
</script>

<style lang="scss" scoped>

</style>
