import React, { useState } from "react";
import { useRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ANDROID,
  Button,
  Div,
  FormStatus,
  IOS,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  platform,
  SimpleCell,
  withModalRootContext,
} from "@vkontakte/vkui";
import {
  Icon20CheckCircleFillGreen,
  Icon20ErrorCircleOutline,
  Icon24Cancel,
} from "@vkontakte/icons";
import { setSnackbar, setTasks, setUser } from "../store/data/actions";
import { reg } from "./../api/rest/reg";
import { getTasks } from "./../api/rest/tasks";
import showSnackbar from "./../helpers/generateSnackbar";

const EditUserModal = ({ id, user, setTasks, setSnackbar, setUser }) => {
  const router = useRouter();

  const [chosenCategory, setChosenCategory] = useState(user.category);

  const saveSettings = () => {
    reg({ id: chosenCategory }).then(() => {
      getTasks()
        .then((res) => {
          setTasks(res.data);
          setSnackbar(
            showSnackbar(<Icon20CheckCircleFillGreen />, "Категория изменена!"),
          );
          router.replaceModal(null);
          setUser({ ...user, category: chosenCategory });
        })
        .catch(() => {
          this.props.setTasks("error");
          setSnackbar(
            showSnackbar(
              <Icon20ErrorCircleOutline />,
              "Ошибка, не получилось изменить категорию",
            ),
          );
        });
    });
  };

  const closeModal = () => {
    router.replaceModal(null);
  };
  const categories = [
    { id: 0, title: "Оффлайн", description: "Гости и участники форума" },
    {
      id: 1,
      title: "Онлайн",
      description: "Для тех, кто наблюдает из дома",
    },
  ];
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
          Сменить категорию
        </ModalPageHeader>
      }
    >
      <Div>
        <FormStatus header="Внимание!" mode="error">
          При смене категории весь прогресс сбросится!
        </FormStatus>
      </Div>
      <Div>
        {categories.map((category) => (
          <>
            <SimpleCell
              className={`intro__category w-auto ${
                chosenCategory === category.id && "intro__category--active"
              } ${
                user.category === category.id && "intro__category--disabled"
              }`}
              onClick={() => setChosenCategory(category.id)}
              description={category.description}
            >
              {category.title} {user.category === category.id && "(Выбрано)"}
            </SimpleCell>
          </>
        ))}
      </Div>
      <Div>
        <Button size="l" stretched onClick={saveSettings}>
          Сохранить
        </Button>
      </Div>
    </ModalPage>
  );
};

const mapStateToProps = (state) => {
  return {
    activeTeam: state.data.activeTeam,
    user: state.data.user,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setSnackbar, setTasks, setUser }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withModalRootContext(EditUserModal));
