import EventPanel from "../panels/EventPanel";

import React, { Component } from "react";
import { View } from "@vkontakte/vkui";
import { PANEL_EVENT } from "../router";

class Event extends Component {
  render() {
    return (
      <View
        id={this.props.id}
        popout={this.props.popout}
        modal={this.props.modal}
        activePanel={this.props.activePanel}
      >
        <EventPanel id={PANEL_EVENT} />
      </View>
    );
  }
}

export default Event;
