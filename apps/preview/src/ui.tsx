import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Search,
  X,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { AnimatedIcon } from "@samarinara/polli-ui/components/animated-icon";
import { groups, pages, pageHref, searchDocs, type PageId } from "./pages";

export function Sidebar({ active }: { active: PageId }) {
  return (
    <nav aria-label="Documentation" className="docs-nav">
      {groups.map((group) => (
        <div className="nav-group" key={group}>
          <h2>{group}</h2>
          {pages
            .filter((page) => page.group === group)
            .map((page) => (
              <a
                key={page.id}
                href={pageHref(page.id)}
                aria-current={active === page.id ? "page" : undefined}
              >
                {page.title}
              </a>
            ))}
        </div>
      ))}
    </nav>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section" aria-labelledby={id}>
      <h2 id={id}>
        <a className="heading-link" href={`#${id}`}>
          {title}
          <span aria-hidden="true">#</span>
        </a>
      </h2>
      {children}
    </section>
  );
}

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copyKey, setCopyKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (status === "idle") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [status]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      setCopyKey(key => key + 1);
    } catch {
      setStatus("failed");
    }
  }
  return (
    <button
      type="button"
      className="copy-button"
      onClick={copy}
      aria-label={label === "Copy" ? "Copy code" : `${label}: ${value}`}
    >
      <AnimatedIcon name="copy" size={14} animationKey={copyKey} />
      <span aria-live="polite">
        {status === "copied"
          ? "Copied"
          : status === "failed" && label === "Copy"
            ? "Select to copy"
            : label}
      </span>
    </button>
  );
}

export function Code({
  children,
  label = "React",
}: {
  children: string;
  label?: string;
}) {
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{label}</span>
        <CopyButton value={children} />
      </div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function Preview({
  children,
  label = "Example",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="component-preview">
      <span className="preview-label">{label}</span>
      <div className="preview-body">{children}</div>
    </div>
  );
}

export function RelatedLink({
  id,
  children,
}: {
  id: PageId;
  children: ReactNode;
}) {
  return (
    <a className="related-link" href={pageHref(id)}>
      {children}
      <ChevronRight size={16} />
    </a>
  );
}

export function SearchDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const results = query.trim()
    ? searchDocs(query)
    : pages.slice(0, 5).map((page) => ({
        title: page.title,
        context: page.group,
        href: pageHref(page.id),
      }));
  function open() {
    setQuery("");
    dialog.current?.showModal();
    input.current?.focus();
  }
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  return (
    <>
      <button
        ref={trigger}
        className="search-trigger"
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label="Search documentation"
        aria-keyshortcuts="Meta+K Control+K"
      >
        <Search size={16} />
        <span>Search documentation</span>
        <kbd>⌘ K</kbd>
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-title"
        onClose={() => trigger.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <h2 id="search-title" className="sr-only">
          Search documentation
        </h2>
        <div className="search-input-row">
          <Search size={19} />
          <input
            ref={input}
            aria-label="Search documentation"
            placeholder="Search documentation…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                dialog.current
                  ?.querySelector<HTMLAnchorElement>(".search-result")
                  ?.focus();
              }
              if (event.key === "Enter" && results[0])
                window.location.href = results[0].href;
            }}
          />
          <button
            type="button"
            className="icon-button"
            aria-label="Close search"
            onClick={() => dialog.current?.close()}
          >
            <X size={18} />
          </button>
        </div>
        <div className="search-results" aria-label="Search results">
          <p className="search-caption" role="status">
            {query.trim()
              ? `${results.length} result${results.length === 1 ? "" : "s"}`
              : "Start with"}
          </p>
          {results.map((result) => (
            <a
              className="search-result"
              key={result.href}
              href={result.href}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  (
                    event.currentTarget.nextElementSibling as HTMLElement | null
                  )?.focus();
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  const previous = event.currentTarget.previousElementSibling;
                  if (previous?.matches("a")) (previous as HTMLElement).focus();
                  else input.current?.focus();
                }
              }}
            >
              <span>
                {result.title}
                <small>{result.context}</small>
              </span>
              <ArrowUpRight size={16} />
            </a>
          ))}
          {results.length === 0 ? (
            <p className="search-empty">
              No matches. Try “colour”, “fields”, or “spacing”.
            </p>
          ) : null}
        </div>
        <div className="search-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> Navigate
          </span>
          <span>
            <kbd>esc</kbd> Close
          </span>
        </div>
      </dialog>
    </>
  );
}
