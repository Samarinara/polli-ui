import { ArrowDownToLine } from "lucide-react";
import { palette } from "@samarinara/polli-ui/tokens";
import { Section, Code, Preview, CopyButton, RelatedLink } from "./ui";
import { type PageId, pageHref } from "./pages";
import {
  ButtonExample,
  FieldExample,
  SelectionExample,
  NavigationExample,
  OverlayExample,
  FeedbackExample,
} from "./examples";

const colours = [
  {
    name: "Polli Green",
    token: "green",
    hex: palette.green,
    use: "Brand anchor, primary action, focus",
  },
  {
    name: "Soft Coral",
    token: "coral",
    hex: palette.coral,
    use: "People, favourites, warmth",
  },
  {
    name: "Butter Yellow",
    token: "yellow",
    hex: palette.yellow,
    use: "Ideas, planning, highlights",
  },
  {
    name: "Sky Blue",
    token: "blue",
    hex: palette.blue,
    use: "Saved things, inspiration",
  },
  {
    name: "Cloud White",
    token: "white",
    hex: palette.white,
    use: "The default canvas",
  },
  {
    name: "Mint",
    token: "mint",
    hex: palette.mint,
    use: "Selection, secondary actions",
  },
  {
    name: "Ink",
    token: "ink",
    hex: palette.ink,
    use: "Text on the canvas and pastels",
  },
] as const;

export function Content({ page }: { page: PageId }) {
  switch (page) {
    case "overview":
      return (
        <>
          <div
            className="brand-specimen"
            aria-label="Example of Polli typography and colours"
          >
            <span className="specimen-label">The Polli visual language</span>
            <p className="specimen-title">A place for everyday life.</p>
            <p className="handwritten specimen-note">
              Recipes, ideas, and things worth keeping.
            </p>
            <div className="specimen-palette" aria-hidden="true">
              {colours.slice(0, 4).map((colour) => (
                <span
                  key={colour.token}
                  style={{ backgroundColor: colour.hex }}
                />
              ))}
            </div>
          </div>
          <Section id="the-brand" title="The brand">
            <p>
              Polli is a family of small, connected applications for everyday
              life. A recipe, a note, or a saved link should feel at home in the
              same ecosystem.
            </p>
            <p>
              The identity combines editorial clarity with the warmth of a
              notebook: a stable printed structure, personal handwritten
              content, and soft colour accents. People keep control of their
              data through open standards and portable formats.
            </p>
          </Section>
          <Section id="principles" title="Design principles">
            <dl className="principle-list">
              <div>
                <dt>Give the content room</dt>
                <dd>
                  Organise with spacing and alignment. Add a container only when
                  it explains a relationship.
                </dd>
              </div>
              <div>
                <dt>Keep the structure steady</dt>
                <dd>
                  Use serif headings for permanent structure and readable
                  handwriting for personal content.
                </dd>
              </div>
              <div>
                <dt>Reveal detail when it helps</dt>
                <dd>
                  Put the everyday task first. Make secondary options available
                  at the point of use.
                </dd>
              </div>
              <div>
                <dt>Make actions feel considered</dt>
                <dd>
                  Keep pages still. Use a restrained response to a click, a
                  clear focus state, and predictable controls.
                </dd>
              </div>
            </dl>
          </Section>
          <Section id="using-this-guide" title="Using this guide">
            <p>
              Start with the brand foundations, then use the interface guidance
              to compose an experience. The component examples show the shared
              package in use.
            </p>
            <div className="related-links">
              <RelatedLink id="colour">
                Colour palette and accessible pairings
              </RelatedLink>
              <RelatedLink id="typography">
                Typography and personal content
              </RelatedLink>
              <RelatedLink id="components">
                Components and live examples
              </RelatedLink>
              <RelatedLink id="getting-started">
                Install the shared package
              </RelatedLink>
            </div>
          </Section>
        </>
      );
    case "logo":
      return (
        <>
          <Section id="wordmark" title="Wordmark">
            <p>
              Use the official Polli wordmark for the parent brand. The file
              below is the original SVG from polli.page.
            </p>
            <div className="logo-specimen">
              <img
                src="./brand/polli-wordmark.svg"
                width="240"
                height="107"
                alt="Polli wordmark"
              />
            </div>
            <a
              className="download-link"
              href="./brand/polli-wordmark.svg"
              download="polli-wordmark.svg"
            >
              <ArrowDownToLine size={16} />
              Download wordmark<small>SVG</small>
            </a>
            <h3 className="mascot-heading">Mascot</h3>
            <p>
              Use the original mascot as a supporting illustration, with the
              wordmark as the brand signature.
            </p>
            <div className="logo-specimen">
              <img
                src="./brand/polli-mascot.svg"
                width="150"
                height="110"
                alt="Polli mascot"
              />
            </div>
            <a
              className="download-link"
              href="./brand/polli-mascot.svg"
              download="polli-mascot.svg"
            >
              <ArrowDownToLine size={16} />
              Download mascot<small>SVG</small>
            </a>
          </Section>
          <Section id="placement" title="Placement">
            <p>
              Align the wordmark with the surrounding content. In an app header,
              keep it small enough that the app’s title and primary task remain
              clear.
            </p>
            <ul>
              <li>
                Leave at least one letter-height of clear space around the
                artwork.
              </li>
              <li>
                Use a plain, light background with enough contrast to preserve
                the original colours.
              </li>
              <li>
                Check the mark at its final display size. The example header
                uses a width of 78px.
              </li>
            </ul>
          </Section>
          <Section id="care" title="Handling the artwork">
            <p>
              Preserve the proportions and original paths. Do not stretch,
              rotate, add shadows, or replace the lettering with a typed
              approximation.
            </p>
            <p>
              The mascot is a separate brand asset. Use the supplied original
              artwork; a decorative flower glyph should not stand in for the
              Polli identity.
            </p>
          </Section>
        </>
      );
    case "colour":
      return (
        <>
          <Section id="palette" title="Brand palette">
            <p>
              These seven colours are the shared foundation. Click a hex value
              to copy it.
            </p>
            <div className="colour-grid">
              {colours.map((colour) => (
                <div className="colour-item" key={colour.token}>
                  <div
                    className="colour-swatch"
                    style={{ backgroundColor: colour.hex }}
                  />
                  <h3>{colour.name}</h3>
                  <CopyButton value={colour.hex} label={colour.hex} />
                  <p>{colour.use}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section id="roles" title="Colour roles">
            <p>
              Use Cloud White for the canvas and Ink for body text. Reserve
              Polli Green for the brand, a primary action, and focus. Pastels
              work best in small, purposeful areas.
            </p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>CSS variable</th>
                    <th>Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Canvas</td>
                    <td>
                      <code>--background</code>
                    </td>
                    <td>Cloud White</td>
                  </tr>
                  <tr>
                    <td>Text</td>
                    <td>
                      <code>--foreground</code>
                    </td>
                    <td>Ink</td>
                  </tr>
                  <tr>
                    <td>Primary action</td>
                    <td>
                      <code>--primary</code>
                    </td>
                    <td>Polli Green</td>
                  </tr>
                  <tr>
                    <td>Selection</td>
                    <td>
                      <code>--accent</code>
                    </td>
                    <td>Mint</td>
                  </tr>
                  <tr>
                    <td>Keyboard focus</td>
                    <td>
                      <code>--ring</code>
                    </td>
                    <td>Polli Green</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Code label="CSS">
              {
                ".app-highlight {\n  background: var(--polli-yellow);\n  color: var(--polli-ink);\n}"
              }
            </Code>
          </Section>
          <Section id="contrast" title="Accessible pairings">
            <p>
              Use Ink on the pastels and Cloud White on Polli Green. Each of
              these text pairings exceeds a 4.5:1 contrast ratio. Use labels or
              icons alongside colour to explain a state.
            </p>
            <div className="contrast-examples">
              <div style={{ background: palette.green, color: palette.white }}>
                Cloud White on Green
              </div>
              <div style={{ background: palette.coral, color: palette.ink }}>
                Ink on Coral
              </div>
              <div style={{ background: palette.yellow, color: palette.ink }}>
                Ink on Yellow
              </div>
              <div style={{ background: palette.blue, color: palette.ink }}>
                Ink on Blue
              </div>
            </div>
            <p className="note">
              Pastels are backgrounds and accents. White text on a pastel does
              not provide enough contrast for body text.
            </p>
          </Section>
        </>
      );
    case "typography":
      return (
        <>
          <Section id="type-roles" title="Type roles">
            <div className="type-role">
              <span className="type-caption">Lora · Structure</span>
              <p className="type-serif">A place for your ideas.</p>
              <p>
                Titles, section headings, and permanent labels. A readable serif
                gives the interface the feel of a printed book.
              </p>
            </div>
            <div className="type-role">
              <span className="type-caption">Inter · Guidance</span>
              <p className="type-sans">Everything has a place.</p>
              <p>
                Body copy, navigation, buttons, help text, and dense
                information. Keep instructions easy to scan.
              </p>
            </div>
            <div className="type-role">
              <span className="type-caption">
                Patrick Hand · Personal content
              </span>
              <p className="type-hand">Pick up flowers on the way home.</p>
              <p>
                Notes, recipe titles, and short user-entered text. The open
                letterforms keep the handwriting legible.
              </p>
            </div>
            <p className="note">
              The documentation hosts these open source fonts locally. Other
              apps can supply their fonts through the shared typography
              variables.
            </p>
          </Section>
          <Section id="hierarchy" title="Hierarchy">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Typeface</th>
                    <th>Size / line height</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Page title</td>
                    <td>Lora</td>
                    <td>40–44px / 1.15</td>
                  </tr>
                  <tr>
                    <td>Section heading</td>
                    <td>Lora</td>
                    <td>24px / 1.35</td>
                  </tr>
                  <tr>
                    <td>Body</td>
                    <td>Inter</td>
                    <td>15–16px / 1.75</td>
                  </tr>
                  <tr>
                    <td>Navigation & help</td>
                    <td>Inter</td>
                    <td>13–14px / 1.5</td>
                  </tr>
                  <tr>
                    <td>Personal content</td>
                    <td>Patrick Hand</td>
                    <td>20px / 1.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Use sentence case and regular or medium weights. Let size and
              space establish the hierarchy before adding heavier type.
            </p>
          </Section>
          <Section id="personal-content" title="Personal content">
            <Preview label="Printed label, personal value">
              <div className="notebook-field">
                <span>Recipe title</span>
                <p className="handwritten">Grandma’s lemon cake</p>
              </div>
            </Preview>
            <p>
              Apply handwriting to the value, while keeping labels and
              instructions in their permanent roles. For long text, addresses,
              code, or anything that requires precise scanning, offer a
              conventional text style.
            </p>
            <Code label="CSS">
              {
                '.polli-root {\n  --polli-font-heading: "Lora", Georgia, serif;\n  --polli-font-body: "Inter", system-ui, sans-serif;\n  --polli-font-input: "Patrick Hand", cursive;\n}'
              }
            </Code>
          </Section>
        </>
      );
    case "layout":
      return (
        <>
          <Section id="composition" title="Composition">
            <p>
              Start with one continuous canvas and a clear reading order. Align
              related elements, use margins to group them, and keep the main
              task easy to find.
            </p>
            <Preview label="Grouping through space">
              <div className="layout-example">
                <h3>This weekend</h3>
                <div>
                  <span className="handwritten">Bake a lemon cake</span>
                  <small>Recipes</small>
                </div>
                <div>
                  <span className="handwritten">Pick up flowers</span>
                  <small>Home</small>
                </div>
                <div>
                  <span className="handwritten">Call Alex</span>
                  <small>People</small>
                </div>
              </div>
            </Preview>
            <p>
              Use a divider when it marks a real change in context. A background
              surface can group a meaningful collection; individual list items
              usually need only alignment and space.
            </p>
          </Section>
          <Section id="spacing" title="Spacing & shape">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Relationship</th>
                    <th>Spacing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Icon and label</td>
                    <td>8px</td>
                  </tr>
                  <tr>
                    <td>Items within a control group</td>
                    <td>12–16px</td>
                  </tr>
                  <tr>
                    <td>Fields within a form</td>
                    <td>24px</td>
                  </tr>
                  <tr>
                    <td>Related content groups</td>
                    <td>32px</td>
                  </tr>
                  <tr>
                    <td>Major sections</td>
                    <td>48px</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Build on a 4px rhythm. Use round buttons and soft input corners.
              Reserve shadows for overlays, where they communicate that a
              surface floats above the page.
            </p>
            <p>
              Keep reading columns around 60–75 characters wide. On narrow
              screens, collapse supporting navigation and preserve the content’s
              reading order.
            </p>
          </Section>
          <Section id="disclosure" title="Progressive disclosure">
            <p>
              Show the title, the essential fields, and the next action first.
              Place secondary options in a nearby accordion, menu, or dialog.
            </p>
            <ul>
              <li>Keep required fields and validation visible.</li>
              <li>Name a collapsed section by the options it contains.</li>
              <li>Allow keyboard users to reach every action.</li>
              <li>Return focus to the trigger when an overlay closes.</li>
            </ul>
            <RelatedLink id="components">
              See navigation and overlay examples
            </RelatedLink>
          </Section>
        </>
      );
    case "components":
      return (
        <>
          <Section id="buttons" title="Buttons">
            <p>
              Use one primary action per task. Secondary actions use Mint;
              low-priority actions can be text buttons. Hover changes colour,
              and a press compresses the control slightly without lifting it.
            </p>
            <Preview>
              <ButtonExample />
            </Preview>
            <Code>
              {
                'import { Button } from "@samarinara/polli-ui/components/button";\n\n<Button onClick={saveNote}>Save note</Button>\n<Button variant="secondary">Cancel</Button>'
              }
            </Code>
            <p className="api-note">
              <code>variant</code>: default, secondary, coral, butter, sky,
              ghost, destructive.
              <br />
              <code>size</code>: sm, default, lg, icon. Use <code>asChild</code>{" "}
              for links and name icon-only actions.
            </p>
          </Section>
          <Section id="fields" title="Fields">
            <p>
              Keep labels above the value, use concise help text, and put errors
              next to the field. Inputs stay visually connected to the canvas.
            </p>
            <Preview>
              <FieldExample />
            </Preview>
            <Code>
              {
                'import { Field, Input, Label } from "@samarinara/polli-ui/components/field";\n\n<Field label={<Label htmlFor="title">Title</Label>}>\n  <Input id="title" name="title" required />\n</Field>'
              }
            </Code>
            <p className="api-note">
              <code>Field</code> accepts <code>label</code>, <code>hint</code>,
              and <code>error</code>. Connect help or errors with{" "}
              <code>aria-describedby</code> and set <code>aria-invalid</code>{" "}
              when a value is invalid. Use <code>Textarea</code> for longer
              content and <code>NativeSelect</code> for a short list of options.
            </p>
          </Section>
          <Section id="selection" title="Selection">
            <p>
              A checkbox selects an item. A switch turns a preference on or off.
              Badges describe categories or state; they are not controls.
            </p>
            <Preview>
              <SelectionExample />
            </Preview>
            <Code>
              {
                'import { Checkbox, Switch } from "@samarinara/polli-ui/components/selection";\n\n<Checkbox id="done" checked={done} onCheckedChange={setDone} />\n<Label htmlFor="done">Add lemons</Label>\n<Switch aria-label="Shared categories" defaultChecked />'
              }
            </Code>
          </Section>
          <Section id="navigation" title="Navigation">
            <p>
              Use tabs for closely related views and accordions for secondary
              detail. Both support keyboard navigation through the shared Radix
              primitives.
            </p>
            <Preview>
              <NavigationExample />
            </Preview>
            <Code>
              {
                'import { Tabs, TabsList, TabsTrigger, TabsContent }\n  from "@samarinara/polli-ui/components/tabs";\n\n<Tabs defaultValue="notes">\n  <TabsList aria-label="Saved content">\n    <TabsTrigger value="notes">Notes</TabsTrigger>\n  </TabsList>\n  <TabsContent value="notes">Your notes</TabsContent>\n</Tabs>'
              }
            </Code>
          </Section>
          <Section id="overlays" title="Overlays">
            <p>
              Use a dialog for a focused task, a menu for nearby actions, and a
              tooltip for a short clarification. Dialogs need a title and a
              description; Escape closes them and restores focus.
            </p>
            <Preview>
              <OverlayExample />
            </Preview>
            <Code>
              {
                'import { Dialog, DialogTrigger, DialogContent, DialogTitle,\n  DialogDescription } from "@samarinara/polli-ui/components/dialog";\n\n<Dialog>\n  <DialogTrigger asChild><Button>Add category</Button></DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Add category</DialogTitle>\n    <DialogDescription>Choose a name for your category.</DialogDescription>\n  </DialogContent>\n</Dialog>'
              }
            </Code>
            <p className="api-note">
              Menus are exported from <code>/components/menu</code>; tooltips
              from <code>/components/tooltip</code>. Wrap tooltip examples in{" "}
              <code>TooltipProvider</code>.
            </p>
          </Section>
          <Section id="feedback" title="Feedback & lists">
            <p>
              Confirm the result in plain language. Use open list rows for
              related content and a short, useful message when a collection is
              empty.
            </p>
            <Preview>
              <FeedbackExample />
            </Preview>
            <Code>
              {
                'import { Alert, Avatar, ListRow }\n  from "@samarinara/polli-ui/components/layout";\n\n<Alert title="Changes saved">Your shopping list is up to date.</Alert>\n<ListRow leading={<Avatar name="Alex Chen" />}\n  title="Alex Chen" description="Birthday · 12 June" />'
              }
            </Code>
            <p className="api-note">
              <code>Surface</code> groups meaningful content.{" "}
              <code>Separator</code> marks a change in context.{" "}
              <code>EmptyState</code> accepts a title, description, optional
              icon, and an optional action.
            </p>
          </Section>
        </>
      );
    case "motion":
      return (
        <>
          <Section id="interaction" title="Interaction">
            <p>
              Let the user’s action start the movement. A button can compress
              slightly on press, a selection can change state, and an overlay
              can appear in response to its trigger.
            </p>
            <Preview label="Press response">
              <ButtonExample />
            </Preview>
            <p>
              Hover should change colour or emphasis. Avoid vertical lift on
              buttons. Reading content, headings, and navigation should appear
              in their final position immediately.
            </p>
          </Section>
          <Section id="timing" title="Timing">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Response</th>
                    <th>Guideline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hover or focus colour</td>
                    <td>100–150ms</td>
                  </tr>
                  <tr>
                    <td>Button press</td>
                    <td>100ms; scale to 0.97</td>
                  </tr>
                  <tr>
                    <td>State change</td>
                    <td>150–200ms when movement adds meaning</td>
                  </tr>
                  <tr>
                    <td>Page content</td>
                    <td>Immediate; no entrance sequence</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              A response should settle quickly. Repeated bouncing, idle
              movement, and staggered reveals make the interface harder to read.
            </p>
          </Section>
          <Section id="reduced-motion" title="Reduced motion">
            <p>
              Respect <code>prefers-reduced-motion</code>. Keep state changes
              clear through colour, text, and icons when movement is reduced.
            </p>
            <Code label="CSS">
              {
                "@media (prefers-reduced-motion: reduce) {\n  [data-polli] {\n    animation: none !important;\n    transition: none !important;\n    transform: none !important;\n  }\n}"
              }
            </Code>
            <p>
              Use a loading indicator only while something is actually loading.
              These docs render every page as static HTML, with no skeleton
              screen or artificial loading delay.
            </p>
          </Section>
        </>
      );
    case "voice":
      return (
        <>
          <Section id="tone" title="Tone of voice">
            <p>
              Polli sounds approachable, capable, and direct. Write as if you
              are helping someone use their own notebook: familiar words, clear
              actions, and enough context to proceed.
            </p>
            <ul>
              <li>Say what the action does.</li>
              <li>Use sentence case and short sentences.</li>
              <li>
                Keep personality in the brand; keep instructions specific.
              </li>
              <li>Explain errors with a way to fix them.</li>
            </ul>
          </Section>
          <Section id="interface-copy" title="Interface copy">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Situation</th>
                    <th>Use</th>
                    <th>Avoid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Primary action</td>
                    <td>Save recipe</td>
                    <td>Make something wonderful</td>
                  </tr>
                  <tr>
                    <td>Success</td>
                    <td>Recipe saved</td>
                    <td>All together now!</td>
                  </tr>
                  <tr>
                    <td>Empty collection</td>
                    <td>No saved links. Save a link to find it here later.</td>
                    <td>A little room to grow</td>
                  </tr>
                  <tr>
                    <td>Invalid email</td>
                    <td>Enter a complete email address.</td>
                    <td>Something went wrong</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Do not repeat a heading in its description. Remove introductory
              text when the label and control already explain the task.
            </p>
          </Section>
          <Section id="naming" title="Names & terminology">
            <p>
              Use <strong>Polli</strong> for the brand and{" "}
              <strong>polli.page</strong> for the shared platform. Use the
              individual app name when referring to an app-specific task.
            </p>
            <p>
              Call the shared organisational unit a <strong>category</strong>.
              Use the same term in fields, menus, and help text across
              applications.
            </p>
          </Section>
        </>
      );
    case "getting-started":
      return (
        <>
          <Section id="install" title="Install the package">
            <p>
              The package is published to GitHub Packages. Configure the scope
              in your app’s <code>.npmrc</code> and supply a package-read token
              through the environment.
            </p>
            <Code label=".npmrc">
              {
                "@samarinara:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}"
              }
            </Code>
            <Code label="Terminal">
              {"npm install @samarinara/polli-ui@latest"}
            </Code>
            <p className="note">
              Keep the token out of source control. For a private package, grant
              the consuming repository access in the package settings.
            </p>
          </Section>
          <Section id="use" title="Use the components">
            <p>
              Import the stylesheet once at the app entry point, then wrap the
              interface in <code>polli-root</code>. The package ships compiled
              CSS and TypeScript declarations.
            </p>
            <Code>
              {
                'import "@samarinara/polli-ui/styles.css";\nimport { Button } from "@samarinara/polli-ui/components/button";\nimport { Input, Label } from "@samarinara/polli-ui/components/field";\n\nexport function AddNote() {\n  return <form className="polli-root" onSubmit={saveNote}>\n    <Label htmlFor="title">Title</Label>\n    <Input id="title" name="title" required />\n    <Button type="submit">Save note</Button>\n  </form>;\n}'
              }
            </Code>
            <p>
              React and React DOM are peer dependencies. The package supports
              React 18.3 and 19. Load your chosen fonts and set the typography
              variables described in{" "}
              <a href={pageHref("typography")}>Typography</a>.
            </p>
          </Section>
          <Section id="registry" title="shadcn registry">
            <p>
              The site serves registry entries that install thin re-exports of
              the shared package. Configure GitHub Packages first, then add a
              component using your docs site’s URL.
            </p>
            <Code label="Terminal">
              {
                "# Replace the URL with the deployed guidelines URL.\nnpx shadcn@latest add https://YOUR-DOCS-HOST/r/polli-button.json"
              }
            </Code>
            <p>
              <a href="./registry.json">View the registry</a>. Import shared
              components to receive package updates. An implementation copied
              into an app and edited locally becomes an intentional fork.
            </p>
            <RelatedLink id="components">
              Browse the component examples
            </RelatedLink>
          </Section>
        </>
      );
  }
}
