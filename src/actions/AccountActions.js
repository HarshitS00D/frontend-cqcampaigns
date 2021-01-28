import axios from "../config/axios";
import { FETCH_USERS, CLEAR_USERS } from ".";

export const createUser = (args = {}) => async () => {
  const { data, onSuccess, onError } = args;
  try {
    const response = await axios.post("/api/user/", data);
    if (onSuccess) onSuccess(response.data);
  } catch (error) {
    console.log({ error });
    if (onError) onError(error.response.data);
  }
};

export const getUsers = (args = {}) => async (dispatch) => {
  const { filters, pagination, callback } = args;
  try {
    const response = await axios.get("/api/user/", {
      params: { filters, pagination },
    });
    if (callback) callback();
    dispatch({ type: FETCH_USERS, payload: response.data });
  } catch (error) {
    console.log({ error });
  }
};

export const editUser = (args = {}) => async (dispatch) => {
  const { userID, payload, onError, onSuccess } = args;
  try {
    const response = await axios.patch(`/api/user/${userID}`, payload);
    if (onSuccess) onSuccess(response.data);
  } catch (error) {
    console.log({ error });
    if (onError) onError(error.response.data);
  }
};

export const deleteUsers = (args = {}) => async (dispatch) => {
  const { data, onSuccess, onError, filters, pagination } = args;
  try {
    const response = await axios.delete("/api/user/", {
      params: data,
    });
    if (onSuccess) onSuccess(response.data);
    if (filters || pagination) getUsers({ filters, pagination })(dispatch);
  } catch (error) {
    console.log({ error });
    if (onError) onError(error.response.data);
  }
};

export const clearUsers = () => ({ type: CLEAR_USERS });
