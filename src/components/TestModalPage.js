import React, { Component, Fragment } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ANDROID,
  Button,
  Div,
  FormLayout,
  FormLayoutGroup,
  Gallery,
  Input,
  IOS,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  platform,
  SimpleCell,
  Text,
  Title,
} from "@vkontakte/vkui";
import "./card.css";
import { postTask } from "../api/rest/task";
import showSnackbar from "../helpers/generateSnackbar";
import {
  Icon20CancelCircleFillRed,
  Icon20CheckCircleFillGreen,
  Icon24Cancel,
} from "@vkontakte/icons";
import { setSnackbar, setTasks } from "../store/data/actions";
import { getTasks } from "../api/rest/tasks";

class AboutCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      slideIndex: 0,
    };

    this.saveAnswer = this.saveAnswer.bind(this);
  }

  getActiveAnswer(questionNumber, answerNumber) {
    console.log(this.state.answers[questionNumber] === answerNumber);
    return this.state.answers[questionNumber] === answerNumber;
  }

  saveTest() {
    console.log("сохранение теста");
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

    this.setState({
      answers: arr,
    });
  }

  componentDidMount() {
    this.setState({ answers: new Array(this.props.test.length) });
  }

  render() {
    const { test, router, id, task } = this.props;
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
          <Div>
            <Gallery
              slideWidth="100%"
              style={{ height: "100%" }}
              bullets={false}
              slideIndex={this.state.slideIndex}
              onChange={(slideIndex) => this.setState({ slideIndex })}
            >
              <div className="description">
                {task.description.split(/\n/).map((text, i) => (
                  <Text key={i}>{text}</Text>
                ))}
                <Button
                  size="l"
                  className="test-start-button"
                  onClick={() =>
                    this.setState({ slideIndex: this.state.slideIndex + 1 })
                  }
                  mode="commerce"
                >
                  Начать тест
                </Button>
              </div>
              {test.map((question, questionNumber) => (
                <div>
                  <Title className="question" level="3" weight="heavy">
                    {question.question}
                  </Title>
                  {question.answers.map((answer, answerNumber) => (
                    <SimpleCell
                      onClick={() =>
                        this.saveAnswer(questionNumber, answerNumber)
                      }
                      className={{
                        answerCard: true,
                        "answerCard--IsChosen": this.getActiveAnswer(
                          questionNumber,
                          answerNumber,
                        ),
                      }}
                    >
                      {answer}
                    </SimpleCell>
                  ))}
                  <div>
                    {questionNumber !== test.length && (
                      <Button
                        size="xl"
                        onClick={() =>
                          this.setState({
                            slideIndex: this.state.slideIndex + 1,
                          })
                        }
                        mode="primary"
                      >
                        Далее
                      </Button>
                    )}
                    {questionNumber === test.length && (
                      <Button size="xl" onClick={this.saveTest} mode="primary">
                        Завершить тест
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </Gallery>
          </Div>
        )}
      </ModalPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    test: state.data.test,
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
