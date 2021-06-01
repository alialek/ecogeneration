import { withRouter } from "@happysanta/router";
import {
  Icon20GearOutline,
  Icon20RepostCircleFillGreen,
  Icon28NotificationCircleFillGray,
} from "@vkontakte/icons";
import {
  Avatar,
  Caption,
  Card,
  Counter,
  Div,
  FormItem,
  FormLayout,
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
import { MODAL_ABOUT, MODAL_EDIT_USER, MODAL_TEST } from "../router";
import { enableNotifications, shareWallPost } from "./../api/vk/index";
import TaskCard from "./../components/TaskCard";
import { setActiveTask, setTasks, setTest } from "./../store/data/actions";
import "./home.css";
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "new",
    };

    this.getClickAction = this.getClickAction.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openEditUserModal = this.openEditUserModal.bind(this);
  }

  getAmountOfDeclined() {
    return this.props.tasks.user.personal.reduce(
      (acc, val) => (val.status === "decline" ? acc + 1 : acc),
      0,
    );
  }

  getClickAction(task) {
    console.log(task.block);
    if (task.block) return () => {};

    return task.typeTask === "test"
      ? this.openModal(task, MODAL_TEST)
      : this.openModal(task, MODAL_ABOUT);
  }

  openEditUserModal() {
    this.props.router.pushModal(MODAL_EDIT_USER);
  }

  openModal(task, page) {
    this.props.setActiveTask(task);
    if (task.typeTask === "test") this.props.setTest(task.test);
    this.props.router.pushModal(page);
  }

  render() {
    const { id, tasks, user, profile, isNotificationsEnabled } = this.props;

    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          // left={
          //   <div className="d-row align-center panel__coins">
          //     <Icon36CoinsStacks2Outline width={26} />
          //     <Title level="3" className="point-counter" weight="medium">
          //       {user?.score}
          //     </Title>
          //   </div>
          // }
        >
          Профиль
        </PanelHeader>
        {tasks !== null && tasks !== "error" && profile !== null && (
          <div>
            <Div>
              <Card>
                <Div className="d-row justify-space-between">
                  <div className="d-row">
                    <Avatar size="70px" src={profile.photo_200}></Avatar>
                    <div className="ml-12">
                      <Title className="profile__name" level="2" weight="bold">
                        {profile.first_name} {profile.last_name}
                      </Title>
                      <Caption level="1">Баллов: {user.score}</Caption>
                    </div>
                  </div>
                  <div
                    className="mt-12 pointer"
                    onClick={this.openEditUserModal}
                  >
                    <Icon20GearOutline />
                  </div>
                </Div>
              </Card>
            </Div>
            {/* <SimpleCell
              className="profile__invite"
              onClick={() => shareWallPost(profile.id)}
              before={
                <Avatar size={28} shadow={false}>
                  <Icon20RepostCircleFillGreen />
                </Avatar>
              }
              description="И заработать 0.5 балла, когда друг выполнит первое задание"
            >
              Пригласить друзей
            </SimpleCell> */}
            {/* {!isNotificationsEnabled && (
              <SimpleCell
                className="profile__invite"
                onClick={() => enableNotifications()}
                before={
                  <Avatar className="profile__icon" size={28} shadow={false}>
                    <Icon28NotificationCircleFillGray />
                  </Avatar>
                }
                description="Чтобы не пропустить новые задания"
              >
                Включить уведомления
              </SimpleCell>
            )} */}

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
            {this.state.activeTab === "new" && (
              <FormLayout>
                {this.state.activeTab === "new" &&
                Object.keys(tasks.all.personal).length ? (
                  Object.keys(tasks.all.personal).map((title, n) => (
                    <FormItem key={n} top={title}>
                      {tasks.all.personal[title].map((task, i) => (
                        <div key={i} onClick={() => this.getClickAction(task)}>
                          <TaskCard task={task} type={this.state.activeTab} />
                        </div>
                      ))}{" "}
                    </FormItem>
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
                )}
              </FormLayout>
            )}
            {this.state.activeTab === "done" &&
              (tasks.user.personal.length ? (
                tasks.user.personal.map((task, n) => (
                  <div key={n} onClick={() => this.getClickAction(task)}>
                    <TaskCard task={task} type={this.state.activeTab} />
                  </div>
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
    ...bindActionCreators({ setTasks, setActiveTask, setTest }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
