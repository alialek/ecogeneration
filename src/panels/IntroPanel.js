import {
  Panel,
  Div,
  Button,
  Gallery,
  Title,
  Text,
  SimpleCell,
} from "@vkontakte/vkui";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import earth from "../img/earth.png";
import notebook from "../img/notebook.png";
import hugging from "../img/hugging.png";
import medal from "../img/medal.png";
import "./intro.css";
import { withRouter } from "@happysanta/router";
import {
  setIsOnboardingViewed,
  setTasks,
  setSnackbar,
} from "./../store/data/actions";
import { setIntroViewed } from "../api/vk";
import { POPOUT_SPINNER } from "../router";
import { reg } from "./../api/rest/reg";
import { getTasks } from "./../api/rest/tasks";
import { Icon20CancelCircleFillRed } from "@vkontakte/icons";
import showSnackbar from "./../helpers/generateSnackbar";

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      categories: [
        { id: 0, title: "Младшая", description: "Ученики 1-5 классов" },
        {
          id: 1,
          title: "Средняя",
          description: "Ученики 6-11 классов и студенты ССУЗ",
        },
        {
          id: 2,
          title: "Старшая",
          description: "Студенты ВУЗов",
        },
      ],
      chosenCategory: null,
      slides: [
        {
          title: "Что такое «Экопоколение»‎ и для чего это приложение?",
          description:
            "Привет! На протяжении следующего месяца тебе предстоит научиться азам ответственного потребления, узнать об интересных экопривычках, а также закрепить полученные навыки и выполнить ряд заданий.",
          icon: earth,
          button: "Далее",
        },
        {
          title: "Какие задания есть?",
          description:
            "Обо всем узнаешь уже на практике! Приступай к заданиям и не бойся трудностей, а также не забудь посетить образовательный вебинар, где будет рассказана теоретическая часть, которую тебе предстоит применить на практике!",
          icon: notebook,
          button: "Далее",
        },
        {
          title: "Формат участия",
          description:
            "В новом сезоне «Экопоколения»‎ ты можешь участвовать индивидуально или в команде от 2 до 10 человек.",
          icon: medal,
          button: "Далее",
        },
        {
          title: "Немного о нас",
          description:
            "Проект «Экопоколение 2.0»‎ реализуется Всероссийской общественной организацией волонтеров-экологов «Делай!»‎ и Государственной корпорацией развития ВЭБ.РФ – вместе мы стремимся воспитать новое экопоколение.",
          icon: hugging,
          button: "Далее",
        },
        {
          title: "Выбери категорию участия",

          button: "Продолжить",
        },
      ],
    };
  }

  changeIndex(slideIndex) {
    this.setState({ slideIndex });
  }

  registerUser() {
    this.props.router.pushPopup(POPOUT_SPINNER);
    reg({ id: this.state.chosenCategory })
      .then((res) => {
        getTasks()
          .then((res) => {
            this.props.setTasks(res.data);
            this.props.router.replacePopup(null);
          })
          .catch((err) => {
            this.props.setTasks("error");
          });
      })
      .catch((err) => {
        this.props.setSnackbar(
          showSnackbar(
            <Icon20CancelCircleFillRed />,
            "Не получилось сохранить выбранную категорию",
          ),
        );
      });

    this.props.setIsOnboardingViewed(true);
    setIntroViewed();
  }

  render() {
    return (
      <Panel
        id={this.props.id}
        separator={false}
        centered={true}
        className="intro-panel"
      >
        <Gallery
          onChange={(slideIndex) => {
            this.changeIndex(slideIndex);
          }}
          slideIndex={this.state.slideIndex}
          slideWidth="100%"
          align="right"
          className="intro__gallery"
        >
          {this.state.slides.map((slide, i) => (
            <div key={i} className="slide">
              <Div>
                <Title level="1" className="slide__title" weight="semibold">
                  {slide.title}
                </Title>
              </Div>

              <Div className="d-col align-center">
                {slide?.icon && (
                  <div className="blob-holder">
                    {" "}
                    <div className="blob"></div>{" "}
                    <img
                      alt="Иконка"
                      className="slide__image"
                      src={slide.icon}
                    />
                  </div>
                )}
                {this.state.slideIndex === 4 &&
                  this.state.categories.map((category) => (
                    <>
                      <SimpleCell
                        className={`intro__category ${
                          this.state.chosenCategory === category.id &&
                          "intro__category--active"
                        }`}
                        onClick={() =>
                          this.setState({ chosenCategory: category.id })
                        }
                        description={category.description}
                      >
                        {category.title}
                      </SimpleCell>
                    </>
                  ))}

                <Text className="slide__text">{slide.description} </Text>
                {slide?.bullets && (
                  <ul>
                    {slide.bullets.map((bullet, n) => (
                      <li key={n}>
                        {" "}
                        <Text>{bullet}</Text>
                      </li>
                    ))}
                  </ul>
                )}
              </Div>

              <Div className="slide__button-holder">
                <Button
                  disabled={
                    this.state.slideIndex === 4 &&
                    this.state.chosenCategory === null
                      ? true
                      : false
                  }
                  onClick={() => {
                    if (
                      slide.button === "Сохранить" ||
                      slide.button === "Далее"
                    )
                      this.changeIndex(this.state.slideIndex + 1);

                    if (slide.button === "Продолжить") this.registerUser();
                  }}
                  mode="primary"
                  size="l"
                  stretched
                >
                  {slide.button}
                </Button>
              </Div>
            </div>
          ))}
        </Gallery>
      </Panel>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      { setIsOnboardingViewed, setTasks, setSnackbar },
      dispatch,
    ),
  };
}

export default connect(null, mapDispatchToProps)(withRouter(Intro));
