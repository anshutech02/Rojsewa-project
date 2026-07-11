import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import store from "./store/store.js";
import "./styles/index.css";
import {registerSW} from 'virtual:pwa-register';

registerSW()

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        containerStyle={{
          top: 20,
          right: 20,
          zIndex: 99999,
        }}
        toastOptions={{
          className: "glass",
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--card-border)",
            backdropFilter: "blur(10px)",
            zIndex: 99999,
          },
        }}
      />
    </Provider>
  </React.StrictMode>,
);
