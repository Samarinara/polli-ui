import { useId, useState, type ReactNode } from "react";
import {
  Plus,
  Bookmark,
  Check,
  MoreHorizontal,
  Settings,
  Archive,
  Copy,
  Trash2,
} from "lucide-react";
import {
  Button,
  type ButtonProps,
} from "@samarinara/polli-ui/components/button";
import { Badge } from "@samarinara/polli-ui/components/badge";
import {
  Field,
  Input,
  Textarea,
  NativeSelect,
  Label,
} from "@samarinara/polli-ui/components/field";
import { Checkbox, Switch } from "@samarinara/polli-ui/components/selection";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@samarinara/polli-ui/components/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@samarinara/polli-ui/components/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@samarinara/polli-ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@samarinara/polli-ui/components/menu";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@samarinara/polli-ui/components/tooltip";
import {
  Alert,
  Avatar,
  EmptyState,
  ListRow,
  Separator,
  Surface,
} from "@samarinara/polli-ui/components/layout";
import { Section } from "./ui";
import {
  Playground,
  SelectControl,
  TextControl,
  ToggleControl,
} from "./playground";
import { type PageId } from "./pages";

type Property = readonly [name: string, values: string, initial: string];
const variants = [
  "default",
  "secondary",
  "coral",
  "butter",
  "sky",
  "ghost",
  "destructive",
] as const;
const tones = ["mint", "coral", "butter", "sky", "neutral"] as const;
const selectionProperties: readonly Property[] = [
  ["checked", "boolean · Checkbox also accepts 'indeterminate'", "false"],
  ["onCheckedChange", "Callback with the next checked value", "—"],
  ["disabled", "boolean", "false"],
  [
    "id / aria-label",
    "Connect a visible label or supply an accessible name",
    "—",
  ],
];
const q = JSON.stringify;
function example(imports: string, body: string) {
  return `${imports}\n\nexport function Example() {\n${body}\n}`;
}
function Documentation({
  playground,
  usage,
  properties,
  path,
}: {
  playground: ReactNode;
  usage: ReactNode;
  properties: readonly Property[];
  path: string;
}) {
  return (
    <>
      <Section id="playground" title="Playground">
        {playground}
      </Section>
      <Section id="usage" title="Usage">
        {usage}
      </Section>
      <Section id="api" title="API reference">
        <p className="api-import">
          <code>@samarinara/polli-ui/components/{path}</code>
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Values / behaviour</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(([name, values, initial]) => (
                <tr key={name}>
                  <td>
                    <code>{name}</code>
                  </td>
                  <td>{values}</td>
                  <td>
                    <code>{initial}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="api-note">
          Use these components inside <code>.polli-root</code> and import the
          package stylesheet once. Native elements accept their standard HTML
          props; Radix components accept the corresponding primitive props.
        </p>
      </Section>
    </>
  );
}

function ButtonDoc() {
  const [variant, setVariant] =
    useState<NonNullable<ButtonProps["variant"]>>("default");
  const [size, setSize] = useState<NonNullable<ButtonProps["size"]>>("default");
  const [label, setLabel] = useState("Save note");
  const [disabled, setDisabled] = useState(false);
  const [icon, setIcon] = useState(true);
  const [clicks, setClicks] = useState(0);
  const reset = () => {
    setVariant("default");
    setSize("default");
    setLabel("Save note");
    setDisabled(false);
    setIcon(true);
    setClicks(0);
  };
  const code = example(
    `import { useState } from "react";\nimport { Plus } from "lucide-react";\nimport { Button } from "@samarinara/polli-ui/components/button";`,
    `  const [clicks, setClicks] = useState(0);\n  return (\n    <div>\n      <Button variant="${variant}" size="${size}"${disabled ? " disabled" : ""}${size === "icon" ? ` aria-label={${q(label || "Save note")}}` : ""}\n        onClick={() => setClicks((count) => count + 1)}>\n        ${icon || size === "icon" ? "<Plus />" : ""}${size !== "icon" ? `{${q(label || "Save note")}}` : ""}\n      </Button>\n      <p role="status">Pressed {clicks} times.</p>\n    </div>\n  );`,
  );
  return (
    <Documentation
      path="button"
      properties={[
        ["variant", variants.join(" · "), "default"],
        ["size", "sm · default · lg · icon", "default"],
        ["disabled", "boolean", "false"],
        ["asChild", "Render as a child element, such as a link", "false"],
        ["onClick", "Native button click handler", "—"],
      ]}
      usage={
        <>
          <p>
            Give each task one primary action. Use Mint for secondary actions
            and a ghost button for a quieter choice. Name icon-only actions with{" "}
            <code>aria-label</code>.
          </p>
          <div className="variant-strip" aria-label="Button variants">
            {variants.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={item}
                onClick={() => setVariant(item)}
                aria-pressed={variant === item}
              >
                {item}
              </Button>
            ))}
          </div>
          <p className="api-note">
            Click a variant above to load it in the playground. Hover changes
            colour; pressing adds subtle inset pressure.
          </p>
        </>
      }
      playground={
        <Playground
          name="Button"
          code={code}
          onReset={reset}
          hint="Click the button, then change its variant, size, or state."
          controls={
            <>
              <SelectControl
                label="Variant"
                value={variant}
                options={variants}
                onChange={setVariant}
              />
              <SelectControl
                label="Size"
                value={size}
                options={["sm", "default", "lg", "icon"]}
                onChange={setSize}
              />
              <TextControl
                label="Button label"
                value={label}
                onChange={setLabel}
              />
              <ToggleControl
                label="Disabled"
                checked={disabled}
                onChange={setDisabled}
              />
              <ToggleControl
                label="Leading icon"
                checked={icon}
                onChange={setIcon}
              />
            </>
          }
        >
          <div className="center-demo">
            <Button
              variant={variant}
              size={size}
              disabled={disabled}
              aria-label={size === "icon" ? label || "Save note" : undefined}
              onClick={() => setClicks((count) => count + 1)}
            >
              {icon || size === "icon" ? <Plus /> : null}
              {size !== "icon" ? label || "Save note" : null}
            </Button>
            <p className="demo-status" role="status">
              {clicks
                ? `Pressed ${clicks} ${clicks === 1 ? "time" : "times"}.`
                : "Ready when you are."}
            </p>
          </div>
        </Playground>
      }
    />
  );
}

function FieldsDoc() {
  const [kind, setKind] = useState<"input" | "textarea" | "select">("input");
  const [state, setState] = useState<"default" | "invalid" | "disabled">(
    "default",
  );
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("Recipes");
  const [required, setRequired] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState("");
  const id = useId();
  const invalid =
    state === "invalid" ||
    (submitted && required && kind !== "select" && !value.trim());
  const error =
    state === "invalid"
      ? "Please check this value."
      : "Enter a title before saving.";
  const reset = () => {
    setKind("input");
    setState("default");
    setValue("");
    setCategory("Recipes");
    setRequired(true);
    setSubmitted(false);
    setSaved("");
  };
  const props = {
    id,
    disabled: state === "disabled",
    required,
    "aria-invalid": invalid,
    "aria-describedby": `${id}-message`,
  };
  const element =
    kind === "input"
      ? "Input"
      : kind === "textarea"
        ? "Textarea"
        : "NativeSelect";
  const code = example(
    `import { useState } from "react";\nimport { Field, ${element}, Label } from "@samarinara/polli-ui/components/field";\nimport { Button } from "@samarinara/polli-ui/components/button";`,
    `  const [value, setValue] = useState(${q(kind === "select" ? category : value)});\n  const [submitted, setSubmitted] = useState(false);\n  const [saved, setSaved] = useState("");\n  const invalid = ${state === "invalid" ? "true" : required && kind !== "select" ? "submitted && !value.trim()" : "false"};\n  return (\n    <form noValidate onSubmit={(event) => {\n      event.preventDefault();\n      setSubmitted(true);\n      if (${state === "invalid" ? "false" : required && kind !== "select" ? "value.trim()" : "true"}) setSaved(value || "Untitled entry");\n    }}>\n      <Field label={<Label htmlFor="entry">${kind === "select" ? "Category" : "Title"}</Label>}\n        error={invalid ? <span id="entry-message">${error}</span> : undefined}\n        hint={<span id="entry-message">${kind === "select" ? "Choose where to keep this entry." : "Something worth remembering."}</span>}>\n        <${element} id="entry" value={value} onChange={(event) => { setValue(event.target.value); setSaved(""); }}\n          aria-invalid={invalid} aria-describedby="entry-message"${required ? " required" : ""}${state === "disabled" ? " disabled" : ""}${kind !== "select" ? ' placeholder="Weekend plans"' : ""}${kind === "select" ? ">\n          <option>Recipes</option><option>Home</option><option>Ideas</option>\n        </NativeSelect>" : " />"}\n      </Field>\n      <Button type="submit"${state === "disabled" ? " disabled" : ""}>Save entry</Button>\n      <p role="status">{saved ? \`Saved: \${saved}\` : "Nothing saved yet."}</p>\n    </form>\n  );`,
  );
  return (
    <Documentation
      path="field"
      properties={[
        [
          "Field: label / hint / error",
          "ReactNode · error replaces the hint",
          "—",
        ],
        ["value / onChange", "Native controlled field props", "—"],
        ["required / disabled", "boolean", "false"],
        [
          "aria-invalid",
          "Mark an invalid value for assistive technology",
          "false",
        ],
        ["aria-describedby", "ID of the field's help text or error", "—"],
      ]}
      usage={
        <>
          <p>
            Keep the printed label above the handwritten value. Connect the hint
            or error to the control with <code>aria-describedby</code>. Errors
            belong beside the field and should explain how to continue.
          </p>
          <p>
            Use <code>Input</code> for a short value, <code>Textarea</code> for
            a note, and <code>NativeSelect</code> for a short list of
            categories. Try submitting an empty required field in the
            playground.
          </p>
        </>
      }
      playground={
        <Playground
          name="Fields"
          code={code}
          onReset={reset}
          hint="Type your own entry and save it. Empty required fields show an error."
          controls={
            <>
              <SelectControl
                label="Control"
                value={kind}
                options={["input", "textarea", "select"]}
                onChange={(next) => {
                  setKind(next);
                  setSubmitted(false);
                  setSaved("");
                }}
              />
              <SelectControl
                label="State"
                value={state}
                options={["default", "invalid", "disabled"]}
                onChange={(next) => {
                  setState(next);
                  setSaved("");
                }}
              />
              <ToggleControl
                label="Required"
                checked={required}
                onChange={setRequired}
              />
            </>
          }
        >
          <form
            className="demo-form full-demo"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
              if (
                state !== "invalid" &&
                (!required || kind === "select" || value.trim())
              )
                setSaved(
                  (kind === "select" ? category : value) || "Untitled entry",
                );
            }}
          >
            <Field
              label={
                <Label htmlFor={id}>
                  {kind === "select" ? "Category" : "Title"}
                </Label>
              }
              error={
                invalid ? <span id={`${id}-message`}>{error}</span> : undefined
              }
              hint={
                <span id={`${id}-message`}>
                  {kind === "select"
                    ? "Choose where to keep this entry."
                    : "Something worth remembering."}
                </span>
              }
            >
              {kind === "select" ? (
                <NativeSelect
                  {...props}
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setSaved("");
                  }}
                >
                  <option>Recipes</option>
                  <option>Home</option>
                  <option>Ideas</option>
                </NativeSelect>
              ) : kind === "textarea" ? (
                <Textarea
                  {...props}
                  placeholder="Weekend plans"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    setSaved("");
                  }}
                />
              ) : (
                <Input
                  {...props}
                  placeholder="Weekend plans"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    setSaved("");
                  }}
                />
              )}
            </Field>
            <Button type="submit" disabled={state === "disabled"}>
              Save entry
            </Button>
            <p className="demo-status" role="status">
              {saved ? `Saved: ${saved}` : "Nothing saved yet."}
            </p>
          </form>
        </Playground>
      }
    />
  );
}

function CheckboxDoc() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false);
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState("Add lemons to the shopping list");
  const id = useId();
  const state =
    checked === "indeterminate"
      ? "indeterminate"
      : checked
        ? "checked"
        : "unchecked";
  const code = example(
    `import { useState } from "react";\nimport { Checkbox } from "@samarinara/polli-ui/components/selection";\nimport { Label } from "@samarinara/polli-ui/components/field";`,
    `  const [checked, setChecked] = useState<boolean | "indeterminate">(${q(checked)});\n  return (\n    <div>\n      <Checkbox id="lemons" checked={checked} onCheckedChange={setChecked}${disabled ? " disabled" : ""} />\n      <Label htmlFor="lemons">{${q(label || "Add lemons")}}</Label>\n    </div>\n  );`,
  );
  return (
    <Documentation
      path="selection"
      properties={selectionProperties}
      usage={
        <>
          <p>
            Use a checkbox to select an item. Use <code>indeterminate</code>{" "}
            when only some items in a collection are selected. Clicking a mixed
            checkbox selects it.
          </p>
          <p>
            Click the label or press <kbd>Space</kbd> while the checkbox has
            focus. A disabled item keeps its state and ignores interaction.
          </p>
        </>
      }
      playground={
        <Playground
          name="Checkbox"
          code={code}
          onReset={() => {
            setChecked(false);
            setDisabled(false);
            setLabel("Add lemons to the shopping list");
          }}
          hint="Click the checkbox or its label. Tab to it and try Space."
          controls={
            <>
              <SelectControl
                label="Checked state"
                value={state}
                options={["unchecked", "checked", "indeterminate"]}
                onChange={(next) =>
                  setChecked(
                    next === "indeterminate" ? next : next === "checked",
                  )
                }
              />
              <TextControl
                label="Checkbox label"
                value={label}
                onChange={setLabel}
              />
              <ToggleControl
                label="Disabled"
                checked={disabled}
                onChange={setDisabled}
              />
            </>
          }
        >
          <div className="full-demo">
            <div className="demo-row selection-demo">
              <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={setChecked}
                disabled={disabled}
              />
              <Label htmlFor={id}>{label || "Add lemons"}</Label>
            </div>
            <p className="demo-status" role="status">
              {checked === "indeterminate"
                ? "Some items selected."
                : checked
                  ? "Lemons are on the list."
                  : "Lemons are off the list."}
            </p>
          </div>
        </Playground>
      }
    />
  );
}

function SwitchDoc() {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState("Shared categories");
  const id = useId();
  const code = example(
    `import { useState } from "react";\nimport { Switch } from "@samarinara/polli-ui/components/selection";\nimport { Label } from "@samarinara/polli-ui/components/field";`,
    `  const [enabled, setEnabled] = useState(${checked});\n  return (\n    <div>\n      <Label htmlFor="shared">{${q(label || "Shared categories")}}</Label>\n      <Switch id="shared" checked={enabled} onCheckedChange={setEnabled}${disabled ? " disabled" : ""} />\n      <p role="status">{enabled ? "Sharing is on." : "Sharing is off."}</p>\n    </div>\n  );`,
  );
  return (
    <Documentation
      path="selection"
      properties={selectionProperties
        .filter(([name]) => name !== "checked")
        .concat([["checked", "boolean", "false"]])}
      usage={
        <>
          <p>
            Use a switch for an immediate preference. The label describes the
            setting and stays the same in both states. Use a checkbox when
            choosing items for a later submission.
          </p>
          <p>
            Click or press <kbd>Space</kbd> to change the setting. No save
            button is needed for this example.
          </p>
        </>
      }
      playground={
        <Playground
          name="Switch"
          code={code}
          onReset={() => {
            setChecked(true);
            setDisabled(false);
            setLabel("Shared categories");
          }}
          hint="Toggle the setting and watch its state update immediately."
          controls={
            <>
              <TextControl
                label="Switch label"
                value={label}
                onChange={setLabel}
              />
              <ToggleControl
                label="Checked"
                checked={checked}
                onChange={setChecked}
              />
              <ToggleControl
                label="Disabled"
                checked={disabled}
                onChange={setDisabled}
              />
            </>
          }
        >
          <div className="full-demo">
            <ListRow
              title={<Label htmlFor={id}>{label || "Shared categories"}</Label>}
              description="Use the same categories across your Polli apps."
              trailing={
                <Switch
                  id={id}
                  checked={checked}
                  onCheckedChange={setChecked}
                  disabled={disabled}
                />
              }
            />
            <p className="demo-status" role="status">
              {checked ? "Sharing is on." : "Sharing is off."}
            </p>
          </div>
        </Playground>
      }
    />
  );
}

function BadgeDoc() {
  const [tone, setTone] = useState<(typeof tones)[number]>("mint");
  const [label, setLabel] = useState("Recipes");
  return (
    <Documentation
      path="badge"
      properties={[
        ["tone", tones.join(" · "), "mint"],
        ["children", "Visible category or status text", "—"],
      ]}
      usage={
        <>
          <p>
            Badges describe an item; they do not act as buttons. Keep text short
            and use a word alongside colour so the meaning stays clear.
          </p>
          <div className="demo-row">
            {tones.map((item) => (
              <Badge key={item} tone={item}>
                {item}
              </Badge>
            ))}
          </div>
        </>
      }
      playground={
        <Playground
          name="Badge"
          code={`import { Badge } from "@samarinara/polli-ui/components/badge";\n\n<Badge tone="${tone}">{${q(label || "Recipes")}}</Badge>`}
          onReset={() => {
            setTone("mint");
            setLabel("Recipes");
          }}
          hint="Change the label and tone to see how categories sit on the Polli canvas."
          controls={
            <>
              <SelectControl
                label="Tone"
                value={tone}
                options={tones}
                onChange={setTone}
              />
              <TextControl
                label="Badge text"
                value={label}
                onChange={setLabel}
              />
            </>
          }
        >
          <div className="center-demo">
            <Badge tone={tone}>{label || "Recipes"}</Badge>
          </div>
        </Playground>
      }
    />
  );
}

function TabsDoc() {
  const [value, setValue] = useState("notes");
  const [activation, setActivation] = useState<"automatic" | "manual">(
    "automatic",
  );
  const [disabled, setDisabled] = useState(false);
  const code = example(
    `import { useState } from "react";\nimport { Tabs, TabsList, TabsTrigger, TabsContent } from "@samarinara/polli-ui/components/tabs";`,
    `  const [view, setView] = useState(${q(value)});\n  return (\n    <Tabs value={view} onValueChange={setView} activationMode="${activation}">\n      <TabsList aria-label="Saved content">\n        <TabsTrigger value="notes">Notes</TabsTrigger>\n        <TabsTrigger value="links">Links</TabsTrigger>\n        <TabsTrigger value="recipes"${disabled ? " disabled" : ""}>Recipes</TabsTrigger>\n      </TabsList>\n      <TabsContent value="notes">Things to make this weekend</TabsContent>\n      <TabsContent value="links">A little inspiration</TabsContent>\n      <TabsContent value="recipes">Grandma's lemon cake</TabsContent>\n    </Tabs>\n  );`,
  );
  return (
    <Documentation
      path="tabs"
      properties={[
        ["value / defaultValue", "The selected trigger value", "—"],
        ["onValueChange", "Callback with the selected value", "—"],
        ["activationMode", "automatic · manual", "automatic"],
        ["TabsTrigger: disabled", "Skip an unavailable tab", "false"],
      ]}
      usage={
        <>
          <p>
            Use tabs for related views. Arrow keys move between triggers;{" "}
            <kbd>Home</kbd> and <kbd>End</kbd> move to the first and last. In
            manual mode, press <kbd>Enter</kbd> or <kbd>Space</kbd> to activate
            the focused tab.
          </p>
          <p>
            Give the tab list an accessible name and connect every trigger to a
            matching content value.
          </p>
        </>
      }
      playground={
        <Playground
          name="Tabs"
          code={code}
          onReset={() => {
            setValue("notes");
            setActivation("automatic");
            setDisabled(false);
          }}
          hint="Click a tab, or focus Notes and use the arrow keys."
          controls={
            <>
              <SelectControl
                label="Activation mode"
                value={activation}
                options={["automatic", "manual"]}
                onChange={setActivation}
              />
              <ToggleControl
                label="Disable Recipes"
                checked={disabled}
                onChange={(next) => {
                  setDisabled(next);
                  if (next && value === "recipes") setValue("notes");
                }}
              />
            </>
          }
        >
          <div className="full-demo">
            <Tabs
              value={value}
              onValueChange={setValue}
              activationMode={activation}
            >
              <TabsList aria-label="Saved content">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="recipes" disabled={disabled}>
                  Recipes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="notes">
                <ListRow
                  title={
                    <span className="handwritten">
                      Things to make this weekend
                    </span>
                  }
                  description="Home · 2 notes"
                />
              </TabsContent>
              <TabsContent value="links">
                <ListRow
                  leading={<Bookmark size={18} />}
                  title={
                    <span className="handwritten">A little inspiration</span>
                  }
                  description="Ideas · 3 saved links"
                />
              </TabsContent>
              <TabsContent value="recipes">
                <ListRow
                  title={
                    <span className="handwritten">Grandma's lemon cake</span>
                  }
                  description="Recipes · A family favourite"
                />
              </TabsContent>
            </Tabs>
            <p className="demo-status" role="status">
              Current view: {value}.
            </p>
          </div>
        </Playground>
      }
    />
  );
}

function AccordionDoc() {
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const [open, setOpen] = useState<string[]>(["categories"]);
  const [collapsible, setCollapsible] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const items = [
    {
      value: "categories",
      title: "How do categories work?",
      text: "Keep recipes, notes, and links connected with the same categories across your Polli apps.",
    },
    {
      value: "data",
      title: "Can I take my data with me?",
      text: "Use open, portable formats so the things you keep remain yours.",
    },
    {
      value: "options",
      title: "Where do secondary options go?",
      text: "Put the everyday task first and reveal advanced settings when they are useful.",
    },
  ];
  const children = items.map((item) => (
    <AccordionItem
      key={item.value}
      value={item.value}
      disabled={item.value === "options" && disabled}
    >
      <AccordionTrigger>{item.title}</AccordionTrigger>
      <AccordionContent>{item.text}</AccordionContent>
    </AccordionItem>
  ));
  const code = example(
    `import { useState } from "react";\nimport { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@samarinara/polli-ui/components/accordion";`,
    `  const [open, setOpen] = useState(${q(mode === "single" ? open[0] || "" : open)});\n  return (\n    <Accordion type="${mode}" value={open} onValueChange={setOpen}${mode === "single" ? ` collapsible={${collapsible}}` : ""}>\n${items.map((item) => `      <AccordionItem value="${item.value}"${item.value === "options" && disabled ? " disabled" : ""}>\n        <AccordionTrigger>${item.title}</AccordionTrigger>\n        <AccordionContent>${item.text}</AccordionContent>\n      </AccordionItem>`).join("\n")}\n    </Accordion>\n  );`,
  );
  return (
    <Documentation
      path="accordion"
      properties={[
        ["type", "single · multiple", "required"],
        [
          "value / defaultValue",
          "string for single; string[] for multiple",
          "—",
        ],
        ["collapsible", "Allow all single-mode items to close", "false"],
        ["AccordionItem: disabled", "Prevent the item from opening", "false"],
      ]}
      usage={
        <>
          <p>
            Use an accordion for supporting detail, never for required form
            fields or errors. Choose single mode for focused reading, or
            multiple mode when people need to compare sections.
          </p>
          <p>
            <kbd>Enter</kbd> or <kbd>Space</kbd> opens a section. Arrow keys
            move between triggers. In single mode, turn off{" "}
            <code>collapsible</code> to keep an open section visible.
          </p>
        </>
      }
      playground={
        <Playground
          name="Accordion"
          code={code}
          onReset={() => {
            setMode("single");
            setOpen(["categories"]);
            setCollapsible(true);
            setDisabled(false);
          }}
          hint="Open a section, then try multiple mode to keep more than one open."
          controls={
            <>
              <SelectControl
                label="Mode"
                value={mode}
                options={["single", "multiple"]}
                onChange={(next) => {
                  setMode(next);
                  setOpen(["categories"]);
                }}
              />
              <ToggleControl
                label="Collapsible (single)"
                checked={collapsible}
                onChange={(next) => {
                  setCollapsible(next);
                  if (!next && !open.length) setOpen(["categories"]);
                }}
              />
              <ToggleControl
                label="Disable last item"
                checked={disabled}
                onChange={(next) => {
                  setDisabled(next);
                  if (next)
                    setOpen((current) => {
                      const remaining = current.filter(
                        (item) => item !== "options",
                      );
                      return !remaining.length &&
                        mode === "single" &&
                        !collapsible
                        ? ["categories"]
                        : remaining;
                    });
                }}
              />
            </>
          }
        >
          <div className="full-demo">
            {mode === "single" ? (
              <Accordion
                type="single"
                value={open[0] || ""}
                onValueChange={(value) => setOpen(value ? [value] : [])}
                collapsible={collapsible}
              >
                {children}
              </Accordion>
            ) : (
              <Accordion type="multiple" value={open} onValueChange={setOpen}>
                {children}
              </Accordion>
            )}
            <p className="demo-status" role="status">
              {open.length
                ? `${open.length} ${open.length === 1 ? "section" : "sections"} open.`
                : "All sections closed."}
            </p>
          </div>
        </Playground>
      }
    />
  );
}

function DialogDoc() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Add category");
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [notice, setNotice] = useState("No category created yet.");
  const id = useId();
  const code = example(
    `import { useState } from "react";\nimport { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@samarinara/polli-ui/components/dialog";\nimport { Input, Label } from "@samarinara/polli-ui/components/field";\nimport { Button } from "@samarinara/polli-ui/components/button";`,
    `  const [open, setOpen] = useState(false);\n  const [name, setName] = useState("");\n  const [notice, setNotice] = useState("No category created yet.");\n  return (\n    <>\n      <Dialog open={open} onOpenChange={setOpen}>\n        <DialogTrigger asChild><Button${disabled ? " disabled" : ""}>Add category</Button></DialogTrigger>\n        <DialogContent>\n          <DialogTitle>{${q(title || "Add category")}}</DialogTitle>\n          <DialogDescription>Categories are available across your Polli apps.</DialogDescription>\n          <form onSubmit={(event) => {\n            event.preventDefault();\n            if (!name.trim()) return;\n            setNotice(\`Category “\${name.trim()}” created in this example.\`);\n            setName("");\n            setOpen(false);\n          }}>\n            <Label htmlFor="category-name">Category name</Label>\n            <Input id="category-name" required value={name} onChange={(event) => setName(event.target.value)} />\n            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>\n            <Button type="submit">Create category</Button>\n          </form>\n        </DialogContent>\n      </Dialog>\n      <p role="status">{notice}</p>\n    </>\n  );`,
  );
  return (
    <Documentation
      path="dialog"
      properties={[
        ["Dialog: open / defaultOpen", "boolean", "false"],
        ["Dialog: onOpenChange", "Callback with the next open state", "—"],
        ["Dialog: modal", "Trap focus and make the background inert", "true"],
        [
          "DialogTrigger / DialogClose: asChild",
          "Use a Button as the trigger or close control",
          "false",
        ],
        [
          "DialogTitle / DialogDescription",
          "Accessible title and supporting text",
          "required",
        ],
      ]}
      usage={
        <>
          <p>
            Use a dialog for a short, focused task. Give it a title, a
            description, and an explicit way to cancel. Keep longer workflows on
            a page.
          </p>
          <p>
            Focus moves into the dialog and remains there while it is open. Try{" "}
            <kbd>Tab</kbd>, <kbd>Shift Tab</kbd>, and <kbd>Escape</kbd>; closing
            restores focus to the trigger.
          </p>
        </>
      }
      playground={
        <Playground
          name="Dialog"
          code={code}
          onReset={() => {
            setOpen(false);
            setName("");
            setTitle("Add category");
            setDisabled(false);
            setNotice("No category created yet.");
          }}
          hint="Open the dialog, create a category, or use Escape to return."
          controls={
            <>
              <TextControl
                label="Dialog title"
                value={title}
                onChange={setTitle}
              />
              <ToggleControl
                label="Disable trigger"
                checked={disabled}
                onChange={setDisabled}
              />
            </>
          }
        >
          <div className="center-demo">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={disabled}>
                  <Plus />
                  Add category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>{title || "Add category"}</DialogTitle>
                <DialogDescription>
                  Categories are available across your Polli apps.
                </DialogDescription>
                <form
                  className="demo-stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!name.trim()) return;
                    setNotice(
                      `Category “${name.trim()}” created in this example.`,
                    );
                    setName("");
                    setOpen(false);
                  }}
                >
                  <Field label={<Label htmlFor={id}>Category name</Label>}>
                    <Input
                      id={id}
                      placeholder="e.g. Weekend plans"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </Field>
                  <div className="demo-row dialog-actions">
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Create category</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <p className="demo-status" role="status">
              {notice}
            </p>
          </div>
        </Playground>
      }
    />
  );
}

function MenuDoc() {
  const [align, setAlign] = useState<"start" | "center" | "end">("end");
  const [disabled, setDisabled] = useState(false);
  const [icons, setIcons] = useState(true);
  const [action, setAction] = useState("No action selected yet.");
  const actions = [
    { label: "Archive", icon: Archive },
    { label: "Duplicate", icon: Copy },
    { label: "Delete", icon: Trash2 },
  ];
  const code = example(
    `import { useState } from "react";\nimport { MoreHorizontal${icons ? ", Archive, Copy, Trash2" : ""} } from "lucide-react";\nimport { Button } from "@samarinara/polli-ui/components/button";\nimport { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@samarinara/polli-ui/components/menu";`,
    `  const [action, setAction] = useState("No action selected yet.");\n  return (\n    <>\n      <DropdownMenu>\n        <DropdownMenuTrigger asChild>\n          <Button variant="ghost" size="icon" aria-label="Note actions"><MoreHorizontal /></Button>\n        </DropdownMenuTrigger>\n        <DropdownMenuContent align="${align}">\n${actions.map((item) => `          <DropdownMenuItem${item.label === "Archive" && disabled ? " disabled" : ""} onSelect={() => setAction("${item.label} selected in this example.")}>${icons ? `<${item.icon === Archive ? "Archive" : item.icon === Copy ? "Copy" : "Trash2"} size={16} />` : ""}${item.label}</DropdownMenuItem>`).join("\n")}\n        </DropdownMenuContent>\n      </DropdownMenu>\n      <p role="status">{action}</p>\n    </>\n  );`,
  );
  return (
    <Documentation
      path="menu"
      properties={[
        [
          "DropdownMenu: open / onOpenChange",
          "Controlled open state and callback",
          "—",
        ],
        ["DropdownMenuContent: align", "start · center · end", "center"],
        [
          "DropdownMenuContent: sideOffset",
          "Distance from the trigger in pixels",
          "6",
        ],
        [
          "DropdownMenuItem: onSelect",
          "Called on mouse or keyboard selection",
          "—",
        ],
        ["DropdownMenuItem: disabled", "Skip an unavailable action", "false"],
      ]}
      usage={
        <>
          <p>
            Put secondary actions close to the item they affect. Use concise
            verbs and keep destructive actions last. This playground reports
            selections locally so you can test the menu safely.
          </p>
          <p>
            Open with <kbd>Enter</kbd>, move with arrow keys, and select with{" "}
            <kbd>Enter</kbd>. Disabled items are skipped. <kbd>Escape</kbd>{" "}
            returns focus to the trigger.
          </p>
        </>
      }
      playground={
        <Playground
          name="Menu"
          code={code}
          onReset={() => {
            setAlign("end");
            setDisabled(false);
            setIcons(true);
            setAction("No action selected yet.");
          }}
          hint="Open the three-dot menu and pick an action. Try the arrow keys too."
          controls={
            <>
              <SelectControl
                label="Alignment"
                value={align}
                options={["start", "center", "end"]}
                onChange={setAlign}
              />
              <ToggleControl
                label="Disable Archive"
                checked={disabled}
                onChange={setDisabled}
              />
              <ToggleControl
                label="Show icons"
                checked={icons}
                onChange={setIcons}
              />
            </>
          }
        >
          <div className="full-demo">
            <ListRow
              leading={<Bookmark size={20} />}
              title={
                <span className="handwritten">Things to make this weekend</span>
              }
              description="Home · Saved just now"
              trailing={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Note actions"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={align}>
                    {actions.map((item) => (
                      <DropdownMenuItem
                        key={item.label}
                        disabled={item.label === "Archive" && disabled}
                        onSelect={() =>
                          setAction(`${item.label} selected in this example.`)
                        }
                      >
                        {icons ? <item.icon size={16} /> : null}
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
            <p className="demo-status" role="status">
              {action}
            </p>
          </div>
        </Playground>
      }
    />
  );
}

function TooltipDoc() {
  const [side, setSide] = useState<"top" | "right" | "bottom" | "left">("top");
  const [delay, setDelay] = useState<"0" | "300" | "800">("300");
  const [text, setText] = useState("Keep this note close");
  const [saved, setSaved] = useState(false);
  const code = example(
    `import { useState } from "react";\nimport { Bookmark } from "lucide-react";\nimport { Button } from "@samarinara/polli-ui/components/button";\nimport { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@samarinara/polli-ui/components/tooltip";`,
    `  const [saved, setSaved] = useState(false);\n  return (\n    <TooltipProvider delayDuration={${delay}}>\n      <Tooltip>\n        <TooltipTrigger asChild>\n          <Button variant="secondary" size="icon" aria-label="Bookmark note"\n            aria-pressed={saved} onClick={() => setSaved((value) => !value)}>\n            <Bookmark fill={saved ? "currentColor" : "none"} />\n          </Button>\n        </TooltipTrigger>\n        <TooltipContent side="${side}">{${q(text || "Keep this note close")}}</TooltipContent>\n      </Tooltip>\n      <p role="status">{saved ? "Note bookmarked." : "Note is not bookmarked."}</p>\n    </TooltipProvider>\n  );`,
  );
  return (
    <Documentation
      path="tooltip"
      properties={[
        [
          "TooltipProvider: delayDuration",
          "Milliseconds before the tooltip appears on hover",
          "700",
        ],
        ["TooltipContent: side", "top · right · bottom · left", "top"],
        [
          "TooltipContent: sideOffset",
          "Distance from the trigger in pixels",
          "6",
        ],
        ["TooltipTrigger: asChild", "Wrap a focusable control", "false"],
      ]}
      usage={
        <>
          <p>
            A tooltip provides a brief, optional clarification. Give the trigger
            its own accessible name and keep instructions or essential
            information visible on the page.
          </p>
          <p>
            Hover or focus the trigger to see the tooltip. On touch screens, the
            underlying button still works; the action must never depend on
            reading the tooltip.
          </p>
        </>
      }
      playground={
        <Playground
          name="Tooltip"
          code={code}
          onReset={() => {
            setSide("top");
            setDelay("300");
            setText("Keep this note close");
            setSaved(false);
          }}
          hint="Hover or focus the bookmark. Click it to test the action underneath."
          controls={
            <>
              <SelectControl
                label="Side"
                value={side}
                options={["top", "right", "bottom", "left"]}
                onChange={setSide}
              />
              <SelectControl
                label="Delay (ms)"
                value={delay}
                options={["0", "300", "800"]}
                onChange={setDelay}
              />
              <TextControl
                label="Tooltip text"
                value={text}
                onChange={setText}
              />
            </>
          }
        >
          <TooltipProvider delayDuration={Number(delay)}>
            <div className="center-demo">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    aria-label="Bookmark note"
                    aria-pressed={saved}
                    onClick={() => setSaved((value) => !value)}
                  >
                    <Bookmark fill={saved ? "currentColor" : "none"} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={side}>
                  {text || "Keep this note close"}
                </TooltipContent>
              </Tooltip>
              <p className="demo-status" role="status">
                {saved ? "Note bookmarked." : "Note is not bookmarked."}
              </p>
            </div>
          </TooltipProvider>
        </Playground>
      }
    />
  );
}

function FeedbackDoc() {
  const [kind, setKind] = useState<"alert" | "empty state">("alert");
  const [title, setTitle] = useState("Changes saved");
  const [description, setDescription] = useState(
    "Your shopping list is up to date.",
  );
  const [visible, setVisible] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [items, setItems] = useState(0);
  const code =
    kind === "alert"
      ? example(
          `import { useState } from "react";\nimport { Alert } from "@samarinara/polli-ui/components/layout";\nimport { Button } from "@samarinara/polli-ui/components/button";`,
          `  const [visible, setVisible] = useState(true);\n  const [revealed, setRevealed] = useState(false);\n  return (\n    <div>\n      {visible ? <Alert data-polli-motion={revealed ? "interaction" : undefined} title={${q(title || "Changes saved")}}>{${q(description)}}<Button variant="ghost" size="sm" onClick={() => setVisible(false)}>Dismiss message</Button></Alert> : <p role="status">Message dismissed.</p>}\n      <Button onClick={() => { setRevealed(true); setVisible(true); }}>Save changes</Button>\n    </div>\n  );`,
        )
      : example(
          `import { useState } from "react";\nimport { EmptyState, ListRow } from "@samarinara/polli-ui/components/layout";\nimport { Button } from "@samarinara/polli-ui/components/button";`,
          `  const [items, setItems] = useState(0);\n  return items === 0 ? (\n    <EmptyState title={${q(title || "Nothing here yet")}} description={${q(description)}}\n      action={<Button onClick={() => setItems(1)}>Add a note</Button>} />\n  ) : (\n    <div>\n      <ListRow title="My first note" description="Added in this example" />\n      <Button variant="ghost" onClick={() => setItems(0)}>Remove note</Button>\n    </div>\n  );`,
        );
  return (
    <Documentation
      path="layout"
      properties={[
        [
          "Alert: title / children",
          "Heading and result message; announces with role=status",
          "required",
        ],
        [
          "EmptyState: title / description",
          "Explain the empty collection and the next step",
          "required",
        ],
        ["EmptyState: action / icon", "Optional ReactNode", "—"],
      ]}
      usage={
        <>
          <p>
            Confirm a completed action in plain language. Keep the result near
            the task and let people dismiss a message when it is no longer
            useful.
          </p>
          <p>
            An empty state describes what belongs in a collection and offers a
            useful first action. Try adding and removing a note to move between
            empty and populated states.
          </p>
        </>
      }
      playground={
        <Playground
          name="Feedback"
          code={code}
          onReset={() => {
            setKind("alert");
            setTitle("Changes saved");
            setDescription("Your shopping list is up to date.");
            setVisible(true);
            setRevealed(false);
            setItems(0);
          }}
          hint="Dismiss and restore the alert, or switch to an empty state and add a note."
          controls={
            <>
              <SelectControl
                label="Component"
                value={kind}
                options={["alert", "empty state"]}
                onChange={(next) => {
                  setKind(next);
                  setTitle(
                    next === "alert" ? "Changes saved" : "Nothing here yet",
                  );
                  setDescription(
                    next === "alert"
                      ? "Your shopping list is up to date."
                      : "Keep your ideas, recipes, and little reminders here.",
                  );
                  setVisible(true);
                  setItems(0);
                }}
              />
              <TextControl
                label="Message title"
                value={title}
                onChange={setTitle}
              />
              <TextControl
                label="Description"
                value={description}
                onChange={setDescription}
              />
            </>
          }
        >
          <div className="full-demo demo-stack">
            {kind === "alert" ? (
              <>
                {visible ? (
                  <Alert data-polli-motion={revealed ? "interaction" : undefined} title={title || "Changes saved"}>
                    <p>{description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVisible(false)}
                    >
                      Dismiss message
                    </Button>
                  </Alert>
                ) : (
                  <p className="demo-status" role="status">
                    Message dismissed.
                  </p>
                )}
                <Button onClick={() => { setRevealed(true); setVisible(true); }}>Save changes</Button>
              </>
            ) : items === 0 ? (
              <EmptyState
                title={title || "Nothing here yet"}
                description={description}
                icon={<Bookmark size={26} />}
                action={
                  <Button onClick={() => setItems(1)}>
                    <Plus />
                    Add a note
                  </Button>
                }
              />
            ) : (
              <>
                <ListRow
                  title={<span className="handwritten">My first note</span>}
                  description="Added in this example"
                  trailing={<Badge>New</Badge>}
                />
                <Button variant="ghost" onClick={() => setItems(0)}>
                  Remove note
                </Button>
                <p className="demo-status" role="status">
                  1 note in this collection.
                </p>
              </>
            )}
          </div>
        </Playground>
      }
    />
  );
}

function ListsDoc() {
  const [name, setName] = useState("Alex Chen");
  const [tone, setTone] = useState<(typeof tones)[number]>("coral");
  const [surface, setSurface] = useState(false);
  const [visible, setVisible] = useState(true);
  const person = name.trim() || "Alex Chen";
  const rows = (
    <>
      <ListRow
        leading={<Avatar name={person} />}
        title={person}
        description="Birthday · 12 June"
        trailing={<Badge tone={tone}>People</Badge>}
      />
      <Separator />
      {visible ? (
        <ListRow
          leading={<Bookmark size={20} />}
          title={<span className="handwritten">A few things to remember</span>}
          description="Home · Saved note"
          trailing={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove saved note"
              onClick={() => setVisible(false)}
            >
              <Trash2 />
            </Button>
          }
        />
      ) : (
        <Button variant="secondary" onClick={() => setVisible(true)}>
          Restore saved note
        </Button>
      )}
    </>
  );
  const code = example(
    `import { useState } from "react";\nimport { Bookmark, Trash2 } from "lucide-react";\nimport { Avatar, ListRow, Separator${surface ? ", Surface" : ""} } from "@samarinara/polli-ui/components/layout";\nimport { Badge } from "@samarinara/polli-ui/components/badge";\nimport { Button } from "@samarinara/polli-ui/components/button";`,
    `  const [visible, setVisible] = useState(true);\n  return (\n    <${surface ? "Surface" : "div"}>\n      <ListRow leading={<Avatar name={${q(person)}} />} title={${q(person)}}\n        description="Birthday · 12 June" trailing={<Badge tone="${tone}">People</Badge>} />\n      <Separator />\n      {visible ? <ListRow leading={<Bookmark size={20} />} title="A few things to remember"\n        description="Home · Saved note" trailing={\n          <Button variant="ghost" size="icon" aria-label="Remove saved note" onClick={() => setVisible(false)}><Trash2 /></Button>\n        } /> : <Button variant="secondary" onClick={() => setVisible(true)}>Restore saved note</Button>}\n    </${surface ? "Surface" : "div"}>\n  );`,
  );
  return (
    <Documentation
      path="layout"
      properties={[
        [
          "Avatar: name / src",
          "Accessible name; initials when src is omitted",
          "name required",
        ],
        [
          "ListRow: title / description",
          "Primary content and optional supporting text",
          "title required",
        ],
        [
          "ListRow: leading / trailing",
          "Optional icon, avatar, badge, or action",
          "—",
        ],
        [
          "Surface / Separator",
          "Native div / hr props, including className",
          "—",
        ],
      ]}
      usage={
        <>
          <p>
            Use alignment and space to connect a collection. A separator marks a
            change in context, while a surface groups content that belongs
            together.
          </p>
          <p>
            Avatars use initials when no image is supplied. Name row actions
            explicitly so keyboard and screen-reader users know which item they
            affect.
          </p>
        </>
      }
      playground={
        <Playground
          name="Lists"
          code={code}
          onReset={() => {
            setName("Alex Chen");
            setTone("coral");
            setSurface(false);
            setVisible(true);
          }}
          hint="Edit the name to change the initials. Remove and restore the saved note."
          controls={
            <>
              <TextControl
                label="Person name"
                value={name}
                onChange={setName}
              />
              <SelectControl
                label="Category tone"
                value={tone}
                options={tones}
                onChange={setTone}
              />
              <ToggleControl
                label="Use a surface"
                checked={surface}
                onChange={setSurface}
              />
            </>
          }
        >
          <div className="full-demo">
            {surface ? <Surface>{rows}</Surface> : rows}
            <p className="demo-status" role="status">
              {visible ? "2 rows in this example." : "Saved note removed."}
            </p>
          </div>
        </Playground>
      }
    />
  );
}

export function ComponentContent({ page }: { page: PageId }) {
  switch (page) {
    case "buttons":
      return <ButtonDoc />;
    case "fields":
      return <FieldsDoc />;
    case "checkbox":
      return <CheckboxDoc />;
    case "switch":
      return <SwitchDoc />;
    case "badge":
      return <BadgeDoc />;
    case "tabs":
      return <TabsDoc />;
    case "accordion":
      return <AccordionDoc />;
    case "dialog":
      return <DialogDoc />;
    case "menu":
      return <MenuDoc />;
    case "tooltip":
      return <TooltipDoc />;
    case "feedback":
      return <FeedbackDoc />;
    case "lists":
      return <ListsDoc />;
    default:
      return null;
  }
}
