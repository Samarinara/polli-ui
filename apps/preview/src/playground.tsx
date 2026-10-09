import { useId, useRef, useState, type ReactNode } from "react";
import { RotateCcw, Code2, Eye } from "lucide-react";
import { Code } from "./ui";

export function Playground({
  name,
  children,
  controls,
  code,
  onReset,
  hint,
  className = "",
}: {
  name: string;
  children: ReactNode;
  controls?: ReactNode;
  code: string;
  onReset: () => void;
  hint: string;
  className?: string;
}) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  return (
    <div
      className={`playground ${className}`}
      role="region"
      aria-label={`${name} playground`}
    >
      <div className="playground-toolbar">
        <div
          className="playground-tabs"
          role="tablist"
          aria-label={`${name} example view`}
        >
          {(["preview", "code"] as const).map((value, index) => (
            <button
              key={value}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${id}-${value}-tab`}
              aria-selected={view === value}
              aria-controls={`${id}-${value}`}
              tabIndex={view === value ? 0 : -1}
              onClick={() => setView(value)}
              onKeyDown={(event) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 1
                        : 1 - index;
                  setView(next === 0 ? "preview" : "code");
                  tabs.current[next]?.focus();
                }
              }}
            >
              {value === "preview" ? <Eye size={14} /> : <Code2 size={14} />}
              {value === "preview" ? "Preview" : "Code"}
            </button>
          ))}
        </div>
        <span className="live-label">
          <span />
          Live
        </span>
        <button
          type="button"
          className="playground-reset"
          aria-label={`Reset ${name.toLowerCase()} example`}
          onClick={() => {
            onReset();
            setView("preview");
          }}
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>
      <div
        id={`${id}-preview`}
        role="tabpanel"
        aria-labelledby={`${id}-preview-tab`}
        hidden={view !== "preview"}
        tabIndex={0}
      >
        <div className="playground-stage">{children}</div>
        <p className="playground-hint">{hint}</p>
      </div>
      <div
        id={`${id}-code`}
        role="tabpanel"
        aria-labelledby={`${id}-code-tab`}
        hidden={view !== "code"}
        tabIndex={0}
      >
        <Code label="React · current configuration">{code}</Code>
      </div>
      {controls ? (
        <fieldset className="playground-controls">
          <legend>Configure the example</legend>
          <div className="control-grid">{controls}</div>
        </fieldset>
      ) : null}
    </div>
  );
}

export function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  const id = useId();
  return (
    <div className="property-control">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="property-control">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function ToggleControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="property-control toggle-control">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  );
}
