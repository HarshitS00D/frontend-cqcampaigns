import { FETCH_USERS, LOGOUT, CLEAR_USERS } from "../actions";

const userReducer = (state = { total: 0 }, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return { ...action.payload };
    case LOGOUT:
    case CLEAR_USERS:
      return { total: 0 };

    default:
      return state;
  }
};

export default userReducer;
