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
  Alert,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import Profile from "./views/ProfileView";
import {
  VIEW_PROFILE,
  VIEW_NEWS,
  VIEW_RATING,
  MODAL_ABOUT,
  POPOUT_SPINNER,
  PAGE_RATING,
  PAGE_NEWS,
  MODAL_INFO,
  MODAL_TEST,
  PAGE_TEAM,
  VIEW_TEAM,
  MODAL_CREATE_TEAM,
  MODAL_MANAGE_TEAM,
  POPOUT_TEAM_JOIN_CONFIRM,
  MODAL_VIEW_TEAM,
  MODAL_EDIT_USER,
  POPOUT_TEAM_LEAVE_CONFIRM,
  POPOUT_TEAM_DOWNGRADE_CONFIRM,
} from "./router";
import { PAGE_PROFILE } from "./router/index";
import "./App.css";
import { auth } from "./api";
import { withParams, withRouter } from "@happysanta/router";
import { getUserInfo, isIntroViewed } from "./api/vk/index";
import AboutModalCard from "./modals/AboutModalCard";
import News from "./views/NewsView";
import Rating from "./views/RatingView";
import {
  Icon20CancelCircleFillRed,
  Icon20CheckCircleFillGreen,
  Icon28NewsfeedOutline,
  Icon28ServicesOutline,
  Icon28UserCircleOutline,
  Icon28Users3Outline,
} from "@vkontakte/icons";
import {
  setProfile,
  setUser,
  setTasks,
  setIsOnboardingViewed,
  setIsNotificationsEnabled,
  setSnackbar,
  setTeam,
} from "./store/data/actions";
import { getTasks } from "./api/rest/tasks";
import IntroView from "./views/IntroView";
import DelayInfoModalCard from "./modals/DelayInfoModalCard";
import TestModalPage from "./modals/TestModalPage";
import Team from "./views/TeamView";
import CreateTeamModalCard from "./modals/CreateTeamModalCard";
import ManageTeamModalCard from "./modals/ManageTeamModal";
import { leaveTeam, updateTeam, updateTeamMembers } from "./api/rest/team";
import showSnackbar from "./helpers/generateSnackbar";
import TeamViewerModal from "./modals/TeamViewerModal";
import EditUserModal from "./modals/EditUserModal";

class App extends React.Component {
  popout() {
    const { location } = this.props;
    if (location.getPopupId() === POPOUT_SPINNER) {
      return <ScreenSpinner />;
    }
    // if (location.getPopupId() === POPOUT_TEAM_JOIN_CONFIRM) {
    //   return (
    //     <Alert
    //       actions={[
    //         {
    //           title: "Отмена",
    //           autoclose: true,
    //           mode: "cancel",
    //         },
    //         {
    //           title: "Отправить",
    //           autoclose: true,
    //           mode: "destructive",
    //           action: () => this.joinTeam(),
    //         },
    //       ]}
    //       actionsLayout="horizontal"
    //       onClose={() => this.props.router.replacePopup(null)}
    //       header="Заявка на вступление"
    //       text="Отправить заявку на вступление в команду? Подтверждение может занять некоторое время."
    //     />
    //   );
    // }

    // if (location.getPopupId() === POPOUT_TEAM_DOWNGRADE_CONFIRM) {
    //   return (
    //     <Alert
    //       actions={[
    //         {
    //           title: "Отмена",
    //           autoclose: true,
    //           mode: "cancel",
    //         },
    //         {
    //           title: "Удалить",
    //           autoclose: true,
    //           mode: "destructive",
    //           action: () =>
    //             updateTeam({
    //               id: this.props.team.id,
    //               type: "delete",
    //             }).then((res) => this.props.setTeam()),
    //         },
    //       ]}
    //       actionsLayout="horizontal"
    //       onClose={() => this.props.router.replacePopup(null)}
    //       header="Удалить команду"
    //       text="Вы уверены, что хотите удалить команду? Весь прогресс будет сброшен"
    //     />
    //   );
    // }
    // if (location.getPopupId() === POPOUT_TEAM_LEAVE_CONFIRM) {
    //   return (
    //     <Alert
    //       actions={[
    //         {
    //           title: "Отмена",
    //           autoclose: true,
    //           mode: "cancel",
    //         },
    //         {
    //           title: "Выйти",
    //           autoclose: true,
    //           mode: "destructive",
    //           action: () =>
    //             leaveTeam({
    //               id: this.props.team.id,
    //               type: "exit",
    //             }).then((res) => this.props.setTeam()),
    //         },
    //       ]}
    //       actionsLayout="horizontal"
    //       onClose={() => this.props.router.replacePopup(null)}
    //       header="Выход из команды"
    //       text="Вы уверены, что хотите выйти из команды?"
    //     />
    //   );
    // }
  }

  // joinTeam() {
  //   updateTeamMembers({
  //     type: "send",
  //     id: +this.props.params.team,
  //   })
  //     .then((res) => {
  //       this.props.setSnackbar(
  //         showSnackbar(
  //           <Icon20CheckCircleFillGreen />,
  //           "Заявка на вступление в команду отправлена",
  //           () => this.props.setSnackbar(null),
  //         ),
  //       );
  //     })
  //     .catch(() =>
  //       this.props.setSnackbar(
  //         showSnackbar(
  //           <Icon20CancelCircleFillRed />,
  //           "Не получилось присоединиться к команде",
  //           () => this.props.setSnackbar(null),
  //         ),
  //       ),
  //     );
  // }

  async componentDidMount() {
    isIntroViewed().then((res) => {
      return this.props.setIsOnboardingViewed(res.length !== 0 ? true : false);
    });

    getUserInfo().then((res) => {
      this.props.setProfile(res);
    });
    //Второй парамтер - this.props.params.referral
    auth(window.location.search).then((res) => {
      this.props.setUser(res.data);
      localStorage.setItem("user_ecogen", res.data.token);
      // if (this.props.params.team && !res.data?.team) {
      //   this.props.router.pushPopup(POPOUT_TEAM_JOIN_CONFIRM);
      // }
      getTasks()
        .then((res) => {
          this.props.setTasks(res.data);
        })
        .catch((err) => {
          this.props.setTasks("error");
        });
    });

    this.props.setIsNotificationsEnabled(
      Boolean(
        +window.location.search
          .split("vk_are_notifications_enabled=")[1]
          .slice(0, 1),
      ),
    );
  }

  render() {
    const { location, colorScheme, router, snackbar, params } = this.props;

    const popout = this.popout();
    const modal = (
      <ModalRoot
        onClose={() => router.replaceModal(null)}
        activeModal={location.getModalId()}
      >
        <TestModalPage id={MODAL_TEST} />
        <AboutModalCard id={MODAL_ABOUT} />
        <DelayInfoModalCard id={MODAL_INFO} />
        {/* <CreateTeamModalCard id={MODAL_CREATE_TEAM} />
        <ManageTeamModalCard id={MODAL_MANAGE_TEAM} />
        <TeamViewerModal id={MODAL_VIEW_TEAM} /> */}
        <EditUserModal id={MODAL_EDIT_USER} />
      </ModalRoot>
    );
    return (
      <ConfigProvider isWebView={true} scheme={colorScheme}>
        <Root activeView={this.props.isOnboardingViewed ? "main" : "intro"}>
          <IntroView id="intro" activePanel="intro-1" />
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

                    {/* <TabbarItem
                      onClick={() => router.replacePage(PAGE_TEAM)}
                      selected={VIEW_TEAM === location.getViewId()}
                      data-story={VIEW_TEAM}
                      text="Команда"
                    >
                      <Icon28Users3Outline />
                    </TabbarItem> */}

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
                <Team
                  activePanel={location.getViewActivePanel(VIEW_TEAM)}
                  history={location.getViewHistory(VIEW_TEAM)}
                  id={VIEW_TEAM}
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
    user: state.data.user,
    colorScheme: state.data.colorScheme,
    isOnboardingViewed: state.data.isOnboardingViewed,
    team: state.data.team,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setUser,
        setTeam,
        setProfile,
        setTasks,
        setIsOnboardingViewed,
        setIsNotificationsEnabled,
        setSnackbar,
      },
      dispatch,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withParams(withRouter(App)));
