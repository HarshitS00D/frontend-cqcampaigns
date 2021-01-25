import axios from "../config/axios";

import { LOGIN, LOGOUT } from ".";

export const destroySession = () => ({ type: LOGOUT });

export const createSession = (params = {}) => async (dispatch) => {
  const { email, password, remember, changeLoadingState, onError } = params;
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token && !email && !password) return dispatch({ type: LOGOUT });

    changeLoadingState && changeLoadingState(true);

    const response = await axios.post(`/auth/login`, {
      email,
      password,
      token,
    });

    const result = response.data;

    axios.interceptors.request.use(
      (config) => {
        if (!config.headers.authorization && result.token)
          config.headers.authorization = result.token;
        return config;
      },
      (error) => Promise.reject(error)
    );

    changeLoadingState && changeLoadingState(false);
    sessionStorage.setItem("token", result.token);
    if (remember) localStorage.setItem("token", result.token);

    dispatch({ type: LOGIN, payload: result });
  } catch (err) {
    changeLoadingState && changeLoadingState(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    onError(err.response);
  }
};
