import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// @ts-ignore
import "bootstrap/dist/css/bootstrap.min.css";
// @ts-ignore
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
