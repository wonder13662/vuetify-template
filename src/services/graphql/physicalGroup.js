import apolloClient from '@/lib/graphql/apolloClient';
import {
  physicalGroups,
  physicalGroupsInDirectorGroupList,
} from '@/services/graphql/schema/query/physicalGroup.graphql';
import {
  PHYSICALGROUP_TYPE,
} from '@/lib/constants';

export default {
  async fetchPhysicalGroups({
    name,
    pagination = {
      currentPage: 1,
      limit: 10,
    },
  }) {
    // TODO 무한 리스트와 페이지네이션을 함께 쓰려면?
    // 1. 무한 리스트를 하단으로 스크롤 하는 경우만 페이지네이션을 적용
    // 1-1. 검색이 되는가?
    // 1-2. 지도를 이동했을 때, 클릭한 지역그룹(PhysicalGroup)을 이동하려면? 클릭한 시점에 해당 지역 그룹의 데이터가 없을텐데?
    // 2. DirectorGroup에서 관리하는 모든 지역 그룹 데이터를 가져돈다. 페이지네이션 안씀
    // 2-1. 추가해주세요

    const {
      currentPage,
      limit,
    } = pagination;

    const { data: result, error } = await apolloClient.getInstance().query({
      query: physicalGroups,
      variables: {
        query: {
          name,
          type: PHYSICALGROUP_TYPE.BASE,
        },
        pagination: {
          currentPage,
          limit,
        },
      },
    });

    if (error) {
      throw error;
    }

    return result;
  },
  async fetchPhysicalGroupsInDirectorGroupList({
    name,
    pagination = {
      currentPage: 1,
      limit: 10,
    },
  }) {
    const {
      currentPage,
      limit,
    } = pagination;

    const { data: result, error } = await apolloClient.getInstance().query({
      query: physicalGroupsInDirectorGroupList,
      variables: {
        query: {
          name,
          type: PHYSICALGROUP_TYPE.BASE,
        },
        pagination: {
          currentPage,
          limit,
        },
      },
    });

    if (error) {
      throw error;
    }

    return result;
  },
};
