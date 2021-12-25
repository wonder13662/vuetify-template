import { v4 as uuidv4 } from 'uuid';

export default {
  ALERT__ADD_ALERT(state, { message, type }) {
    const id = uuidv4();
    state.list.push({ id, message, type });
  },
  ALERT__REMOVE_ALERT(state, { id }) {
    state.list = state.list.filter((v) => v.id !== id);
  },
};
