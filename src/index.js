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

export const store = createStore(rootReducer, applyMiddleware(thunk));

initApp();

ReactDOM.render(
  <RouterContext.Provider value={router}>
    <Provider store={store}>
      <App />
    </Provider>
  </RouterContext.Provider>,
  document.getElementById("root"),
);
// if (process.env.NODE_ENV === 'development')
// import('./eruda').then(({ default: eruda }) => {}); //runtime download
