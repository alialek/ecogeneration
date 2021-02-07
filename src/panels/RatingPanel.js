import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Panel,
  PanelHeader,
  Placeholder,
  PanelSpinner,
  Title,
  Div,
  PanelHeaderButton,
  FormStatus,
  Gallery,
  Text,
  Caption,
} from "@vkontakte/vkui";
import { withRouter } from "@happysanta/router";
import pensive from "../img/pensive.png";
import { Icon28InfoCircleOutline } from "@vkontakte/icons";
import { getRating } from "./../api/rest/rating";
import { setRating } from "../store/data/actions";
import RatingCell from "../components/RatingCell";
import { MODAL_INFO } from "../router";
import cup from "../img/cup.jpg";
import jbl from "../img/jbl.jpg";
import flip from "../img/flip.jpg";
import miband from "../img/miband.jpg";
import xiaomi from "../img/xiaomi.jpg";

class Home extends React.Component {
  componentDidMount() {
    getRating()
      .then((res) => {
        this.props.setRating(res.data);
      })
      .catch((err) => {
        this.props.setRating("error");
      });
  }
  render() {
    const { id, router, rating } = this.props;
    const prizes = [
      { img: cup, text: "Термокружка", description: "1-10 место" },
      {
        img: flip,
        text: "Портативная акустика JBL Flip 4",
        description: "1 место",
      },
      { img: xiaomi, text: "Xiaomi AirDots Pro", description: "2 место" },
      {
        img: miband,
        text: "Браслет Xiaomi Mi Band 5 Black",
        description: "3 место",
      },
      {
        img: jbl,
        text: "JBL Clip 3",
        description: "4-5 место",
      },
    ];

    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={
            <PanelHeaderButton onClick={() => router.pushModal(MODAL_INFO)}>
              <Icon28InfoCircleOutline />
            </PanelHeaderButton>
          }
        >
          Рейтинг
        </PanelHeader>
        <Div>
          <Title level="2" weight="medium">
            Призы победителям
          </Title>
        </Div>
        <Gallery slideWidth="90%" align="center" style={{ height: 180 }}>
          {prizes.map(({ img, text, description }, i) => (
            <div className="prize" key={i}>
              <div
                className="prize__photo"
                style={{
                  backgroundImage: `url(${img})`,
                }}
              />
              <div className="prize__description">
                <Text weight="medium">{text}</Text>
                <Caption level="2" weight="regular">
                  {description}
                </Caption>
              </div>
            </div>
          ))}
        </Gallery>
        {rating !== null && rating !== "error" && (
          <div>
            <Div>
              <Title level="2" weight="medium">
                Твоя позиция
              </Title>
              {/* <FormStatus header="Хочешь больше баллов?" mode="default">
                Делись записью на стене через приложение и получай 0.5 балла за
                приглашенного друга
              </FormStatus> */}
              <RatingCell user={rating.user} />
            </Div>
            <Div>
              <Title level="2" weight="medium">
                Общий рейтинг
              </Title>
              {rating.users.map((user) => (
                <RatingCell user={user} />
              ))}
            </Div>
          </div>
        )}
        {rating === null && <PanelSpinner />}
        {rating === "error" && (
          <Placeholder
            icon={
              <img alt="Заглушка" className="emoji-placeholder" src={pensive} />
            }
            header="Ошибка"
          >
            Упс, попробуйте обновить
          </Placeholder>
        )}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rating: state.data.rating,
    user: state.data.user,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setRating }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
