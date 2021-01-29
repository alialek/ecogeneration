import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  FormLayout,
  FormLayoutGroup,
  Input,
  ModalCard,
  Text,
  Textarea,
} from "@vkontakte/vkui";
import "./card.css";
import { postTask } from "./../api/rest/task";
import showSnackbar from "./../helpers/generateSnackbar";
import {
  Icon20CancelCircleFillRed,
  Icon20CheckCircleFillGreen,
} from "@vkontakte/icons";
import { setSnackbar } from "./../store/data/actions";
import { getTasks } from "./../api/rest/tasks";

class AboutCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      link: null,
      snackbar: null,
    };
  }

  setInput = (e) => {
    this.setState({
      link: e.target.value,
    });
  };
  updateTasks() {
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

  sendAnswer() {
    if (this.state.link)
      return postTask({ id: this.props.task.id, link: this.state.link })
        .then((res) => {
          this.props.router.popPage();
          this.props.setSnackbar(
            showSnackbar(
              <Icon20CheckCircleFillGreen />,
              "Задание отправлено на проверку",
            ),
          );
          this.updateTasks();
        })
        .catch((err) => {
          this.setState({
            snackbar: showSnackbar(
              <Icon20CancelCircleFillRed />,
              "Ошибка подключения",
              () => this.setState({ snackbar: null }),
            ),
          });
        });

    this.setState({
      snackbar: showSnackbar(
        <Icon20CancelCircleFillRed />,
        "Введите ссылку",
        () => this.setState({ snackbar: null }),
      ),
    });
  }

  render() {
    const { task, id, router } = this.props;
    return (
      <ModalCard
        id={id}
        onClose={() => router.popPage()}
        header="Настройки"
        actions={
          !task.hasOwnProperty("status") || task.status === "decline"
            ? [
                {
                  title: "Отправить",
                  mode: "primary",
                  action: () => this.sendAnswer(),
                },
              ]
            : [
                {
                  title: "Закрыть",
                  mode: "primary",
                  action: () => router.popPage(),
                },
              ]
        }
      >
        {task !== null && (
          <div>
            <Text className="description"> {task.description}</Text>
            {(!task.hasOwnProperty("status") || task.status === "decline") && (
              <FormLayout className="custom-form">
                <FormLayoutGroup top="Решение">
                  <Input
                    type="text"
                    onInput={this.setInput}
                    placeholder="Ссылка на пост"
                  />
                </FormLayoutGroup>
              </FormLayout>
            )}
          </div>
        )}
        {this.state.snackbar}
      </ModalCard>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    task: state.data.activeTask,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setSnackbar }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(AboutCard));
