import { Avatar, SimpleCell } from "@vkontakte/vkui";
import React from "react";
import { Icon24Replay } from "@vkontakte/icons";
import { MODAL_TEST, MODAL_ABOUT } from "./../router/index";

const taskStates = {
  verified: "Выполнено",
  unverified: "Проверяется",
  decline: "Отклонено",
};

function getDoneIcon(status, score) {
  switch (status) {
    case "verified":
      return score;
    case "unverified":
      return "";
    case "decline":
      return <Icon24Replay />;
  }
}

export default function TaskCard({ task, type }) {
  return (
    <SimpleCell
      disabled={task.block}
      style={{ opacity: task.block && 0.3 }}
      before={<Avatar size={48} src={task.image} />}
      after={
        type === "done"
          ? getDoneIcon(task.status, task.score)
          : type === "new"
          ? task.max_score
          : ""
      }
      description={type === "done" ? taskStates[task.status] : task.description}
    >
      {task.title}
    </SimpleCell>
  );
}
