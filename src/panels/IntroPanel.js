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
import econational from "../img/eco - national project.png";
import gtoeko from "../img/GTOEKO.png";
import delayLogo from "../img/logo_2.png";
import rosprirodnadzor from "../img/rosprirnadzor.png";

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      categories: [
        { id: 0, title: "Младшая", description: "Младшая школа (7-11 лет)" },
        {
          id: 1,
          title: "Средняя",
          description: "Средняя и старшая школа (12 - 16 лет)",
        },
        {
          id: 2,
          title: "Старшая",
          description: "Молодёжь (17 +)",
        },
      ],
      chosenCategory: null,
      slides: [
        {
          title: "Хеллоу!",
          description:
            'Сегодня мы запускаем новый сезон совместно с международной детско-юношеской премией "Экология - дело каждого" от Росприроднадзора. ',
          icon: earth,
          button: "Далее",
        },
        {
          title:
            "Для того чтобы принять участие в 3 сезоне, тебе необходимо выбрать свою возрастную категорию.",

          button: "Далее",
        },
        {
          title: "Младшая и средняя школа",
          description:
            'Для младшей и средней школы  (от 7 до 16) необходимо выполнить задания "Экопоколения", которые соответствуют номинациям премии "Экология - дело каждого"',
          icon: rosprirodnadzor,
          button: "Далее",
        },
        {
          title: "Старшие участники",
          description:
            'Для молодёжной возрастной группы (17+) - пройти эстафету #экоГТО на тему национального проекта "Экология" (17 +)',
          icon: econational,
          button: "Далее",
        },
        {
          title: "Обрати внимание",
          description:
            "Для младшей и средней возрастных категорий в этом сезоне решением задания является участие в номинациях Премии, а в общем зачёте побеждает тот, кто выполнил больше заданий",
          icon: medal,
          button: "Далее",
        },
        {
          title: "Желаем удачи",
          description:
            'По желанию, младшие участники также могут сдать #экоГТО. Задания подготовлены при поддержке движения "Друзья Заповедных Островов" и "Федеральным детским эколого-биологическим центром"',
          icon: gtoeko,
          button: "Далее",
        },
        {
          title: 'Становись волонтёром-экологом вместе с "Делай!"',
          description: "",
          icon: delayLogo,
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
          isDraggable={false}
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
                {this.state.slideIndex === 1 &&
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
                    this.state.slideIndex === 1 &&
                    this.state.chosenCategory === null
                      ? true
                      : false
                  }
                  onClick={() => {
                    if (slide.button === "Далее")
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
