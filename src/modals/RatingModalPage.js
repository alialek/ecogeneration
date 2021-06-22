import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ANDROID,
  Avatar,
  Div,
  Footer,
  IOS,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  PanelSpinner,
  platform,
  RichCell,
  Separator,
  Title,
  VKCOM,
  withModalRootContext,
} from "@vkontakte/vkui";
import { Icon24Cancel } from "@vkontakte/icons";
import { setSnackbar, setTasks } from "../store/data/actions";
import { getTeamById } from "../api/rest/team";
import "./modal.css";
import RatingCell from "./../components/RatingCell";

const RatingModalPage = ({ id, rating, updateModalHeight }) => {
  const router = useRouter();
  const [activeTypeTab, setActiveTypeTab] = useState("users");

  useEffect(() => {
    updateModalHeight();
  }, []);

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
          Рейтинг
        </ModalPageHeader>
      }
    >
      <div className="full-height">
        <Div>
          <Title level={2}>Моя позиция</Title>
          {!!rating[activeTypeTab].user?.rating && (
            <RatingCell user={rating[activeTypeTab].user} />
          )}
        </Div>
        {!!rating[activeTypeTab].user?.rating && <Separator />}
        <Div>
          <Title level={2}>Общий рейтинг</Title>
          {rating[activeTypeTab].all.map((user, i) => (
            <div key={i}>
              <RatingCell user={user} />
            </div>
          ))}
        </Div>
      </div>
    </ModalPage>
  );
};

const mapStateToProps = (state) => {
  return {
    rating: state.data.rating,
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
)(withModalRootContext(RatingModalPage));
