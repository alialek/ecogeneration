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
  Text,
} from "@vkontakte/vkui";
import "./card.css";
import { postTask } from "./../api/rest/task";
import showSnackbar from "./../helpers/generateSnackbar";
import {
  Icon20CancelCircleFillRed,
  Icon20CheckCircleFillGreen,
  Icon24Cancel,
} from "@vkontakte/icons";
import { setSnackbar, setTasks } from "./../store/data/actions";
import { getTasks } from "./../api/rest/tasks";
import { showImages } from "../api/vk";
import FileUploader from "./fileUploader";
import { POPOUT_SPINNER } from "./../router/index";

class AboutCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      link: null,
      snackbar: null,
      images: [],
    };

    this.onDrop = this.onDrop.bind(this);
  }

  setInput = (e) => {
    this.setState({
      link: e.target.value,
    });
  };
  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({ images: pictureDataURLs });
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

  sendAnswer(type) {
    this.props.router.replacePopup(POPOUT_SPINNER);
    if (this.state.link || this.state.images) {
      let data = { id: this.props.task.id };
      type === "link"
        ? (data = { ...data, link: this.state.link })
        : type === "photo"
        ? (data = { ...data, photo: this.state.images[0] })
        : (data = { ...data, answers: this.state.answers });
      return postTask(data)
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
        })
        .finally(() => {
          this.props.router.replacePopup(null);
        });
    }

    this.setState({
      snackbar: showSnackbar(
        <Icon20CancelCircleFillRed />,
        "Введите ответ",
        () => this.setState({ snackbar: null }),
      ),
    });
  }

  render() {
    const { task, id, router } = this.props;
    return (
      <ModalPage
        id={id}
        onClose={() => router.popPage()}
        header={
          <ModalPageHeader
            left={
              <Fragment>
                {platform === ANDROID && (
                  <PanelHeaderButton onClick={() => router.popPage()}>
                    <Icon24Cancel />
                  </PanelHeaderButton>
                )}
              </Fragment>
            }
            right={
              <Fragment>
                {platform === IOS && (
                  <PanelHeaderButton onClick={() => router.popPage()}>
                    Закрыть
                  </PanelHeaderButton>
                )}
              </Fragment>
            }
          >
            Задание
          </ModalPageHeader>
        }
      >
        {task !== null && (
          <Div>
            {task.images?.length && (
              <Gallery slideWidth="100%" style={{ height: 150 }} bullets="dark">
                {task.images.map((image, i) => (
                  <div
                    onClick={() => showImages(task.images, i)}
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                ))}
              </Gallery>
            )}
            <div className="description">
              {task.description.split(/\n/).map((text, i) => (
                <Text key={i}>{text}</Text>
              ))}
            </div>
            {task.status === "decline" && (
              <Text className="description">
                {" "}
                Причина: <span className="comment"> {task.comment}</span>
              </Text>
            )}
            {(!task.hasOwnProperty("status") || task.status === "decline") && (
              <FormLayout className="custom-form">
                <FormLayoutGroup top="Решение">
                  {task?.typeTask === "link" && (
                    <Input
                      type="text"
                      onInput={this.setInput}
                      placeholder="Ссылка на пост"
                    />
                  )}
                  {task?.typeTask === "photo" && (
                    <FileUploader
                      withIcon={true}
                      buttonText="Загрузить изображения"
                      onChange={this.onDrop}
                      singleImage={true}
                      withPreview={true}
                      imgExtension={[".jpg", ".png", ".jpeg"]}
                      maxFileSize={5242880}
                    />
                  )}
                </FormLayoutGroup>
              </FormLayout>
            )}
            {!task.hasOwnProperty("status") || task.status === "decline" ? (
              <Button
                size="xl"
                onClick={() => this.sendAnswer(task.typeTask)}
                mode="primary"
              >
                Отправить
              </Button>
            ) : task.type === "test" ? (
              <Button size="xl" onClick={this.openTest} mode="primary">
                Решить тест
              </Button>
            ) : (
              <Button size="xl" onClick={() => router.popPage()} mode="primary">
                Закрыть
              </Button>
            )}
          </Div>
        )}
        {this.state.snackbar}
      </ModalPage>
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
