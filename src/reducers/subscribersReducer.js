import { FETCH_SUBSCRIBERS, CLEAR_SUBSCRIBERS, LOGOUT } from "../actions";

const subscribersListReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SUBSCRIBERS:
      return { ...action.payload };
    case LOGOUT:
    case CLEAR_SUBSCRIBERS:
      return {};

    default:
      return state;
  }
};

export default subscribersListReducer;
