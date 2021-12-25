import {
  SERVICEUSER_APPROVE_STATUS,
} from '@/lib/constants';

export default () => ({
  map: {},
  totalCnt: 0,
  query: {
    name: '',
    email: '',
    phoneNumber: '',
    approveStatusList: [
      SERVICEUSER_APPROVE_STATUS.WAIT,
      SERVICEUSER_APPROVE_STATUS.APPROVE,
      SERVICEUSER_APPROVE_STATUS.REJECT,
    ],
  },
  pagination: {
    currentPage: 1,
    limit: 10,
  },
});
