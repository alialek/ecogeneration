import TeamPanel from "../panels/TeamPanel";

import React, { Component } from "react";
import { View } from "@vkontakte/vkui";
import { PANEL_TEAM } from "../router";

const Team = ({ id, popout, modal, activePanel }) => {
  return (
    <View id={id} popout={popout} modal={modal} activePanel={activePanel}>
      <TeamPanel id={PANEL_TEAM} />
    </View>
  );
};

export default Team;
