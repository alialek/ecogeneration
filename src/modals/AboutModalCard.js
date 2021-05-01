import React, { Component, Fragment } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ANDROID,
  Button,
  Div,
  FormItem,
  FormLayout,
  Gallery,
  Input,
  IOS,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  platform,
  Text,
} from "@vkontakte/vkui";
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
import FileUploader from "../components/fileUploader";
import { POPOUT_SPINNER } from "./../router/index";
import "../App.css";

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
        "Введите ответ",
        () => this.setState({ snackbar: null }),
      ),
    });
  }

  render() {
    const { task, id, router, team, user } = this.props;
    console.log(router.getCurrentLocation());
    const isAdmin =
      router.getCurrentLocation().route.pageId === "/"
        ? true
        : team?.admins.some((admin) => admin.id === user.id);
    return (
      <ModalPage
        id={id}
        onClose={() => router.replaceModal(null)}
        header={
          <ModalPageHeader
            left={
              <Fragment>
                {platform === ANDROID && (
                  <PanelHeaderButton onClick={() => router.replaceModal(null)}>
                    <Icon24Cancel />
                  </PanelHeaderButton>
                )}
              </Fragment>
            }
            right={
              <Fragment>
                {platform === IOS && (
                  <PanelHeaderButton onClick={() => router.replaceModal(null)}>
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
          <Div className="pt-0">
            {task.images?.length && (
              <Gallery
                slideWidth="100%"
                className="about__gallery"
                bullets="dark"
              >
                {task.images.map((image, i) => (
                  <div
                    key={i}
                    onClick={() => showImages(task.images, i)}
                    style={{
                      backgroundImage: `url(${image})`,
                    }}
                    className="about__gallery-image"
                  />
                ))}
              </Gallery>
            )}
            <FormItem top="Описание">
              <div className="description">{task.description}</div>
            </FormItem>
            {task.status === "decline" && (
              <FormItem top="Ответ отклонен">
                <Text className="description">
                  Причина: <span className="comment"> {task.comment}</span>
                </Text>
              </FormItem>
            )}
            {isAdmin && (
              <>
                {(!task.hasOwnProperty("status") ||
                  task.status === "decline") && (
                  <FormLayout className="custom-form">
                    <FormItem top="Решение">
                      {task?.typeTask === "link" && (
                        <Input
                          type="text"
                          onInput={this.setInput}
                          placeholder="Ссылка на пост"
                        />
                      )}
                      {task?.typeTask === "photo" && (
                        <Div>
                          <FileUploader
                            withIcon={true}
                            buttonText="Загрузить изображения"
                            onChange={this.onDrop}
                            singleImage={true}
                            withPreview={true}
                            imgExtension={[".jpg", ".png", ".jpeg"]}
                            maxFileSize={5242880}
                          />
                        </Div>
                      )}
                    </FormItem>
                  </FormLayout>
                )}
                {!task.hasOwnProperty("status") || task.status === "decline" ? (
                  <Button
                    size="l"
                    stretched
                    disabled={
                      (task?.typeTask === "photo" &&
                        !this.state.images.length) ||
                      (task?.typeTask === "link" && this.state.link === null)
                    }
                    onClick={() => this.sendAnswer(task.typeTask)}
                    mode="primary"
                  >
                    Отправить
                  </Button>
                ) : (
                  <Button
                    size="l"
                    onClick={() => router.replaceModal(null)}
                    mode="primary"
                    stretched
                  >
                    Закрыть
                  </Button>
                )}
              </>
            )}
            {!isAdmin && (
              <Text>
                {" "}
                На командные задания могут отвечать только администраторы
              </Text>
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
    team: state.data.team,
    user: state.data.user,
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
