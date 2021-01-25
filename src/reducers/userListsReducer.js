import { FETCH_USER_LISTS, LOGOUT, CLEAR_USER_LISTS } from "../actions";

const userListsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_USER_LISTS:
      return { ...action.payload };
    case LOGOUT:
    case CLEAR_USER_LISTS:
      return {};

    default:
      return state;
  }
};

export default userListsReducer;
