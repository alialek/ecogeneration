import { Page, Router } from "@happysanta/router";

export const PAGE_PROFILE = "/";
export const PAGE_RATING = "/rating";
export const PAGE_NEWS = "/news";

export const PANEL_PROFILE = "panel_profile";
export const PANEL_RATING = "panel_rating";
export const PANEL_NEWS = "panel_news";

export const VIEW_PROFILE = "view_main";
export const VIEW_RATING = "view_rating";
export const VIEW_NEWS = "view_news";

export const MODAL_ABOUT = "modal_about";
export const MODAL_INFO = "modal_INFO";
export const MODAL_TEST = "modal_TEST";

export const POPOUT_CONFIRM = "popout_confirm";
export const POPOUT_SPINNER = "popout_spinner";

const routes = {
  [PAGE_PROFILE]: new Page(PANEL_PROFILE, VIEW_PROFILE),
  [PAGE_RATING]: new Page(PANEL_RATING, VIEW_RATING),
  [PAGE_NEWS]: new Page(PANEL_NEWS, VIEW_NEWS),
};

export const router = new Router(routes);

router.on("update", (nextRote, oldRoute) => {
  nextRote.getPageId(); // /product/:id([0-9]+)
  nextRote.getParams(); // { id: "12" }
  nextRote.getPanelId(); // panel_product
  nextRote.getViewId(); // view_main
  nextRote.getLocation(); // /product/12
  nextRote.isModal(); // false
  nextRote.isPopup(); // false
  nextRote.hasOverlay(); // false
});

router.start();
