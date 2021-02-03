import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  FormLayout,
  FormLayoutGroup,
  Gallery,
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
import { showImages } from "../api/vk";
import FileUploader from "./fileUploader";

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
    if (this.state.link || this.state.images) {
      let data = { id: this.props.task.id };
      type === "link"
        ? (data = { ...data, link: this.state.link })
        : type === "image"
        ? (data = { ...data, image: this.state.images[0] })
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
      <ModalCard
        id={id}
        onClose={() => router.popPage()}
        header="Задание"
        actions={
          !task.hasOwnProperty("status") || task.status === "decline"
            ? [
                {
                  title: "Отправить",
                  mode: "primary",
                  action: () => this.sendAnswer(task.typeTask),
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
            {task.images?.length && (
              <Gallery slideWidth="90%" style={{ height: 150 }} bullets="dark">
                {task.images.map((image, i) => (
                  <div
                    onClick={() => showImages(task.images, i)}
                    style={{ backgroundImage: `url(${image})` }}
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
                  {task?.typeTask === "image" && (
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
