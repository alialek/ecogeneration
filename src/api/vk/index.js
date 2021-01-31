import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { store } from "../../index";
import { setColorScheme } from "../../store/data/actions";
import { router, PAGE_PROFILE } from "../../router";

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
      "Спасай планету вместе с нами, соревнуйся с другими участниками и получай призы! \n \n Вступай в Экопоколение.",
    attachments: `https://vk.com/app7744255#${id}`,
  });
};

export const showImages = (images, start_index) => {
  api.bridge.send("VKWebAppShowImages", {
    images,
    start_index,
  });
};

// export const isIntroViewed = async () => {
//     return await api.storageGet(STORAGE_KEYS.STATUS);
// };
// export const setIntroViewed = async () => {
//     api.storageSet(STORAGE_KEYS.STATUS, 'viewed').finally(() => router.replacePage(PAGE_PROFILE));
// };
