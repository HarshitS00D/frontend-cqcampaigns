import { LOGIN, LOGOUT } from "../actions";

const sessionReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, ...action.payload };
    case LOGOUT:
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return {};
    default:
      return state;
  }
};

export default sessionReducer;
