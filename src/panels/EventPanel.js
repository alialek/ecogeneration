import React, { useState, useEffect } from "react";
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
  Headline,
  Card,
  Avatar,
  MiniInfoCell,
  SimpleCell,
  FormLayout,
  Counter,
  FormItem,
} from "@vkontakte/vkui";
import { withRouter } from "@happysanta/router";
import pensive from "../img/pensive.png";
import {
  Icon20Info,
  Icon20WorkOutline,
  Icon28InfoCircleOutline,
} from "@vkontakte/icons";
import { getRating } from "../api/rest/rating";
import { setActiveTask, setRating, setTest } from "../store/data/actions";
import RatingCell from "../components/RatingCell";
import {
  MODAL_INFO,
  MODAL_VIEW_TEAM,
  MODAL_TEST,
  MODAL_ABOUT,
  MODAL_RATING,
} from "../router";
import rukzak from "../img/rukzak.jpg";
import stickers from "../img/stickers.jpg";
import jbl from "../img/jbl.jpg";
import yaplus from "../img/yaplus.jpg";
import miband from "../img/miband.jpg";
import merch from "../img/merch.jpg";
import { setActiveTeam } from "../store/data/actions";
import TaskCard from "./../components/TaskCard";
import monocle from "../img/monocle.png";
import party from "../img/party.png";

const Event = ({
  id,
  router,
  rating,
  user,
  profile,
  setActiveTeam,
  setRating,
  setActiveTask,
  setTest,
  tasks,
}) => {
  const [activeTypeTab, setActiveTypeTab] = useState("users");
  const [activeTab, setActiveTab] = useState("new");
  const showTeam = (id) => {
    if (activeTypeTab === "teams") {
      setActiveTeam(id);
      router.pushModal(MODAL_VIEW_TEAM);
    }
  };
  useEffect(() => {
    getRating()
      .then((res) => {
        setRating(res.data);
      })
      .catch((err) => {
        setRating("error");
      });
  }, []);

  const getAmountOfDeclined = () => {
    console.log(tasks);
    return tasks.ecogames.done.reduce(
      (acc, val) => (val.status === "decline" ? acc + 1 : acc),
      0,
    );
  };
  const getClickAction = (task) => {
    if (task.block) return () => {};

    return task.typeTask === "test"
      ? openModal(task, MODAL_TEST)
      : openModal(task, MODAL_ABOUT);
  };

  const openModal = (task, page) => {
    setActiveTask(task);
    if (task.typeTask === "test") setTest(task.test);
    router.pushModal(page);
  };

  const openRatingModal = () => {
    router.pushModal(MODAL_RATING);
  };

  const prizes = {
    0: [
      {
        img: miband,
        text: "Браслет Xiaomi Mi Band 5 Black",
        description: "1 место",
      },
      {
        img: jbl,
        text: "JBL Clip 3",
        description: "2-3 место",
      },
      {
        img: stickers,
        text: "Набор из 3 стикерпаков на выбор",
        description: "4-15 место",
      },
    ],
    1: [
      {
        img: miband,
        text: "Браслет Xiaomi Mi Band 5 Black",
        description: "1 место",
      },
      {
        img: jbl,
        text: "JBL Clip 3",
        description: "2-3 место",
      },
      {
        img: stickers,
        text: "Набор из 3 стикерпаков на выбор",
        description: "4-15 место",
      },
    ],
    2: [
      {
        img: rukzak,
        text: "Рюкзак из баннеров",
        description: "1 место",
      },
      {
        img: yaplus,
        text: "Яндекс.Плюс на 1 год",
        description: "2-4 место",
      },
      {
        img: stickers,
        text: "Набор из 3 стикерпаков на выбор",
        description: "5-10 место",
      },
    ],
  };

  const teamPr = {
    2: [
      {
        img: merch,
        text: "Набор атрибутики от проекта Экопоколение, Делай! и ВЭБ.РФ",
        description: "1 место",
      },
    ],
  };

  console.log(rating);

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
        ЭкоИгры
      </PanelHeader>

      {rating !== null &&
        tasks !== null &&
        tasks !== "error" &&
        rating !== "error" && (
          <div>
            <Div>
              <Title level={1} weight="bold">
                4-й сезон - ЭкоЛето
              </Title>
              <Headline weight="regular">с 1 по 21 июля</Headline>
            </Div>
            <Div>
              <Title level={3} weight="bold">
                Мой профиль
              </Title>
            </Div>
            <SimpleCell disabled before={<Avatar src={profile.photo_200} />}>
              {profile.first_name} {profile.last_name}
            </SimpleCell>
            <MiniInfoCell before={<Icon20WorkOutline />}>
              Баллов: {user.score}
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20WorkOutline />}>
              Место в рейтинге: {rating?.users?.user?.rating}
            </MiniInfoCell>
            <MiniInfoCell
              before={<Icon20Info />}
              mode="more"
              onClick={openRatingModal}
            >
              Рейтинг участников
            </MiniInfoCell>
            <Div>
              <Title level={3} weight="bold">
                Призы
              </Title>
            </Div>
            <Gallery
              slideWidth="90%"
              align="center"
              className="rating__gallery"
            >
              {activeTypeTab === "teams" &&
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
                ))}
              {activeTypeTab === "users" &&
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
            <Tabs>
              <TabsItem
                onClick={() => setActiveTab("new")}
                selected={activeTab === "new"}
              >
                Задания
              </TabsItem>
              <TabsItem
                onClick={() => setActiveTab("done")}
                selected={activeTab === "done"}
              >
                Завершенные{" "}
                {getAmountOfDeclined() > 0 && (
                  <Counter className="declined-indicator">
                    {getAmountOfDeclined()}
                  </Counter>
                )}
              </TabsItem>
            </Tabs>
            {activeTab === "new" && (
              <FormLayout>
                {activeTab === "new" &&
                Object.keys(tasks.personal.new).length ? (
                  Object.keys(tasks.personal.new).map((title, n) => (
                    <FormItem key={n} top={title}>
                      {tasks.personal.new[title].map((task, i) => (
                        <div key={i} onClick={() => getClickAction(task)}>
                          <TaskCard task={task} type={activeTab} />
                        </div>
                      ))}
                    </FormItem>
                  ))
                ) : (
                  <Placeholder
                    icon={
                      <img
                        alt="Заглушка"
                        className="emoji-placeholder"
                        src={party}
                      />
                    }
                    header="Все выполнено"
                  >
                    Скоро появятся новые задания!
                  </Placeholder>
                )}
              </FormLayout>
            )}
            {activeTab === "done" &&
              (tasks.personal.done.length ? (
                tasks.personal.done.map((task, n) => (
                  <div key={n} onClick={() => getClickAction(task)}>
                    <TaskCard task={task} type={activeTab} />
                  </div>
                ))
              ) : (
                <Placeholder
                  icon={
                    <img
                      alt="Заглушка"
                      className="emoji-placeholder"
                      src={monocle}
                    />
                  }
                  header="Заданий нет"
                >
                  Выполняйте задания, чтобы заработать баллы
                </Placeholder>
              ))}
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
};

const mapStateToProps = (state) => {
  return {
    rating: state.data.rating,
    user: state.data.user,
    profile: state.data.profile,
    tasks: state.data.tasks,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      { setRating, setActiveTeam, setActiveTask, setTest },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Event));
