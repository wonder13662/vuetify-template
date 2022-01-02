<template>
  <BaseApp>
    <template v-slot:nav-drawer>
      <BaseContentVerticalLayout
        :has-tail="false"
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
        fixed-col-width="400px"
        :fixed-col-left="true"
      >
        <template v-slot:left>
          <BaseContentVerticalLayout
            :has-tail="true"
          >
            <template v-slot:head>
              Inner Head: 타이틀
            </template>
            <template v-slot:body>
              Inner Body: 검색 키워드 필드 리스트
              <div
                v-for="n in 100"
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
          Right Content
        </template>
      </BaseContentHorizontalLayout>
    </template>
  </BaseApp>
</template>

<script>
import BaseApp from '@/components/base/v2/BaseApp';
import BaseContentVerticalLayout from '@/components/base/v2/BaseContentVerticalLayout';
import BaseContentHorizontalLayout from '@/components/base/v2/BaseContentHorizontalLayout';

export default {
  name: 'Leo',
  components: {
    BaseApp,
    BaseContentVerticalLayout,
    BaseContentHorizontalLayout,
  },
};
</script>

<style lang="scss" scoped>

</style>
