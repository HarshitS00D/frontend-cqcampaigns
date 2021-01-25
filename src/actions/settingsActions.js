import { FETCH_SETTINGS } from ".";
import axios from "../config/axios";

export const getUserSettings = (args = {}) => async (dispatch) => {
  const { onSuccess, onError } = args;
  try {
    const { data: payload } = await axios.get("/api/settings");
    if (onSuccess) onSuccess(payload);
    dispatch({ type: FETCH_SETTINGS, payload });
  } catch (error) {
    console.log({ error });
    if (onError) onError(error);
  }
};

export const changeUserSettings = (args = {}) => async (dispatch) => {
  const { onSuccess, onError, payload } = args;
  try {
    const { data } = await axios.post("/api/settings", payload);
    if (onSuccess) onSuccess(data);
    dispatch({ type: FETCH_SETTINGS, payload });
  } catch (error) {
    console.log({ error });
    if (onError) onError(error);
  }
};
