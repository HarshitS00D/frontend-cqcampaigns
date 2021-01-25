import { FETCH_CAMPAIGNS, LOGOUT, CLEAR_CAMPAIGNS } from "../actions/index";

const campaignsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGNS:
      return { ...action.payload };
    case LOGOUT:
    case CLEAR_CAMPAIGNS:
      return {};

    default:
      return state;
  }
};

export default campaignsReducer;
