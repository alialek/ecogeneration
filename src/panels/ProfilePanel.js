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
} from "@vkontakte/vkui";
import { withRouter } from "@happysanta/router";
import { MODAL_ABOUT } from "../router";
import "./home.css";
import pensive from "../img/pensive.png";
import { getTasks } from "../api";
import { setActiveTask, setTasks } from "./../store/data/actions";
import TaskCard from "./../components/TaskCard";
import { Icon36CoinsStacks2Outline } from "@vkontakte/icons";
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

  componentDidMount() {
    getTasks()
      .then((res) => {
        this.props.setTasks(res.data);
      })
      .catch((err) => {
        this.props.setTasks({
          all: [
            {
              id: Math.random(),
              type: "offline",
              title: "Покормить голубей",
              image:
                "https://icdn.lenta.ru/images/2020/05/31/06/20200531060652313/square_320_fc8f2698d7c92fd3f1bb7b2e28357e47.jpg",
              description:
                "Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дублик. Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения",
            },
            {
              id: Math.random(),
              type: "online",
              title: "Отдать ненужную вещь",
              image:
                "https://icdn.lenta.ru/images/2020/05/31/06/20200531060652313/square_320_fc8f2698d7c92fd3f1bb7b2e28357e47.jpg",
              description:
                "Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дублик. Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения",
            },
          ],
          user: [
            {
              comment: "Kek",
              id: 2,
              image:
                "https://icdn.lenta.ru/images/2020/05/31/06/20200531060652313/square_320_fc8f2698d7c92fd3f1bb7b2e28357e47.jpg",
              status: "decline",
              title: "Покормить голубей",
              type: "offline",
              description:
                "Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дублик. Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения",
            },
            {
              comment: "Kek",
              id: 2,
              image:
                "https://icdn.lenta.ru/images/2020/05/31/06/20200531060652313/square_320_fc8f2698d7c92fd3f1bb7b2e28357e47.jpg",
              status: "verified",
              title: "Покормить голубей",
              type: "offline",
              description:
                "Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дублик. Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения",
            },
          ],
        });
      });
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
        {tasks !== null && tasks !== "error" && (
          <div>
            <div className="d-col align-center profile">
              <Avatar size="100px" src={profile.photo_200}></Avatar>
              <Title className="profile__name" level="2" weight="bold">
                {profile.first_name} {profile.last_name}
              </Title>
            </div>
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
              tasks.all.map((task, i) => (
                <Div key={i} onClick={() => this.openModal(task)}>
                  <TaskCard task={task} type={this.state.activeTab} />
                </Div>
              ))}
            {this.state.activeTab === "done" &&
              tasks.user.map((task, n) => (
                <Div key={n} onClick={() => this.openModal(task)}>
                  <TaskCard task={task} type={this.state.activeTab} />
                </Div>
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
