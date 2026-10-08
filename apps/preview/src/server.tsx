import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { pages, type PageId } from "./pages";

export { pages };
export function renderPage(page: PageId) {
  return renderToString(
    <StrictMode>
      <App initialPage={page} />
    </StrictMode>,
  );
}
