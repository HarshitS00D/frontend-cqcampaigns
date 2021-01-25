import { FETCH_ANALYTICS, CLEAR_ANALYTICS, LOGOUT } from "../actions/index";

const analyticsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_ANALYTICS:
      return [...action.payload];
    case LOGOUT:
    case CLEAR_ANALYTICS:
      return [];

    default:
      return state;
  }
};

export default analyticsReducer;
