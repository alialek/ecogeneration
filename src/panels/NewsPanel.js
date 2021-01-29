import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Placeholder,
  PanelSpinner,
  Title,
  Div,
} from "@vkontakte/vkui";
import { withRouter } from "@happysanta/router";
import "./home.css";
import pensive from "../img/pensive.png";
import { Icon36CoinsStacks2Outline } from "@vkontakte/icons";
import { setNews } from "./../store/data/actions";
import { getNews } from "./../api/rest/news";
import NewsCell from "../components/NewsCell";

class News extends React.Component {
  componentDidMount() {
    getNews()
      .then((res) => {
        this.props.setNews({});
      })
      .catch((err) =>
        this.props.setNews([
          {
            link: "https://vk.com/randomcoffee",
            image:
              "https://avatars.mds.yandex.net/get-altay/200322/2a0000015b2ea7222b678aa03bc6ab9c3ce1/XXL",
            title: "Кто проживает на дне океана?",
            description:
              "Режиссёр: Степан Бурнашев. В ролях: Федот Львов, Илья Портнягин, Ирина Никифорова, Василий Борисов, Иван Попов, Феодосия Иванова, Дмитрий ",
          },
          {
            link: "https://vk.com/randomcoffee",
            image:
              "https://avatars.mds.yandex.net/get-altay/200322/2a0000015b2ea7222b678aa03bc6ab9c3ce1/XXL",
            title: "Кто проживает на дне океана?",
            description:
              "Режиссёр: Степан Бурнашев. В ролях: Федот Львов, Илья Портнягин, Ирина Никифорова, Василий Борисов, Иван Попов, Феодосия Иванова, Дмитрий ",
          },
        ]),
      );
  }
  render() {
    const { id, router, news, user } = this.props;

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
          Новости
        </PanelHeader>
        {news !== null && news !== "error" && (
          <Div>
            <Title level="2" weight="medium">
              Наши новости
            </Title>
            {news.map((article, i) => (
              <NewsCell key={i} news={article} />
            ))}
          </Div>
        )}
        {news === null && <PanelSpinner />}
        {news === "error" && (
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
    news: state.data.news,
    user: state.data.user,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setNews }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(News));
