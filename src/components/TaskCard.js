import { Avatar, SimpleCell } from "@vkontakte/vkui";
import React from "react";
import { Icon24Replay } from "@vkontakte/icons";

const taskStates = {
  verified: "Выполнено",
  unverified: "Проверяется",
  decline: "Отклонено",
};

function getAmount(type) {
  return type === "offline" ? "+10" : "+5";
}
function getDoneIcon(status, type) {
  switch (status) {
    case "verified":
      return getAmount(type);
    case "unverified":
      return "";
    case "decline":
      return <Icon24Replay />;
  }
}

export default function TaskCard({ task, type }) {
  return (
    <SimpleCell
      before={<Avatar size={48} src={task.image} />}
      after={
        type === "done"
          ? getDoneIcon(task.status, task.type)
          : type === "new"
          ? getAmount(task.type)
          : ""
      }
      description={type === "done" ? taskStates[task.status] : task.description}
    >
      {task.title}
    </SimpleCell>
  );
}
