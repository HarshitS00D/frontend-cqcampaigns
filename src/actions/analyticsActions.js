import axios from "../config/axios";
import { FETCH_ANALYTICS } from ".";

export const getUserAnalytics = (groupBy) => async (dispatch) => {
  try {
    const response = await axios.get(
      `/api/analytics${groupBy && groupBy.length ? `?groupBy=${groupBy}` : ""}`
    );

    dispatch({ type: FETCH_ANALYTICS, payload: response.data });
  } catch (error) {
    console.log({ error });
  }
};
