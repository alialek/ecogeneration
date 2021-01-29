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
} from "@vkontakte/vkui";
import { withRouter } from "@happysanta/router";
import pensive from "../img/pensive.png";
import { Icon36CoinsStacks2Outline } from "@vkontakte/icons";
import { getRating } from "./../api/rest/rating";
import { setRating } from "../store/data/actions";
import RatingCell from "../components/RatingCell";

class Home extends React.Component {
  componentDidMount() {
    getRating()
      .then((res) => {
        this.props.setRating(res.data);
      })
      .catch((err) => {
        this.props.setRating({
          user: {
            first_name: "Mikhail",
            last_name: "Petrov",
            id: 1,
            rating: 2,
            score: 0,
            photo_200:
              "https://sun9-67.userapi.com/impg/OzIScl4zDNeW9klc3epv-LXWYtBcKi2niiBtZA/klF90QXGc5w.jpg?size=50x0&quality=96&crop=222,259,982,982&sign=c0fe2c3e5e87585341ed10ef1bcf65f8&ava=1",
          },
          users: [
            {
              first_name: "Mikhail",
              last_name: "Petrov",
              id: 1,
              rating: 1,
              score: 0,
              photo_200:
                "https://sun9-67.userapi.com/impg/OzIScl4zDNeW9klc3epv-LXWYtBcKi2niiBtZA/klF90QXGc5w.jpg?size=50x0&quality=96&crop=222,259,982,982&sign=c0fe2c3e5e87585341ed10ef1bcf65f8&ava=1",
            },
            {
              first_name: "Mikhail",
              last_name: "Petrov",
              id: 1,
              rating: 2,
              score: 0,
              photo_200:
                "https://sun9-67.userapi.com/impg/OzIScl4zDNeW9klc3epv-LXWYtBcKi2niiBtZA/klF90QXGc5w.jpg?size=50x0&quality=96&crop=222,259,982,982&sign=c0fe2c3e5e87585341ed10ef1bcf65f8&ava=1",
            },
          ],
        });
      });
  }
  render() {
    const { id, router, rating, user } = this.props;

    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={
            <PanelHeaderButton>
              <Icon36CoinsStacks2Outline />{" "}
              <Title level="2" className="point-counter" weight="bold">
                {user?.score}
              </Title>
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
