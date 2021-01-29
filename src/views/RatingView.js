import RatingPanel from "../panels/RatingPanel";

import React, { Component } from "react";
import { View } from "@vkontakte/vkui";
import { PANEL_RATING } from "../router";

class Raiting extends Component {
  render() {
    return (
      <View
        id={this.props.id}
        popout={this.props.popout}
        modal={this.props.modal}
        activePanel={this.props.activePanel}
      >
        <RatingPanel id={PANEL_RATING} />
      </View>
    );
  }
}

export default Raiting;
