import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { ModalCard, Text } from "@vkontakte/vkui";
import "./card.css";

class AboutCard extends Component {
  render() {
    const { id, router } = this.props;
    return (
      <ModalCard
        id={id}
        onClose={() => router.popPage()}
        header="О нас"
        actions={[
          {
            title: "Понятно",
            mode: "primary",
            action: () => router.popPage(),
          },
        ]}
      >
        <div className="description">
          <Text>
            Проект "Экопоколение" реализуется Всероссийской общественной
            организацие волонетров-экологов "Делай!" и Федеральным агентством по
            делам молодежи "Росмолодежь"
          </Text>
        </div>
      </ModalCard>
    );
  }
}

export default withRouter(AboutCard);
