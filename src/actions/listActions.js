import axios from "../config/axios";
import _ from "lodash";
import { FETCH_USER_LISTS, CLEAR_USER_LISTS } from ".";
import { fetchSubscribers } from "./subscriberActions";

export const fetchUserLists = (args = {}) => async (dispatch) => {
  try {
    const { callback } = args;
    const { data } = await axios.get("/api/list/", {
      params: _.omit(args, "callback"),
    });
    if (callback) callback();
    dispatch({ type: FETCH_USER_LISTS, payload: data });
  } catch (error) {
    console.log({ error });
  }
};

export const deleteUserLists = (args = {}) => async (dispatch) => {
  const { listIDs, select, pagination, filters, onSuccess, onError } = args;
  try {
    const { data } = await axios.delete("/api/list", {
      params: { listIDs },
    });
    if (onSuccess) onSuccess(data);
    fetchUserLists({ select, filters, pagination })(dispatch);
  } catch (error) {
    if (onError) onError(error);
  }
};

export const editUserList = (args = {}) => async (dispatch) => {
  const { update, select, pagination, filters, onSuccess, onError } = args;
  try {
    const { data } = await axios.patch("/api/list", update);
    if (onSuccess) onSuccess(data);
    //if (select && filters && pagination)
    if (update.update.$push) {
      fetchSubscribers({ listID: update._id, filters, pagination })(dispatch);
    } else fetchUserLists({ select, filters, pagination })(dispatch);
  } catch (error) {
    console.log({ error });
    if (onError) onError(error);
  }
};

export const createUserList = async (args = {}) => {
  const { listName, tableData: data, onSuccess, onError } = args;
  //listName, tableData required
  try {
    const response = await axios.post("/api/list/", {
      listName,
      data,
    });
    if (onSuccess) onSuccess(response.data);
  } catch (error) {
    if (onError) onError(error);
    console.log({ error });
  }
};

export const clearUserLists = () => ({ type: CLEAR_USER_LISTS });
