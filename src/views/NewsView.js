import NewsPanel from "../panels/NewsPanel";

import React, { Component } from "react";
import { View } from "@vkontakte/vkui";
import { PANEL_NEWS } from "../router";

class News extends Component {
  render() {
    return (
      <View
        id={this.props.id}
        popout={this.props.popout}
        modal={this.props.modal}
        activePanel={this.props.activePanel}
      >
        <NewsPanel id={PANEL_NEWS} />
      </View>
    );
  }
}

export default News;
