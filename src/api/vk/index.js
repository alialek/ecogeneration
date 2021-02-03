import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { store } from "../../index";
import {
  setColorScheme,
  setIsOnboardingViewed,
} from "../../store/data/actions";
const api = new VKMiniAppAPI();

const STORAGE_KEYS = {
  STATUS: "status",
};

export const initApp = () => api.initApp();

api.onUpdateConfig((res) => {
  if (res?.scheme) store.dispatch(setColorScheme(res.scheme));
});

export const getUserInfo = () => {
  return api.getUserInfo();
};

export const tapticNotification = (type) => {
  api.bridge.send("VKWebAppTapticNotificationOccurred", { type });
};

export const tapticSelectNotification = () => {
  api.bridge.send("VKWebAppTapticSelectionChanged", {});
};

export const shareWallPost = (id) => {
  api.bridge.send("VKWebAppShowWallPostBox", {
    message:
      "Спасай планету вместе с нами, соревнуйся с другими участниками и получай призы! \n \n Вступай в Экопоколение. \n Проект @ecodelai(Делай!) и @rosmolodez(Росмолодежь)",
    attachments: `https://vk.com/app7744255#${id}`,
  });
};

export const showImages = (images, start_index) => {
  api.bridge.send("VKWebAppShowImages", {
    images,
    start_index,
  });
};
export const enableNotifications = () => {
  api.bridge.send("VKWebAppAllowNotifications");
};

export const isIntroViewed = async () => {
  return await api.storageGet(STORAGE_KEYS.STATUS);
};
export const setIntroViewed = async () => {
  api.storageSet(STORAGE_KEYS.STATUS, "viewed");
};
