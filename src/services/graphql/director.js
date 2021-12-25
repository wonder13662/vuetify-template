import apolloClient from '@/lib/graphql/apolloClient';
import {
  directors,
} from '@/services/graphql/schema/query/director.graphql';
import {
  approveDirectors,
  rejectDirectors,
} from '@/services/graphql/schema/mutation/director.graphql';

export default {
  async fetchList({
    query = {
      name: '',
      email: '',
      phoneNumber: '',
      approveStatusList: [],
    },
    pagination = {
      currentPage: 1,
      limit: 10,
    },
  }) {
    const {
      name,
      email,
      phoneNumber,
      approveStatusList,
    } = query;
    const querySafe = {};
    if (name) { querySafe.name = name; }
    if (email) { querySafe.email = email; }
    if (phoneNumber) { querySafe.phoneNumber = phoneNumber; }
    if (approveStatusList) { querySafe.approveStatusList = approveStatusList; }
    const {
      currentPage,
      limit,
    } = pagination;

    const { data: result, error } = await apolloClient.getInstance().query({
      query: directors,
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
  async approveDirector(serviceUserId) {
    const { data: result, error } = await apolloClient.getInstance().mutate({
      mutation: approveDirectors,
      variables: {
        directorIds: [serviceUserId],
      },
    });

    if (error) throw error;

    return result;
  },
  async rejectDirector(serviceUserId, memo) {
    const { data: result, error } = await apolloClient.getInstance().mutate({
      mutation: rejectDirectors,
      variables: {
        input: {
          directorIds: [serviceUserId],
          memo,
        },
      },
    });

    if (error) throw error;

    return result;
  },
};
