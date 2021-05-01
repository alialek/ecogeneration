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
  Button,
  Tabs,
  TabsItem,
  IconButton,
  SimpleCell,
  Counter,
  CellButton,
  FormItem,
  FormLayout,
  Caption,
  FormStatus,
} from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import "./home.css";
import pensive from "../img/pensive.png";
import {
  Icon20Cancel,
  Icon24GearOutline,
  Icon28AddOutline,
  Icon28UsersCircleFillBlue,
  Icon36CoinsStacks2Outline,
  Icon56UsersOutline,
} from "@vkontakte/icons";
import { setTeam } from "../store/data/actions";
import {
  MODAL_CREATE_TEAM,
  MODAL_TEST,
  MODAL_ABOUT,
  MODAL_MANAGE_TEAM,
  POPOUT_TEAM_LEAVE_CONFIRM,
} from "../router";
import TaskCard from "./../components/TaskCard";
import monocle from "../img/monocle.png";
import party from "../img/party.png";
import { setTest, setActiveTask } from "./../store/data/actions";
import { shareInviteLink } from "./../api/vk";
import { POPOUT_TEAM_DOWNGRADE_CONFIRM } from "./../router/index";

const Team = ({ id, user, setTeam, team, tasks, setActiveTask, setTest }) => {
  const [activeTab, setActiveTab] = useState("new");

  const router = useRouter();
  const openCreateTeamModal = () => {
    router.pushModal(MODAL_CREATE_TEAM);
  };
  useEffect(() => {
    setTeam();
  }, [setTeam]);

  const isCreator = user.id === team?.creator?.id;
  const amountOfUsers = team?.admins
    ? team.admins.length + team.users.length
    : 0;
  const isAdmin = team?.admins
    ? team.admins.some((admin) => admin.id === user.id)
    : false;

  const getClickAction = (task) => {
    if (task.block) return () => {};
    console.log(
      task.typeTask === "test"
        ? openModal(task, MODAL_TEST)
        : openModal(task, MODAL_ABOUT),
    );
    return task.typeTask === "test"
      ? openModal(task, MODAL_TEST)
      : openModal(task, MODAL_ABOUT);
  };

  const changeTeam = () => {
    if (isCreator) return router.pushPopup(POPOUT_TEAM_DOWNGRADE_CONFIRM);
    return router.pushPopup(POPOUT_TEAM_LEAVE_CONFIRM);
    // return leaveTeam({ id: team.id, type: "exit" }).then((res) => setTeam());
  };

  const openModal = (task, page) => {
    setActiveTask(task);
    if (task.typeTask === "test") setTest(task.test);
    router.pushModal(page);
  };

  const openSettings = () => {
    setTeam();
    router.pushModal(MODAL_MANAGE_TEAM);
  };

  const getStatus = isCreator
    ? "Вы создатель"
    : isAdmin
    ? "Вы администратор"
    : "Вы участник";

  const getAmountOfDeclined = () => {
    return tasks.user.team.reduce(
      (acc, val) => (val.status === "decline" ? acc + 1 : acc),
      0,
    );
  };
  return (
    <Panel id={id}>
      <PanelHeader
        separator={false}
        left={
          team?.title && (
            <div className="d-row align-center panel__coins">
              <Icon36CoinsStacks2Outline width={20} />
              <Title level="3" className="point-counter" weight="medium">
                {team?.score}
              </Title>
            </div>
          )
        }
      >
        Команда
      </PanelHeader>
      {team !== null && team !== "error" && (
        <>
          {!!Object.keys(team).length && (
            <>
              <SimpleCell
                disabled
                before={<Icon28UsersCircleFillBlue width={60} height={60} />}
                after={
                  isAdmin && (
                    <IconButton onClick={openSettings}>
                      <Icon24GearOutline />
                    </IconButton>
                  )
                }
                description={getStatus}
              >
                {team.title}
              </SimpleCell>
              {amountOfUsers < 10 && (
                <CellButton
                  onClick={() => shareInviteLink(team.id, user.id)}
                  before={<Icon28AddOutline />}
                >
                  Пригласить друга
                </CellButton>
              )}
              <CellButton
                mode="danger"
                onClick={changeTeam}
                before={<Icon20Cancel width={28} height={28} />}
              >
                {isCreator ? "Удалить команду" : "Покинуть команду"}
              </CellButton>
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
                  <Div>
                    <FormStatus
                      mode="default"
                      header="Создайте группу для отчетов"
                    >
                      Мы рекомендуем публиковать отчеты в открытой группе
                      ВКонтакте
                    </FormStatus>
                  </Div>
                  {activeTab === "new" && Object.keys(tasks.all.team).length ? (
                    Object.keys(tasks.all.team).map((title, n) => (
                      <FormItem key={n} top={title}>
                        {tasks.all.team[title].map((task, i) => (
                          <div key={i} onClick={() => getClickAction(task)}>
                            <TaskCard task={task} type={activeTab} />
                          </div>
                        ))}{" "}
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
                (tasks.user.team.length ? (
                  tasks.user.team.map((task, n) => (
                    <div onClick={() => getClickAction(task)} key={n}>
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
            </>
          )}
          {!Object.keys(team).length && (
            <Placeholder
              stretched
              icon={<Icon56UsersOutline />}
              header="Создать команду"
            >
              <>
                Проходите задания вместе с друзьями и участвуйте в общем
                рейтинге
                <br />
                {user.category === 2 && (
                  <Button
                    size="m"
                    style={{ marginTop: 8 }}
                    onClick={openCreateTeamModal}
                  >
                    Создать команду
                  </Button>
                )}{" "}
                {user.category !== 2 && (
                  <Caption style={{ marginTop: 8 }} level={2}>
                    Команды могут создавать только участники старшей категории
                  </Caption>
                )}
              </>
            </Placeholder>
          )}
        </>
      )}
      {team === null && <PanelSpinner />}
      {team === "error" && (
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
    tasks: state.data.tasks,
    team: state.data.team,
    user: state.data.user,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setTeam, setActiveTask, setTest }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Team);
