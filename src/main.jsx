import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./output.css";

import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

// ReactDOM.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementById("root"),
// );

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
