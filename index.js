import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css"; // optional: Tailwind or custom styles
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
