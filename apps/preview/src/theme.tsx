import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

type Preference = "system" | "light" | "dark";
const storageKey = "polli-theme";
const ThemeContext = createContext({
  preference: "system" as Preference,
  dark: false,
  setPreference: (_value: Preference) => {},
});
const isPreference = (value: unknown): value is Preference =>
  value === "system" || value === "light" || value === "dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Match the static HTML on the first render; the head script themes it before paint.
  const [preference, setState] = useState<Preference>("system");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let current: Preference = "system";
    try {
      const stored = localStorage.getItem(storageKey);
      if (isPreference(stored)) current = stored;
    } catch {
      // Storage is optional, including in offline previews.
    }
    const apply = () => {
      const resolved = current === "dark" || (current === "system" && media.matches);
      document.documentElement.classList.toggle("dark", resolved);
      document.documentElement.dataset.theme = current;
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        "content", resolved ? "#17251E" : "#FAFBF6",
      );
      setState(current);
      setDark(resolved);
    };
    const update = (event: Event) => {
      if (event instanceof StorageEvent) {
        if (event.key !== storageKey && event.key !== null) return;
        current = isPreference(event.newValue) ? event.newValue : "system";
      } else if (event instanceof CustomEvent && isPreference(event.detail)) {
        current = event.detail;
      }
      apply();
    };
    apply();
    media.addEventListener("change", apply);
    window.addEventListener("storage", update);
    window.addEventListener("polli-theme-change", update);
    return () => {
      media.removeEventListener("change", apply);
      window.removeEventListener("storage", update);
      window.removeEventListener("polli-theme-change", update);
    };
  }, []);
  const setPreference = (value: Preference) => {
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // Keep switching usable when persistence is unavailable.
    }
    window.dispatchEvent(new CustomEvent("polli-theme-change", { detail: value }));
  };
  return (
    <ThemeContext.Provider value={{ preference, dark, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeControl() {
  const { preference, dark, setPreference } = useContext(ThemeContext);
  return (
    <label className="theme-control">
      {dark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
      <span className="sr-only">Color theme</span>
      <select
        value={preference}
        onChange={event => setPreference(event.target.value as Preference)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}

export function ThemeToggle() {
  const { dark, setPreference } = useContext(ThemeContext);
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Dark mode"
      aria-pressed={dark}
      title="Change the theme for the whole page"
      onClick={() => setPreference(dark ? "light" : "dark")}
    >
      {dark ? <Moon size={14} aria-hidden="true" /> : <Sun size={14} aria-hidden="true" />}
      <span>Dark mode</span>
    </button>
  );
}
