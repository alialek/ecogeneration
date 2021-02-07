import { withRouter } from "@happysanta/router";
import {
  Icon20RepostCircleFillGreen,
  Icon28NotificationCircleFillGray,
  Icon36CoinsStacks2Outline,
} from "@vkontakte/icons";
import {
  Avatar,
  Counter,
  Div,
  Panel,
  PanelHeader,
  PanelSpinner,
  Placeholder,
  SimpleCell,
  Tabs,
  TabsItem,
  Title,
} from "@vkontakte/vkui";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import monocle from "../img/monocle.png";
import party from "../img/party.png";
import pensive from "../img/pensive.png";
import { MODAL_ABOUT, MODAL_TEST } from "../router";
import { enableNotifications, shareWallPost } from "./../api/vk/index";
import TaskCard from "./../components/TaskCard";
import { setActiveTask, setTasks } from "./../store/data/actions";
import "./home.css";
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "new",
    };
  }

  getAmountOfDeclined() {
    return this.props.tasks.user.reduce(
      (acc, val) => (val.status === "decline" ? acc + 1 : acc),
      0,
    );
  }

  openModal(task, page) {
    this.props.setActiveTask(task);
    this.props.router.pushModal(MODAL_TEST);
  }

  render() {
    const { id, tasks, user, profile, isNotificationsEnabled } = this.props;

    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={
            <div className="d-row align-center">
              <Icon36CoinsStacks2Outline width={26} />
              <Title level="3" className="point-counter" weight="medium">
                {user?.score}
              </Title>
            </div>
          }
        >
          Профиль
        </PanelHeader>
        {tasks !== null && tasks !== "error" && profile !== null && (
          <div>
            <div className="d-col align-center profile">
              <Avatar size="80px" src={profile.photo_200}></Avatar>
              <Title className="profile__name" level="3" weight="bold">
                {profile.first_name} {profile.last_name}
              </Title>
            </div>
            <SimpleCell
              className="profile__invite"
              onClick={() => shareWallPost(profile.id)}
              before={
                <Avatar
                  style={{ background: "var(--accent)" }}
                  size={28}
                  shadow={false}
                >
                  <Icon20RepostCircleFillGreen />
                </Avatar>
              }
              description="И заработать 0.5 балла, когда друг выполнит первое задание"
            >
              Пригласить друзей
            </SimpleCell>
            {isNotificationsEnabled}
            {!isNotificationsEnabled && (
              <SimpleCell
                className="profile__invite"
                onClick={() => enableNotifications()}
                before={
                  <Avatar
                    style={{ background: "var(--accent)" }}
                    size={28}
                    shadow={false}
                  >
                    <Icon28NotificationCircleFillGray />
                  </Avatar>
                }
                description="Чтобы не пропустить новые задания"
              >
                Включить уведомления
              </SimpleCell>
            )}

            <Tabs>
              <TabsItem
                onClick={() => this.setState({ activeTab: "new" })}
                selected={this.state.activeTab === "new"}
              >
                Задания
              </TabsItem>
              <TabsItem
                onClick={() => this.setState({ activeTab: "done" })}
                selected={this.state.activeTab === "done"}
              >
                Завершенные{" "}
                {this.getAmountOfDeclined() > 0 && (
                  <Counter className="declined-indicator">
                    {this.getAmountOfDeclined()}
                  </Counter>
                )}
              </TabsItem>
            </Tabs>
            {this.state.activeTab === "new" &&
              (tasks.all.length ? (
                tasks.all.map((task, i) => (
                  <Div
                    key={i}
                    onClick={
                      task.type === "test"
                        ? () => this.openModal(task, MODAL_TEST)
                        : () => this.openModal(task, MODAL_ABOUT)
                    }
                  >
                    <TaskCard task={task} type={this.state.activeTab} />
                  </Div>
                ))
              ) : (
                <Placeholder
                  icon={
                    <img
                      alt="Заглушка"
                      className="emoji-placeholder"
                      src={party}
                    />
                  }
                  header="Все выполнено"
                >
                  Скоро появятся новые задания!
                </Placeholder>
              ))}
            {this.state.activeTab === "done" &&
              (tasks.user.length ? (
                tasks.user.map((task, n) => (
                  <Div key={n} onClick={() => this.openModal(task)}>
                    <TaskCard task={task} type={this.state.activeTab} />
                  </Div>
                ))
              ) : (
                <Placeholder
                  icon={
                    <img
                      alt="Заглушка"
                      className="emoji-placeholder"
                      src={monocle}
                    />
                  }
                  header="Заданий нет"
                >
                  Выполняйте задания, чтобы заработать баллы
                </Placeholder>
              ))}
          </div>
        )}
        {tasks === null && <PanelSpinner />}
        {tasks === "error" && (
          <Placeholder
            icon={
              <img alt="Заглушка" className="emoji-placeholder" src={pensive} />
            }
            header="Ошибка"
          >
            Упс, попробуйте обновить
          </Placeholder>
        )}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tasks: state.data.tasks,
    user: state.data.user,
    profile: state.data.profile,
    isNotificationsEnabled: state.data.isNotificationsEnabled,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setTasks, setActiveTask }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
