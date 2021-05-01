import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import {
  Button,
  FormItem,
  FormLayout,
  Input,
  ModalCard,
} from "@vkontakte/vkui";
import emojiRegex from "emoji-regex";
import { updateTeam } from "../api/rest/team";
import { connect } from "react-redux";
import { setSnackbar, setTeam } from "../store/data/actions";
import { bindActionCreators } from "redux";
import { Icon20CheckCircleFillGreen } from "@vkontakte/icons";
import showSnackbar from "./../helpers/generateSnackbar";

class TeamCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      image: "",
    };

    this.createTeam = this.createTeam.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  checkEmoji(text) {
    const emoji = emojiRegex().exec(text);
    return emoji ? emoji[0] : false;
  }
  onChange(e) {
    const { name, value } = e.currentTarget;

    this.setState({ [name]: value });
  }
  checkIsCorrect() {
    const { title } = this.state;
    return title;
  }
  createTeam() {
    const { title, description, image } = this.state;
    if (title) {
      updateTeam({ type: "create", title, description, image }).then((res) => {
        this.props.router.popPage();
        this.props.setTeam();

        this.props.setSnackbar(
          showSnackbar(<Icon20CheckCircleFillGreen />, "Команда создана"),
        );
      });
    }
  }
  render() {
    const { id, router } = this.props;
    return (
      <ModalCard
        id={id}
        onClose={() => router.popPage()}
        header="Новая команда"
        actions={
          <Button
            size="l"
            mode={this.checkIsCorrect ? "primary" : "secondary"}
            disabled={!this.checkIsCorrect}
            onClick={this.createTeam}
          >
            Создать команду
          </Button>
        }
      >
        <FormLayout>
          <FormItem
            top="Название команды"
            status={this.state.title ? "valid" : "error"}
            bottom={
              this.state.title
                ? "Название введено верно"
                : "Пожалуйста, введите название"
            }
          >
            {" "}
            <Input
              type="title"
              name="title"
              value={this.state.title}
              onChange={this.onChange}
            />
          </FormItem>
        </FormLayout>
      </ModalCard>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setTeam, setSnackbar }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(withRouter(TeamCard));
