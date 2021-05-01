import {
  SET_ACTIVE_TASK,
  SET_COLOR_SCHEME,
  SET_IS_NOTIFICATIONS_ENABLED,
  SET_IS_ONBOARDING_VIEWED,
  SET_NEWS,
  SET_PROFILE,
  SET_RATING,
  SET_SNACKBAR,
  SET_TASKS,
  SET_USER,
  SET_TEST,
  SET_TEAM,
  SET_ACTIVE_TEAM,
} from "./actionTypes.js";
import { getTeam } from "./../../api/rest/team";

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
export const setTest = (inputData) => ({
  type: SET_TEST,
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
export const setTeam = (inputData) => (dispatch) => {
  getTeam()
    .then((res) => {
      dispatch({
        type: SET_TEAM,
        payload: {
          data: res.data,
        },
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_TEAM,
        payload: {
          data: "error",
        },
      });
    });
};
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
export const setIsOnboardingViewed = (inputData) => ({
  type: SET_IS_ONBOARDING_VIEWED,
  payload: {
    data: inputData,
  },
});
export const setIsNotificationsEnabled = (inputData) => ({
  type: SET_IS_NOTIFICATIONS_ENABLED,
  payload: {
    data: inputData,
  },
});
export const setActiveTeam = (inputData) => ({
  type: SET_ACTIVE_TEAM,
  payload: {
    data: inputData,
  },
});
