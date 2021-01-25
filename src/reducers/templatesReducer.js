import { FETCH_TEMPLATES, LOGOUT, CLEAR_TEMPLATES } from "../actions/index";

const templatesReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_TEMPLATES:
      return { ...action.payload };
    case LOGOUT:
    case CLEAR_TEMPLATES:
      return {};

    default:
      return state;
  }
};

export default templatesReducer;
