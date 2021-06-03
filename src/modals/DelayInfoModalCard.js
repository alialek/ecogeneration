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
            Специальный сезон проекта Экопоколение проходит с 5 по 13 июня 2021
            года в рамках Всероссийской акции "Эстафета #экоГТО". Акцию
            организует Всероссийская общественная организация
            волонтеров-экологов "Делай!" совместно с федеральным агентством по
            делам молодежи, Министерством просвещения и Министерством природных
            ресурсов и экологии в рамках реализации Национального проекта
            "Экология".
          </Text>
        </div>
      </ModalCard>
    );
  }
}

export default withRouter(AboutCard);
