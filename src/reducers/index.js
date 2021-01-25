import { combineReducers } from "redux";
import sessionReducer from "./sessionReducer";
import userListsReducer from "./userListsReducer";
import subscribersReducer from "./subscribersReducer";
import templatesReducer from "./templatesReducer";
import campaignsReducer from "./campaignsReducer";
import settingsReducer from "./settingsReducer";
import analyticsReducer from "./analyticsReducer";
import usersReducer from "./usersReducer";

export default combineReducers({
  session: sessionReducer,
  userLists: userListsReducer,
  subscribers: subscribersReducer,
  templates: templatesReducer,
  campaigns: campaignsReducer,
  analytics: analyticsReducer,
  settings: settingsReducer,
  users: usersReducer,
});
