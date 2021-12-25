import apolloClient from '@/lib/graphql/apolloClient';
import {
  drivers,
} from '@/services/graphql/schema/query/driver.graphql';
import {
  approveDrivers,
  rejectDrivers,
} from '@/services/graphql/schema/mutation/driver.graphql';

export default {
  async fetchList({
    query = {
      name: '',
      email: '',
      phoneNumber: '',
      approveStatusList: [],
      driverGroupIds: [],
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
      driverGroupIds,
    } = query;
    const querySafe = {};
    if (name) { querySafe.name = name; }
    if (email) { querySafe.email = email; }
    if (phoneNumber) { querySafe.phoneNumber = phoneNumber; }
    if (approveStatusList) { querySafe.approveStatusList = approveStatusList; }
    if (driverGroupIds) { querySafe.driverGroupIds = driverGroupIds; }
    const {
      currentPage,
      limit,
    } = pagination;

    const { data: result, error } = await apolloClient.getInstance().query({
      query: drivers,
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
  async approveDriver(serviceUserId) {
    const { data: result, error } = await apolloClient.getInstance().mutate({
      mutation: approveDrivers,
      variables: {
        driverIds: [serviceUserId],
      },
    });

    if (error) throw error;

    return result;
  },
  async rejectDriver(serviceUserId, memo) {
    const { data: result, error } = await apolloClient.getInstance().mutate({
      mutation: rejectDrivers,
      variables: {
        input: {
          driverIds: [serviceUserId],
          memo,
        },
      },
    });

    if (error) throw error;

    return result;
  },
};
