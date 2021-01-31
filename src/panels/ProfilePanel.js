import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Placeholder,
  PanelSpinner,
  Tabs,
  TabsItem,
  Div,
  Subhead,
  Title,
  Avatar,
  Button,
  SimpleCell,
} from "@vkontakte/vkui";
import { withRouter } from "@happysanta/router";
import { MODAL_ABOUT } from "../router";
import "./home.css";
import monocle from "../img/monocle.png";
import party from "../img/party.png";
import pensive from "../img/pensive.png";
import { getTasks } from "../api";
import { setActiveTask, setTasks } from "./../store/data/actions";
import TaskCard from "./../components/TaskCard";
import {
  Icon36CoinsStacks2Outline,
  Icon20RepostCircleFillGreen,
} from "@vkontakte/icons";
import { shareWallPost } from "./../api/vk/index";
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "new",
    };
  }

  openModal(task) {
    this.props.setActiveTask(task);
    this.props.router.pushModal(MODAL_ABOUT);
  }

  render() {
    const { id, router, tasks, user, profile } = this.props;

    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={
            <PanelHeaderButton>
              <Icon36CoinsStacks2Outline />{" "}
              <Title level="2" className="point-counter" weight="bold">
                {user?.score}
              </Title>
            </PanelHeaderButton>
          }
        >
          Профиль
        </PanelHeader>
        {tasks !== null && tasks !== "error" && profile !== null && (
          <div>
            <div className="d-col align-center profile">
              <Avatar size="100px" src={profile.photo_200}></Avatar>
              <Title className="profile__name" level="2" weight="bold">
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
                Завершенные
              </TabsItem>
            </Tabs>
            {this.state.activeTab === "new" &&
              (tasks.all.length ? (
                tasks.all.map((task, i) => (
                  <Div key={i} onClick={() => this.openModal(task)}>
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
                  Заходи завтра за новыми заданиями!
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
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setTasks, setActiveTask }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
