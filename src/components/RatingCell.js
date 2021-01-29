import { Avatar, Card, SimpleCell, Title } from "@vkontakte/vkui";
import React from "react";
import "./ratingcell.css";

export default function ratingCell({ user }) {
  return (
    <Card className="rating-cell">
      <SimpleCell
        before={
          <div className="d-row align-center">
            <Title className="cell-number" level="3" weight="heavy">
              {user.rating}
            </Title>
            <Avatar className="cell-avatar" size={40} src={user.photo_200} />
          </div>
        }
        after={user.score}
      >
        {`${user.first_name} ${user.last_name}`}
      </SimpleCell>
    </Card>
  );
}
