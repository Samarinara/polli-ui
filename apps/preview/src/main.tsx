import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@samarinara/polli-ui/styles.css";
import "./preview.css";
import { App } from "./App";
import { resolvePage } from "./pages";

const root = document.getElementById("root")!;
const pathPage = window.location.pathname
  .split("/")
  .pop()
  ?.replace(/\.html$/, "");
const page = resolvePage(root.dataset.page ?? pathPage);
const app = (
  <StrictMode>
    <App initialPage={page.id} />
  </StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
