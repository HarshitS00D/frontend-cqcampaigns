import { FETCH_SETTINGS, CLEAR_SETTINGS, LOGOUT } from "../actions";

const settingsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SETTINGS:
      return { ...action.payload };
    case LOGOUT:
    case CLEAR_SETTINGS:
      return {};

    default:
      return state;
  }
};

export default settingsReducer;
