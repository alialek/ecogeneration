import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ANDROID,
  Avatar,
  Footer,
  IOS,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  PanelSpinner,
  platform,
  RichCell,
  VKCOM,
  withModalRootContext,
} from "@vkontakte/vkui";
import { Icon24Cancel } from "@vkontakte/icons";
import { setSnackbar, setTasks } from "../store/data/actions";
import { getTeamById } from "./../api/rest/team";
import "./modal.css";

const AboutCard = ({ id, activeTeam, updateModalHeight }) => {
  const router = useRouter();

  const [team, setTeam] = useState(null);

  useLayoutEffect(() => {
    getTeamById({ id: activeTeam })
      .then((res) => {
        setTeam(res.data);
      })
      .catch(() => setTeam("error"));

    return setTeam(null);
  }, [activeTeam, setTeam]);

  useEffect(() => {
    updateModalHeight();
  }, [team]);

  const closeModal = () => {
    router.replaceModal(null);
  };
  return (
    <ModalPage
      id={id}
      onClose={closeModal}
      dynamicContentHeight
      className="TeamViewer"
      header={
        <ModalPageHeader
          left={
            (platform === ANDROID || platform === VKCOM) && (
              <PanelHeaderButton onClick={router.popPage}>
                <Icon24Cancel />
              </PanelHeaderButton>
            )
          }
          right={
            platform === IOS && (
              <PanelHeaderButton onClick={router.popPage}>
                Закрыть
              </PanelHeaderButton>
            )
          }
        >
          Команда {team?.title}
        </ModalPageHeader>
      }
    >
      <div className="full-height">
        {team === null && <PanelSpinner />}
        {team?.title && (
          <>
            {team.admins.map((item, i) => (
              <RichCell
                key={i}
                disabled
                before={<Avatar src={item.photo_200} />}
              >
                {`${item.first_name} ${item.last_name}`}
              </RichCell>
            ))}
            {team.users.map((item, i) => (
              <RichCell
                key={i}
                disabled
                before={<Avatar src={item.photo_200} />}
              >
                {`${item.first_name} ${item.last_name}`}
              </RichCell>
            ))}
            <Footer>{team.admins.length + team.users.length} чел. из 10</Footer>
          </>
        )}
      </div>
    </ModalPage>
  );
};

const mapStateToProps = (state) => {
  return {
    activeTeam: state.data.activeTeam,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setSnackbar, setTasks }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withModalRootContext(AboutCard));
