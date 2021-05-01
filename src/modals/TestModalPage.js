import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ANDROID,
  Button,
  Div,
  FormItem,
  Gallery,
  IOS,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  platform,
  SimpleCell,
  Text,
  Title,
} from "@vkontakte/vkui";
import showSnackbar from "../helpers/generateSnackbar";
import {
  Icon20CancelCircleFillRed,
  Icon20CheckCircleFillGreen,
  Icon24Cancel,
} from "@vkontakte/icons";
import { setSnackbar, setTasks } from "../store/data/actions";
import { getTasks } from "../api/rest/tasks";
import { POPOUT_SPINNER } from "../router";
import { postTask } from "../api";
import "./modal.css";

class AboutCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      snackbar: null,
      slideIndex: 0,
    };

    this.saveAnswer = this.saveAnswer.bind(this);
    this.saveTest = this.saveTest.bind(this);
  }

  getActiveAnswer(questionNumber, answerNumber) {
    return this.state.answers[questionNumber] === answerNumber;
  }

  saveTest() {
    if (!this.state.answers.includes(undefined)) {
      this.props.router.replacePopup(POPOUT_SPINNER);
      const data = { id: this.props.task.id, answers: this.state.answers };

      return postTask(data)
        .then((res) => {
          this.props.router.replaceModal(null);
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
        })
        .finally(() => {
          this.props.router.replacePopup(null);
        });
    }
    this.setState({
      snackbar: showSnackbar(
        <Icon20CancelCircleFillRed />,
        "Вы пропустили задания, вернитесь!",
        () => this.setState({ snackbar: null }),
      ),
    });
    console.log(this.state.snackbar);
  }

  updateTasks() {
    getTasks()
      .then((res) => {
        this.props.setTasks(res.data);
      })
      .catch((err) => {
        this.props.setTasks("error");
      });
  }

  saveAnswer(questionNumber, answerNumber) {
    let arr = this.state.answers;
    arr[questionNumber] = answerNumber;
    console.log(this.state.answers);
    this.setState({
      answers: arr,
    });
  }

  componentDidMount() {
    this.setState({ answers: new Array(this.props.test.length) });
  }

  render() {
    const { test, router, id, task, user, team } = this.props;
    const isAdmin =
      router.getCurrentLocation().route.pageId === "/"
        ? true
        : team?.admins.some((admin) => admin.id === user.id);
    return (
      <ModalPage
        id={id}
        onClose={() => router.popPage()}
        header={
          <ModalPageHeader
            left={
              platform === ANDROID && (
                <PanelHeaderButton onClick={() => router.popPage()}>
                  <Icon24Cancel />
                </PanelHeaderButton>
              )
            }
            right={
              platform === IOS && (
                <PanelHeaderButton onClick={() => router.popPage()}>
                  Закрыть
                </PanelHeaderButton>
              )
            }
          >
            Задание
          </ModalPageHeader>
        }
      >
        {test !== null && test !== "error" && (
          <Div className="test__holder">
            <Gallery
              slideWidth="100%"
              className="test__gallery"
              bullets={false}
              isDraggable={false}
              slideIndex={this.state.slideIndex}
              onChange={(slideIndex) => this.setState({ slideIndex })}
            >
              <div className="description">
                <FormItem top="Описание">
                  <div
                    className="description"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {task.description}
                  </div>
                </FormItem>
                {task?.status ? (
                  <Text className="description">Задание выполнено</Text>
                ) : isAdmin ? (
                  <Button
                    size="l"
                    stretched
                    className="mt-8"
                    onClick={() =>
                      this.setState({ slideIndex: this.state.slideIndex + 1 })
                    }
                    mode="commerce"
                  >
                    Начать тест
                  </Button>
                ) : (
                  <Text className="description">
                    На командные задания могут отвечать только администраторы
                  </Text>
                )}
              </div>
              {test.map((question, questionNumber) => (
                <div key={questionNumber}>
                  <Title className="question" level="3" weight="heavy">
                    {question.question}
                  </Title>
                  {question.answers.map((answer, answerNumber) => (
                    <SimpleCell
                      key={answerNumber}
                      onClick={() =>
                        this.saveAnswer(questionNumber, answerNumber)
                      }
                      className={`answerCard  
                        ${
                          this.getActiveAnswer(questionNumber, answerNumber) &&
                          "answerCard--IsChosen"
                        }`}
                    >
                      {answer}
                    </SimpleCell>
                  ))}
                  <div>
                    {questionNumber !== test.length - 1 && (
                      <Button
                        size="l"
                        onClick={() =>
                          this.setState({
                            slideIndex: this.state.slideIndex + 1,
                          })
                        }
                        className="mt-8"
                        stretched
                        mode="primary"
                      >
                        Далее
                      </Button>
                    )}
                    {questionNumber === test.length - 1 && (
                      <Button
                        className="mt-8"
                        stretched
                        size="l"
                        onClick={this.saveTest}
                        mode="primary"
                      >
                        Завершить тест
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </Gallery>
          </Div>
        )}
        {this.state.snackbar}
      </ModalPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    test: state.data.test,
    task: state.data.activeTask,
    user: state.data.user,
    team: state.data.team,
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
