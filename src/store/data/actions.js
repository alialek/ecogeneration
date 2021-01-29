import {
  SET_ACTIVE_TASK,
  SET_COLOR_SCHEME,
  SET_NEWS,
  SET_PROFILE,
  SET_RATING,
  SET_SNACKBAR,
  SET_TASKS,
  SET_USER,
} from "./actionTypes.js";

export const setColorScheme = (inputData) => ({
  type: SET_COLOR_SCHEME,
  payload: {
    data: inputData,
  },
});
export const setUser = (inputData) => ({
  type: SET_USER,
  payload: {
    data: inputData,
  },
});
export const setNews = (inputData) => ({
  type: SET_NEWS,
  payload: {
    data: inputData,
  },
});
export const setRating = (inputData) => ({
  type: SET_RATING,
  payload: {
    data: inputData,
  },
});
export const setTasks = (inputData) => ({
  type: SET_TASKS,
  payload: {
    data: inputData,
  },
});
export const setProfile = (inputData) => ({
  type: SET_PROFILE,
  payload: {
    data: inputData,
  },
});
export const setActiveTask = (inputData) => ({
  type: SET_ACTIVE_TASK,
  payload: {
    data: inputData,
  },
});
export const setSnackbar = (inputData) => ({
  type: SET_SNACKBAR,
  payload: {
    data: inputData,
  },
});
