import React from "react";
import { Snackbar } from "@vkontakte/vkui";
import { store } from "./../index";
import { setSnackbar } from "./../store/data/actions";
/**
 *
 * @param {ReactComponent} icon
 * @param {String} text
 * @param {Function} closeEvent
 */

const showSnackbar = (
  icon,
  text,
  closeEvent = () => store.dispatch(setSnackbar(null)),
) => (
  <Snackbar
    action="Закрыть"
    onActionClick={closeEvent}
    onClose={closeEvent}
    before={icon}
  >
    {text}
  </Snackbar>
);

export default showSnackbar;
