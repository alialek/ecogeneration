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
} from "@vkontakte/vkui";
import { withRouter } from "@happysanta/router";
import pensive from "../img/pensive.png";
import { Icon28InfoCircleOutline } from "@vkontakte/icons";
import { getRating } from "./../api/rest/rating";
import { setRating } from "../store/data/actions";
import RatingCell from "../components/RatingCell";
import { MODAL_INFO } from "../router";

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
        {rating !== null && rating !== "error" && (
          <div>
            <Div>
              <Title level="2" weight="medium">
                Твоя позиция
              </Title>
              <FormStatus header="Хочешь больше баллов?" mode="default">
                Делись записью на стене через приложение и получай 0.5 балла за
                приглашенного друга
              </FormStatus>
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
