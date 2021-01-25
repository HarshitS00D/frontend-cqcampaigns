import axios from "../config/axios";
import _ from "lodash";

import { FETCH_TEMPLATES, CLEAR_TEMPLATES } from "./index";

export const fetchTemplates = (args = {}) => async (dispatch) => {
  const { callback } = args;
  try {
    const { data } = await axios.get(`/api/template/`, {
      params: _.omit(args, "callback"),
    });

    if (callback) callback();
    dispatch({ type: FETCH_TEMPLATES, payload: data });
  } catch (error) {
    console.log({ error });
  }
};

export const createTemplate = (args = {}) => async () => {
  const { data, onSuccess, onError } = args;
  try {
    const response = await axios.post("/api/template/", data);
    if (onSuccess) onSuccess(response.data);
  } catch (error) {
    console.log({ error });
    if (onError) onError(error.response.data);
  }
};

export const editTemplate = (args = {}) => async () => {
  const { templateID, data, onSuccess, onError } = args;
  try {
    const response = await axios.patch(`/api/template/${templateID}`, data);
    if (onSuccess) onSuccess(response.data);
  } catch (error) {
    console.log({ error });
    if (onError) onError(error.response.data);
  }
};

export const deleteTemplates = (args = {}) => async (dispatch) => {
  const { templateIDs, pagination, filters, onSuccess, onError } = args;
  try {
    const { data } = await axios.delete("/api/template", {
      params: { templateIDs },
    });

    if (onSuccess) onSuccess(data);
    fetchTemplates({ filters, pagination })(dispatch);
  } catch (error) {
    console.log({ error });
    if (onError) onError(error);
  }
};

export const clearTemplates = () => ({ type: CLEAR_TEMPLATES });
