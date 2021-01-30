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
import { setSnackbar, setTasks } from "./../store/data/actions";
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
        this.props.setTasks("error");
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
            {task.status === "decline" && (
              <Text className="description">
                {" "}
                Причина: <span className="comment"> {task.comment}</span>
              </Text>
            )}
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
    ...bindActionCreators({ setSnackbar, setTasks }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(AboutCard));
