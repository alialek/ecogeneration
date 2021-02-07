import {
  SET_COLOR_SCHEME,
  SET_NEWS,
  SET_RATING,
  SET_TASKS,
  SET_USER,
  SET_ACTIVE_TASK,
  SET_SNACKBAR,
  SET_PROFILE,
  SET_IS_ONBOARDING_VIEWED,
  SET_IS_NOTIFICATIONS_ENABLED,
  SET_TEST,
} from "./actionTypes";

const initialState = {
  colorScheme: "client_light",
  news: null,
  rating: null,
  tasks: null,
  user: null,
  profile: null,
  activeTask: null,
  snackbar: null,
  isOnboardingViewed: true,
  isNotificationsEnabled: false,
  test: [
    {
      id: 1,
      question: "Сколько автору лет лет?",
      answers: [3, 4, 5, 6],
    },
  ],
  taskStates: {
    verified: "Выполнено",
    unverified: "Проверяется",
    decline: "Отклонено",
  },
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COLOR_SCHEME: {
      return {
        ...state,
        colorScheme: action.payload.data,
      };
    }
    case SET_SNACKBAR: {
      return {
        ...state,
        snackbar: action.payload.data,
      };
    }
    case SET_TEST: {
      return {
        ...state,
        test: action.payload.data,
      };
    }
    case SET_IS_ONBOARDING_VIEWED: {
      return {
        ...state,
        isOnboardingViewed: action.payload.data,
      };
    }
    case SET_IS_NOTIFICATIONS_ENABLED: {
      return {
        ...state,
        isNotificationsEnabled: action.payload.data,
      };
    }
    case SET_NEWS: {
      return {
        ...state,
        news: action.payload.data,
      };
    }
    case SET_USER: {
      return {
        ...state,
        user: action.payload.data,
      };
    }
    case SET_PROFILE: {
      return {
        ...state,
        profile: action.payload.data,
      };
    }
    case SET_RATING: {
      return {
        ...state,
        rating: action.payload.data,
      };
    }
    case SET_TASKS: {
      return {
        ...state,
        tasks: action.payload.data,
      };
    }
    case SET_ACTIVE_TASK: {
      return {
        ...state,
        activeTask: action.payload.data,
      };
    }
    default: {
      return state;
    }
  }
};
