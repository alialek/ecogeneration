import { Panel, Div, Button, Gallery, Title, Text } from "@vkontakte/vkui";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import earth from "../img/earth.png";
import notebook from "../img/notebook.png";
import "./intro.css";
import { withRouter } from "@happysanta/router";
import { setIsOnboardingViewed } from "./../store/data/actions";
import { setIntroViewed } from "../api/vk";

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,

      slides: [
        {
          title: "Что такое Экопоколение?",
          description:
            "Привет! На протяжении следующих трех недель тебе предстоит научиться азам ответственного потребления, узнать о главных экологических проблемах, а также закрепить полученные навыки и выполнить ряд заданий.",
          icon: earth,
          button: "Далее",
          isValid: () => true,
        },
        {
          title: "Какие задания есть?",
          description:
            "Приступай к заданиям и не бойся трудностей, и не забудь посетить вебинары, где будет рассказана теоретическая часть, которую тебе предстоит применить на практике!",
          icon: notebook,
          button: "Продолжить",
          isValid: () => true,
        },
      ],
    };
  }

  changeIndex(slideIndex) {
    this.setState({ slideIndex });
  }

  registerUser() {
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
          style={{ width: "100%", height: "100vh" }}
        >
          {this.state.slides.map((slide, i) => (
            <div key={i} className="slide">
              <Div>
                <Title level="1" className="slide__title" weight="semibold">
                  {slide.title}
                </Title>
              </Div>
              {slide?.icon && (
                <Div className="d-col align-center">
                  <div className="blob-holder">
                    {" "}
                    <div className="blob"></div>{" "}
                    <img
                      alt="Иконка"
                      className="slide__image"
                      src={slide.icon}
                    />
                  </div>

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
              )}

              <Div className="slide__button-holder">
                <Button
                  onClick={() => {
                    if (
                      slide.button === "Сохранить" ||
                      slide.button === "Далее"
                    )
                      slide.isValid()
                        ? this.changeIndex(this.state.slideIndex + 1)
                        : slide.fallBack();

                    if (slide.button === "Продолжить") this.registerUser();
                  }}
                  mode="primary"
                  size="xl"
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

const mapStateToProps = (state) => {
  return {};
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setIsOnboardingViewed }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Intro));
