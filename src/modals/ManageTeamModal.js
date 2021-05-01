import React, { useState } from "react";
import { useRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ANDROID,
  Avatar,
  Button,
  Footer,
  IconButton,
  IOS,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Placeholder,
  platform,
  RichCell,
  Tabs,
  TabsItem,
} from "@vkontakte/vkui";
import monocle from "../img/monocle.png";
import {
  Icon20CancelCircleFillRed,
  Icon20CheckCircleFillGreen,
  Icon20ErrorCircleOutline,
  Icon20UserSlashOutline,
  Icon24Cancel,
} from "@vkontakte/icons";
import { setSnackbar, setTasks, setTeam } from "../store/data/actions";
import { POPOUT_SPINNER } from "../router";
import {
  leaveTeam,
  updateTeamAdmin,
  updateTeamMembers,
} from "./../api/rest/team";
import showSnackbar from "./../helpers/generateSnackbar";

const AboutCard = ({ team, id, setTeam, setSnackbar, user }) => {
  const router = useRouter();
  const [snackbar] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  const banFromTeam = (id) => {
    router.pushPopup(POPOUT_SPINNER);
    leaveTeam({ id, type: "ban" })
      .then((res) => {
        setTeam();
        setSnackbar(
          showSnackbar(
            <Icon20CheckCircleFillGreen />,
            "Участник удален из команды",
          ),
        );
      })
      .catch((err) =>
        setSnackbar(
          showSnackbar(
            <Icon20ErrorCircleOutline />,
            "Ошибка при удалении из команды",
          ),
        ),
      )
      .finally(() => {
        router.replacePopup(null);
      });
  };
  const updateAdmin = (id, type) => {
    router.pushPopup(POPOUT_SPINNER);
    updateTeamAdmin({ id, type })
      .then((res) => {
        setTeam();
        setSnackbar(
          showSnackbar(
            <Icon20CheckCircleFillGreen />,
            type === "add"
              ? "Участник повышен до звания Администратора"
              : "Участник лишен прав администратора",
          ),
        );
      })
      .finally(() => router.replacePopup(null));
  };
  const inviteMember = (id, type) => {
    router.pushPopup(POPOUT_SPINNER);
    updateTeamMembers({ id, type })
      .then((res) => {
        setTeam();
        setSnackbar(
          showSnackbar(
            <Icon20CheckCircleFillGreen />,
            type === "confirm" ? "Участник подтвержден" : "Участник удален",
          ),
        );
      })
      .catch((err) => {
        setSnackbar(
          showSnackbar(
            <Icon20CancelCircleFillRed />,
            err.response?.data?.status === "max_users"
              ? "В команде максимальное количество участников"
              : "Ошибка добавления в команду",
          ),
        );
      })
      .finally(() => router.replacePopup(null));
  };

  const closeModal = () => {
    router.replaceModal(null);
  };

  const isCreator = (id) => id === team?.creator?.id;

  const isAdmin = (id) =>
    team?.admins ? team.admins.some((admin) => admin.id === id) : false;

  const getStatus = (id) =>
    isCreator(id) ? "Cоздатель" : isAdmin(id) ? "Администратор" : "Участник";

  return (
    <ModalPage
      id={id}
      dynamicContentHeight
      settlingHeight={100}
      onClose={closeModal}
      header={
        <ModalPageHeader
          left={
            platform === ANDROID && (
              <PanelHeaderButton onClick={() => router.popPage()}>
                <Icon24Cancel />
              </PanelHeaderButton>
            )
          }
          right={
            platform === IOS && (
              <PanelHeaderButton onClick={() => router.popPage()}>
                Закрыть
              </PanelHeaderButton>
            )
          }
        >
          Команда
        </ModalPageHeader>
      }
    >
      <Tabs>
        <TabsItem
          onClick={() => setActiveTab("users")}
          selected={activeTab === "users"}
        >
          Все
        </TabsItem>
        <TabsItem
          onClick={() => setActiveTab("invitations")}
          selected={activeTab === "invitations"}
        >
          Заявки
        </TabsItem>
      </Tabs>
      <div style={{ minHeight: "50vh" }}>
        {activeTab === "users" && (
          <>
            {team.admins.map((item, i) => (
              <RichCell
                key={i}
                disabled
                caption={getStatus(item.id)}
                before={<Avatar src={item.photo_200} />}
                actions={
                  isCreator(item.id) ? (
                    ""
                  ) : (
                    <React.Fragment>
                      <Button
                        size="s"
                        onClick={() => updateAdmin(item.id, "delete")}
                      >
                        Понизить
                      </Button>
                    </React.Fragment>
                  )
                }
                after={
                  isCreator(item.id) ? (
                    ""
                  ) : (
                    <IconButton onClick={() => banFromTeam(item.id, "ban")}>
                      <Icon20UserSlashOutline />
                    </IconButton>
                  )
                }
              >
                {`${item.first_name} ${item.last_name}`}
              </RichCell>
            ))}
            {team.users.map((item, i) => (
              <RichCell
                key={i}
                disabled
                caption="Участник"
                before={<Avatar src={item.photo_200} />}
                actions={
                  <React.Fragment>
                    <Button
                      size="s"
                      onClick={() => updateAdmin(item.id, "add")}
                    >
                      Повысить
                    </Button>
                  </React.Fragment>
                }
                after={
                  <IconButton onClick={() => banFromTeam(item.id, "ban")}>
                    <Icon20UserSlashOutline />
                  </IconButton>
                }
              >
                {`${item.first_name} ${item.last_name}`}
              </RichCell>
            ))}
            <Footer>{team.admins.length + team.users.length} чел. из 10</Footer>
          </>
        )}
        {activeTab === "invitations" &&
          !!team.invitations.length &&
          team.invitations.map((item, i) => (
            <RichCell
              key={i}
              disabled
              before={<Avatar src={item.photo_200} />}
              actions={
                <React.Fragment>
                  <Button
                    mode="primary"
                    onClick={() => inviteMember(item.id, "confirm")}
                  >
                    Принять
                  </Button>
                  <Button
                    mode="secondary"
                    onClick={() => inviteMember(item.id, "reject")}
                  >
                    Отклонить
                  </Button>
                </React.Fragment>
              }
            >
              {`${item.first_name} ${item.last_name}`}
            </RichCell>
          ))}
        {activeTab === "invitations" && !team.invitations.length && (
          <Placeholder
            icon={
              <img alt="Заглушка" className="emoji-placeholder" src={monocle} />
            }
            header="Заявок на вступление нет"
          ></Placeholder>
        )}
        {snackbar}
      </div>
    </ModalPage>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.data.user,
    team: state.data.team,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setSnackbar, setTasks, setTeam }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutCard);
