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
import ecosyslogo from "../img/ecosyslogo.png";
import rosmollogo from "../img/rosmollogo.png";
import townLogo from "../img/townlogo.png";
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
        { id: 0, title: "Оффлайн", description: "Гости и участники форума" },
        {
          id: 1,
          title: "Онлайн",
          description: "Для тех, кто наблюдает из дома",
        },
      ],
      chosenCategory: null,
      slides: [
        {
          description:
            "Всероссийский молодежный экологический форум «Экосистема» проходит в Вологодской области с 23 по 27 мая 2021 года в городе Череповец.",
          icon: townLogo,
          button: "Далее",
        },
        {
          title: "Какие задания есть?",
          description:
            "В рамках форума для онлайн и оффлайн продуманы дополнительные задания, выполняя их и соревнуясь с другими участниками форума ты сможешь выиграть подарки от организаторов.",
          icon: rosmollogo,
          button: "Далее",
        },
        {
          title: "Формат участия",
          description:
            "Перед стартом правильно выбери свою категорию участия, от этого зависят форматы заданий. По каждому заданию необходимо сдавать отчеты в личном кабинете. Проверка отчётов осуществляется вручную, поэтому возможны задержки.",
          icon: ecosyslogo,
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
                {this.state.slideIndex === 3 &&
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
                {slide?.icon && (
                  <img alt="Иконка" className="slide__image" src={slide.icon} />
                )}
                <Text className="slide__text">{slide.description} </Text>
              </Div>

              <Div className="slide__button-holder">
                <Button
                  disabled={
                    this.state.slideIndex === 3 &&
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
                  mode="commerce"
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
