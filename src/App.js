import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ConfigProvider,
  ScreenSpinner,
  Root,
  ModalRoot,
  Epic,
  TabbarItem,
  Tabbar,
  Panel,
  View,
  Snackbar,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import Profile from "./views/ProfileView";
import {
  router,
  VIEW_PROFILE,
  VIEW_NEWS,
  VIEW_RATING,
  MODAL_ABOUT,
  POPOUT_CONFIRM,
  POPOUT_SPINNER,
  PAGE_RATING,
  PAGE_NEWS,
} from "./router";
import { PAGE_PROFILE } from "./router/index";
import "./App.css";
import { auth } from "./api";
import { withRouter } from "@happysanta/router";
import { getUserInfo } from "./api/vk/index";
import AboutModalCard from "./components/AboutModalCard";
import News from "./views/NewsView";
import Rating from "./views/RatingView";
import {
  Icon28NewsfeedOutline,
  Icon28ServicesOutline,
  Icon28UserCircleOutline,
} from "@vkontakte/icons";
import { setProfile, setUser, setTasks } from "./store/data/actions";
import { getTasks } from "./api/rest/tasks";

class App extends React.Component {
  popout() {
    const { location } = this.props;
    if (location.getPopupId() === POPOUT_SPINNER) {
      return <ScreenSpinner />;
    }
  }

  async componentDidMount() {
    getUserInfo().then((res) => {
      this.props.setProfile(res);
    });
    // router.replacePage(PAGE_PROFILE);
    auth(window.location.search)
      .then((res) => {
        this.props.setUser(res.data);
        localStorage.setItem("user_ecogen", res.data.token);
        getTasks()
          .then((res) => {
            this.props.setTasks(res.data);
          })
          .catch((err) => {
            this.props.setTasks("error");
          });
      })
      .catch((err) =>
        this.props.setUser({
          id: 1,
          new: false,
          reg_time: 23423,
          score: 0,
          token: "sdiwe",
        }),
      );
  }

  render() {
    const { location, colorScheme, router, snackbar } = this.props;
    const popout = this.popout();
    const modal = (
      <ModalRoot
        onClose={() => router.popPage()}
        activeModal={location.getModalId()}
      >
        <AboutModalCard id={MODAL_ABOUT} />
      </ModalRoot>
    );
    return (
      <ConfigProvider isWebView={true} scheme={colorScheme}>
        <Root activeView="main">
          <View id="main" activePanel="main-1">
            <Panel id="main-1">
              <Epic
                activeStory={location.getViewId()}
                tabbar={
                  <Tabbar>
                    <TabbarItem
                      onClick={() => router.replacePage(PAGE_PROFILE)}
                      selected={VIEW_PROFILE === location.getViewId()}
                      data-story={VIEW_PROFILE}
                      text="Профиль"
                    >
                      <Icon28UserCircleOutline />
                    </TabbarItem>

                    <TabbarItem
                      onClick={() => router.replacePage(PAGE_RATING)}
                      selected={VIEW_RATING === location.getViewId()}
                      data-story={VIEW_RATING}
                      text="Рейтинг"
                    >
                      <Icon28ServicesOutline />
                    </TabbarItem>
                    <TabbarItem
                      onClick={() => router.replacePage(PAGE_NEWS)}
                      selected={VIEW_NEWS === location.getViewId()}
                      data-story={VIEW_NEWS}
                      text="Новости"
                    >
                      <Icon28NewsfeedOutline />
                    </TabbarItem>
                  </Tabbar>
                }
              >
                <Profile
                  activePanel={location.getViewActivePanel(VIEW_PROFILE)}
                  history={location.getViewHistory(VIEW_PROFILE)}
                  id={VIEW_PROFILE}
                  modal={modal}
                  popout={popout}
                />
                <Rating
                  activePanel={location.getViewActivePanel(VIEW_RATING)}
                  history={location.getViewHistory(VIEW_RATING)}
                  id={VIEW_RATING}
                  modal={modal}
                  popout={popout}
                />
                <News
                  activePanel={location.getViewActivePanel(VIEW_NEWS)}
                  history={location.getViewHistory(VIEW_NEWS)}
                  id={VIEW_NEWS}
                  modal={modal}
                  popout={popout}
                />
              </Epic>
              {snackbar}
            </Panel>
          </View>
        </Root>
      </ConfigProvider>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    snackbar: state.data.snackbar,
    colorScheme: state.data.colorScheme,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setUser, setProfile, setTasks }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
