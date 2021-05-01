import { Icon16Users, Icon28UsersCircleFillBlue } from "@vkontakte/icons";
import { Avatar, Caption, Card, SimpleCell, Title } from "@vkontakte/vkui";
import React from "react";
import "./ratingcell.css";

export default function ratingCell({ user }) {
  const isUser = !!user?.first_name;

  return (
    <Card className="rating-cell">
      <SimpleCell
        disabled
        before={
          <div className="d-row align-center">
            <Title className="cell-number" level="3" weight="heavy">
              {user.rating}
            </Title>
            {isUser ? (
              <Avatar className="cell-avatar" size={40} src={user.photo_200} />
            ) : (
              <Icon28UsersCircleFillBlue className="cell-avatar" width={40} />
            )}
          </div>
        }
        after={user.score}
      >
        {isUser ? `${user.first_name} ${user.last_name}` : user.title}
        {!isUser && (
          <Caption
            level={3}
            className="d-flex rating-cell__users"
            weight={"medium"}
          >
            {`Участников: ${user.users}`}
          </Caption>
        )}
      </SimpleCell>
    </Card>
  );
}
