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
import { Icon28InfoCircleOutline } from "@vkontakte/icons";
import { setNews } from "./../store/data/actions";
import { getNews } from "./../api/rest/news";
import NewsCell from "../components/NewsCell";
import { MODAL_INFO } from "../router";

class News extends React.Component {
  componentDidMount() {
    getNews()
      .then((res) => {
        this.props.setNews(res.data);
      })
      .catch((err) => this.props.setNews("error"));
  }
  render() {
    const { id, router, news, user } = this.props;

    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={
            <PanelHeaderButton onClick={() => router.pushModal(MODAL_INFO)}>
              <Icon28InfoCircleOutline />{" "}
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
