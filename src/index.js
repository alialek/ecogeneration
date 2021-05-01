import React from "react";
import ReactDOM from "react-dom";
import { initApp } from "./api/vk/index";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import rootReducer from "./store/reducers.js";
import App from "./App";
import { RouterContext } from "@happysanta/router";
import { router } from "./router/index.js";
import { AdaptivityProvider, AppRoot, ConfigProvider } from "@vkontakte/vkui";

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

export const store = createStore(rootReducer, applyMiddleware(thunk));
initApp();

const render = (Component) =>
  ReactDOM.render(
    <RouterContext.Provider value={router}>
      <Provider store={store}>
        <ConfigProvider>
          <AdaptivityProvider>
            <AppRoot>
              <Component />
            </AppRoot>
          </AdaptivityProvider>
        </ConfigProvider>
      </Provider>
    </RouterContext.Provider>,
    document.getElementById("root"),
  );
render(App);
if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });
}
// if (process.env.NODE_ENV === 'development')
// import('./eruda').then(({ default: eruda }) => {}); //runtime download
