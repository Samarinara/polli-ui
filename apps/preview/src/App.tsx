import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Github,
  Menu,
} from "lucide-react";
import { pages, pageHref, repoUrl, resolvePage, type PageId } from "./pages";
import { Sidebar, SearchDialog } from "./ui";
import { Content } from "./content";

export function App({ initialPage = "overview" }: { initialPage?: PageId }) {
  const page = resolvePage(initialPage);
  const source =
    page.id === "overview" || page.id === "components"
      ? "showcase.tsx"
      : page.group === "Components"
        ? "component-docs.tsx"
        : "content.tsx";
  const index = pages.findIndex((item) => item.id === page.id);
  const previous = pages[index - 1];
  const next = pages[index + 1];
  return (
    <div className="polli-root docs-root">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="topbar">
        <a
          className="brand"
          href={pageHref("overview")}
          aria-label="Polli UI home"
        >
          <img
            src="./brand/polli-wordmark.svg"
            width="78"
            height="35"
            alt="Polli"
          />
          <span className="brand-divider" />
          <span>UI</span>
        </a>
        <SearchDialog />
        <div className="header-links">
          <a href="https://polli.page">
            polli.page
            <ArrowUpRight size={14} />
          </a>
          <a href={repoUrl} aria-label="Polli UI on GitHub">
            <Github size={19} />
          </a>
        </div>
      </header>
      <details className="mobile-navigation">
        <summary>
          <span>
            <Menu size={17} />
            Documentation
          </span>
          <span>{page.title}</span>
        </summary>
        <Sidebar active={page.id} />
      </details>
      <div className="docs-shell">
        <aside className="sidebar">
          <Sidebar active={page.id} />
          <a className="sidebar-source" href={repoUrl}>
            View source
            <ArrowUpRight size={13} />
          </a>
        </aside>
        <main id="main-content" className="doc-main" tabIndex={-1}>
          <article>
            <header className="page-header">
              <p className="breadcrumb">{page.group}</p>
              <h1>{page.title}</h1>
              <p className="page-description">{page.description}</p>
            </header>
            <details className="mobile-outline">
              <summary>On this page</summary>
              <nav aria-label="On this page">
                {page.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {section.title}
                  </a>
                ))}
              </nav>
            </details>
            <Content page={page.id} />
          </article>
          <nav className="page-pagination" aria-label="Previous and next pages">
            {previous ? (
              <a href={pageHref(previous.id)}>
                <ArrowLeft size={17} />
                <span>
                  <small>Previous</small>
                  {previous.title}
                </span>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a className="next-page" href={pageHref(next.id)}>
                <span>
                  <small>Next</small>
                  {next.title}
                </span>
                <ArrowRight size={17} />
              </a>
            ) : (
              <span />
            )}
          </nav>
          <footer className="page-footer">
            <span>Polli UI · Components & guidelines</span>
            <a href={`${repoUrl}/blob/main/apps/preview/src/${source}`}>
              Edit this page
              <ArrowUpRight size={12} />
            </a>
          </footer>
        </main>
        <aside className="page-outline">
          <nav aria-label="On this page">
            <h2>On this page</h2>
            {page.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
          <a className="outline-resource" href={pageHref("getting-started")}>
            Build with Polli
            <ArrowUpRight size={13} />
          </a>
        </aside>
      </div>
    </div>
  );
}
