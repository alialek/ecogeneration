import { Avatar, Link, SimpleCell } from "@vkontakte/vkui";
import React from "react";
import "./newscell.css";
export default function NewsCell({ news }) {
  return (
    <Link className="news-cell" href={news.link} target="_blank">
      <SimpleCell
        before={<Avatar size="70px" mode="image" src={news.image} />}
        description={news.description}
      >
        {news.title}
      </SimpleCell>
    </Link>
  );
}
