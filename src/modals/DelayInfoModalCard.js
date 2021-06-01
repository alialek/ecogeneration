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
            3 сезон проекта действует в рамках Всероссийского молодёжного
            экологического форума "Экосистема"{" "}
          </Text>
          <br />
          <Text>
            {" "}
            Организаторами форума является Федеральное агентство по делам
            молодежи и Правительство Вологодской области
          </Text>
        </div>
      </ModalCard>
    );
  }
}

export default withRouter(AboutCard);
