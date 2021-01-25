import axios from "../config/axios";
import _ from "lodash";

import { FETCH_CAMPAIGNS, CLEAR_CAMPAIGNS } from ".";

export const createCampaign = (args = {}) => async () => {
  const { data, onSuccess, onError } = args;
  try {
    const response = await axios.post("/api/campaign/", data);
    if (onSuccess) onSuccess(response.data);
  } catch (error) {
    console.log({ error });
    if (onError) onError(error.response.data);
  }
};

export const deleteCampaigns = (args = {}) => async (dispatch) => {
  const { campaignIDs, pagination, filters, onSuccess, onError } = args;
  try {
    const { data } = await axios.delete("/api/campaign", {
      params: { campaignIDs },
    });

    if (onSuccess) onSuccess(data);
    fetchCampaigns({ filters, pagination })(dispatch);
  } catch (error) {
    console.log({ error });
    if (onError) onError(error);
  }
};

export const fetchCampaigns = (args = {}) => async (dispatch) => {
  const { callback } = args;
  try {
    const { data } = await axios.get(`/api/campaign/`, {
      params: _.omit(args, "callback"),
    });

    if (callback) callback();
    dispatch({ type: FETCH_CAMPAIGNS, payload: data });
  } catch (error) {
    console.log({ error });
  }
};

export const sendEmails = (args = {}) => async (dispatch) => {
  const { body, onSuccess, onError } = args;
  try {
    const { data } = await axios.post(`/api/campaign/sendmail`, body);

    if (onSuccess) onSuccess(data);
  } catch (error) {
    if (onError) onError(error);
  }
};

export const clearCampaigns = () => ({ type: CLEAR_CAMPAIGNS });
