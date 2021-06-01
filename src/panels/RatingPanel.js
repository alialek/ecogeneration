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
  Gallery,
  Text,
  Caption,
  Tabs,
  TabsItem,
  Separator,
} from "@vkontakte/vkui";
import { withRouter } from "@happysanta/router";
import pensive from "../img/pensive.png";
import { Icon28InfoCircleOutline } from "@vkontakte/icons";
import { getRating } from "./../api/rest/rating";
import { setRating } from "../store/data/actions";
import RatingCell from "../components/RatingCell";
import { MODAL_INFO, MODAL_VIEW_TEAM } from "../router";
import offline1 from "../img/1-offine.jpg";
import offline25 from "../img/2-5-offline.jpg";
import offline69 from "../img/6-9-offline.jpg";
import online1 from "../img/1-online.jpg";
import online2 from "../img/2-online.jpg";
import { setActiveTeam } from "./../store/data/actions";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "users",
    };
    this.showTeam = this.showTeam.bind(this);
  }
  showTeam(id) {
    if (this.state.activeTab === "teams") {
      this.props.setActiveTeam(id);
      this.props.router.pushModal(MODAL_VIEW_TEAM);
    }
  }
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
    const { id, router, rating, user } = this.props;

    const prizes = {
      0: [
        {
          img: offline1,
          text: "Толстовка и поясная сумка",
          description: "1 место",
        },
        {
          img: offline25,
          text: "Толстовка",
          description: "2-5 место",
        },
        {
          img: offline69,
          text: "Поясная сумка",
          description: "6-9 место",
        },
      ],
      1: [
        {
          img: online1,
          text: "Сертификат",
          description: "1 место",
        },
        {
          img: online2,
          text: "Мерч экосистемы",
          description: "2-25 место",
        },
      ],
    };

    // const teamPr = {
    //   2: [
    //     {
    //       img: merch,
    //       text: "Набор атрибутики от проекта Экопоколение, Делай! и ВЭБ.РФ",
    //       description: "1 место",
    //     },
    //   ],
    // };

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
        {/* 
        <Tabs>
          <TabsItem
            onClick={() => this.setState({ activeTab: "users" })}
            selected={this.state.activeTab === "users"}
          >
            Участники
          </TabsItem>
          <TabsItem
            onClick={() => this.setState({ activeTab: "teams" })}
            selected={this.state.activeTab === "teams"}
          >
            Команды
          </TabsItem>
        </Tabs> */}
        <Div>
          <Title level="2" weight="medium">
            Призы победителям
          </Title>
        </Div>

        {rating !== null && rating !== "error" && (
          <div>
            <Gallery
              slideWidth="90%"
              align="center"
              className="rating__gallery"
            >
              {/* {this.state.activeTab === "teams" &&
                teamPr[2].map(({ img, text, description, id }, i) => (
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
                ))} */}
              {this.state.activeTab === "users" &&
                prizes[user.category].map(({ img, text, description }, i) => (
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
            <Div>
              {!!rating[this.state.activeTab].user?.rating && (
                <RatingCell user={rating[this.state.activeTab].user} />
              )}
            </Div>
            {!!rating[this.state.activeTab].user?.rating && <Separator />}
            <Div>
              {rating[this.state.activeTab].all.map((user, i) => (
                <div key={i} onClick={() => this.showTeam(user.id)}>
                  <RatingCell user={user} />
                </div>
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
    ...bindActionCreators({ setRating, setActiveTeam }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
