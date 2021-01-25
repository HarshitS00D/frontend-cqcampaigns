import axios from "../config/axios";
import { FETCH_SUBSCRIBERS, CLEAR_SUBSCRIBERS } from ".";

export const fetchSubscribers = (args = {}) => async (dispatch) => {
  const { pagination, filters, listID, callback } = args;
  //listID required
  try {
    const { data } = await axios.get(`/api/list/${listID}`, {
      params: { filters, pagination },
    });
    if (callback) callback();

    dispatch({ type: FETCH_SUBSCRIBERS, payload: data });
  } catch (error) {
    console.log({ error });
  }
};

export const clearSubscribers = () => ({
  type: CLEAR_SUBSCRIBERS,
});

export const deleteSubscribers = (args = {}) => async (dispatch) => {
  const { listID, subIDs, onSuccess, onError, pagination, filters } = args;
  //subIDs, listID required
  try {
    const { data } = await axios.delete("/api/subscriber", {
      params: {
        listID,
        subIDs,
      },
    });

    //if (onSuccess) onSuccess(data);
    fetchSubscribers({
      pagination,
      filters,
      listID,
      callback: () => onSuccess(data),
    })(dispatch);
  } catch (error) {
    if (onError) onError(error);
  }
};

export const fetchSubscribersCSV = async (args = {}) => {
  const { listID, subIDs = [], onSuccess, onError } = args;
  // listID required
  try {
    if (!listID) throw new Error("No listID provided");
    const params = {};
    if (subIDs.length)
      params.filters = {
        _id: { $in: subIDs },
      };
    params.select = {
      _id: 0,
      feedback: 0,
      createdAt: 0,
      updatedAt: 0,
      subscribed: 0,
    };
    const { data } = await axios.get(`/api/list/${listID}/download`, {
      params,
    });

    if (onSuccess) onSuccess(data);
  } catch (error) {
    if (onError) onError(error);
  }
};
