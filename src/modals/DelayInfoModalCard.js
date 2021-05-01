import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { Button, ModalCard, Text } from "@vkontakte/vkui";

class AboutCard extends Component {
  render() {
    const { id, router } = this.props;
    return (
      <ModalCard
        id={id}
        onClose={() => router.popPage()}
        header="О нас"
        actions={
          <Button size="l" mode="secondary" onClick={() => router.popPage()}>
            Понятно
          </Button>
        }
      >
        <div className="description">
          <Text>
            Проект "Экопоколение" реализуется Всероссийской общественной
            организацией волонетров-экологов "Делай!" и государственной корпорацией развития "ВЭБ.РФ"
          </Text>
        </div>
      </ModalCard>
    );
  }
}

export default withRouter(AboutCard);
