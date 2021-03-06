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
  SET_TEAM,
  SET_ACTIVE_TEAM,
} from "./actionTypes";

const sortByGroup = (data) => {
  const container = {};
  data.map((task) => {
    container[task.group]
      ? container[task.group].push(task)
      : (container[task.group] = [task]);
  });

  return container;
};
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
    {
      id: 2,
      question: "Как ехать?",
      answers: [4, 5, 6, 7],
    },
    {
      id: 3,
      question: "Тык?",
      answers: [3, 4, 5, 6],
    },
  ],
  taskStates: {
    verified: "Выполнено",
    unverified: "Проверяется",
    decline: "Отклонено",
  },
  team: null,
  activeTeam: null,
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
      console.log(action.payload.data);
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
    case SET_ACTIVE_TEAM: {
      return {
        ...state,
        activeTeam: action.payload.data,
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
      const personalGroups = sortByGroup(action.payload.data.personal.new);
      const ecogames = sortByGroup(action.payload.data.ecogames.new);
      const teamGroups = sortByGroup(action.payload.data.team.new);

      action.payload.data.ecogames.new = ecogames;
      action.payload.data.personal.new = personalGroups;
      action.payload.data.team.new = teamGroups;
      return {
        ...state,
        tasks: action.payload.data,
      };
    }
    case SET_TEAM: {
      return {
        ...state,
        team: action.payload.data,
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
