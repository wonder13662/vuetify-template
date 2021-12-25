import apolloClient from '@/lib/graphql/apolloClient';
import {
  directorGroups,
} from '@/services/graphql/schema/query/directorGroup.graphql';
import {
  createDirectorGroup,
  updateDirectorGroup,
} from '@/services/graphql/schema/mutation/directorGroup.graphql';


export default {
  async fetchList({
    query = {
      name: '',
    },
    pagination = {
      currentPage: 1,
      limit: 10,
    },
  }) {
    const {
      name,
    } = query;
    const querySafe = {};
    if (name) { querySafe.name = name; }
    const {
      currentPage,
      limit,
    } = pagination;

    const { data: result, error } = await apolloClient.getInstance().query({
      query: directorGroups,
      variables: {
        query: querySafe,
        pagination: {
          currentPage,
          limit,
        },
      },
    });

    if (error) throw error;

    return result;
  },
  async createDirectorGroup({ name, directorIds, basePhysicalGroupIds }) {
    const { data: result, error } = await apolloClient.getInstance().mutate({
      mutation: createDirectorGroup,
      variables: {
        input: {
          name,
          directorIds,
          basePhysicalGroupIds,
        },
      },
    });

    if (error) throw error;

    return result;
  },
  async updateDirectorGroup({ name, directorIds, basePhysicalGroupIds }, id) {
    const { data: result, error } = await apolloClient.getInstance().mutate({
      mutation: updateDirectorGroup,
      variables: {
        input: {
          name,
          directorIds,
          basePhysicalGroupIds,
        },
        id,
      },
    });

    if (error) throw error;

    return result;
  },
};
