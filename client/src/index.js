import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import { IconContext } from "react-icons/lib";
import { BrowserRouter } from "react-router-dom";

import { store } from "./Redux/store";

import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <IconContext.Provider
          value={{
            color: "#333",
            style: {
              verticalAlign: "middle",
            },
          }}
        >
          <App />
        </IconContext.Provider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
