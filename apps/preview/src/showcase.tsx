import { useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  MoreHorizontal,
  Bookmark,
  Trash2,
  MousePointer2,
  TextCursorInput,
  CheckSquare,
  ToggleRight,
  Tag,
  PanelsTopLeft,
  ListCollapse,
  PanelTop,
  List,
  MessageSquare,
  CheckCheck,
  Rows3,
} from "lucide-react";
import { Button } from "@samarinara/polli-ui/components/button";
import { Badge } from "@samarinara/polli-ui/components/badge";
import { Input, Label } from "@samarinara/polli-ui/components/field";
import { Checkbox } from "@samarinara/polli-ui/components/selection";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@samarinara/polli-ui/components/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@samarinara/polli-ui/components/menu";
import { AnimatedIcon } from "@samarinara/polli-ui/components/animated-icon";
import { InkText, InkRemoval } from "@samarinara/polli-ui/components/ink";
import { ListRow, EmptyState } from "@samarinara/polli-ui/components/layout";
import { Section, RelatedLink } from "./ui";
import { Playground, SelectControl, ToggleControl } from "./playground";
import { pageHref, type PageId } from "./pages";

const components = [
  {
    id: "buttons",
    title: "Button",
    description: "Variants, sizes & press states",
    icon: MousePointer2,
  },
  {
    id: "fields",
    title: "Fields",
    description: "Inputs, textareas & validation",
    icon: TextCursorInput,
  },
  {
    id: "checkbox",
    title: "Checkbox",
    description: "Checked, mixed & disabled",
    icon: CheckSquare,
  },
  {
    id: "switch",
    title: "Switch",
    description: "Immediate preferences",
    icon: ToggleRight,
  },
  {
    id: "badge",
    title: "Badge",
    description: "Categories & pastel tones",
    icon: Tag,
  },
  {
    id: "tabs",
    title: "Tabs",
    description: "Related views & keyboard control",
    icon: PanelsTopLeft,
  },
  {
    id: "accordion",
    title: "Accordion",
    description: "Single & multiple disclosure",
    icon: ListCollapse,
  },
  {
    id: "dialog",
    title: "Dialog",
    description: "Forms, focus & dismissal",
    icon: PanelTop,
  },
  {
    id: "menu",
    title: "Dropdown menu",
    description: "Actions & placement",
    icon: List,
  },
  {
    id: "tooltip",
    title: "Tooltip",
    description: "Hover, focus & delay",
    icon: MessageSquare,
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Alerts & useful empty states",
    icon: CheckCheck,
  },
  {
    id: "lists",
    title: "Lists & surfaces",
    description: "Rows, avatars & collections",
    icon: Rows3,
  },
] satisfies Array<{
  id: PageId;
  title: string;
  description: string;
  icon: typeof Plus;
}>;

export function ComponentCatalogue() {
  return (
    <div className="component-catalogue">
      {components.map((item) => (
        <a className="component-card" href={pageHref(item.id)} key={item.id}>
          <item.icon size={20} strokeWidth={1.6} />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <span>
            Open playground <ArrowRight size={13} />
          </span>
        </a>
      ))}
    </div>
  );
}

const initialNotes = [
  { id: 1, title: "Bake a lemon cake", category: "Recipes", done: false },
  {
    id: 2,
    title: "Pick up flowers for the table",
    category: "Home",
    done: false,
  },
];
const notebookCode = (
  category: string,
  showCompleted: boolean,
) => `import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@samarinara/polli-ui/components/button";
import { Input, Label } from "@samarinara/polli-ui/components/field";
import { Checkbox } from "@samarinara/polli-ui/components/selection";
import { Badge } from "@samarinara/polli-ui/components/badge";
import { ListRow } from "@samarinara/polli-ui/components/layout";
import { InkText, InkRemoval } from "@samarinara/polli-ui/components/ink";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@samarinara/polli-ui/components/menu";

export function Notebook() {
  const [notes, setNotes] = useState(${JSON.stringify(initialNotes, null, 2).replaceAll("\n", "\n  ")});
  const [title, setTitle] = useState("");
  const [nextId, setNextId] = useState(3);
  const [removing, setRemoving] = useState<number[]>([]);
  const [notice, setNotice] = useState("Try adding a note or completing an item.");
  const visible = notes.filter((note) => ${showCompleted ? "true" : "!note.done"});
  return (
    <div className="polli-root">
      <h2>A little notebook</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim()) { setNotice("Write a note before adding it."); return; }
        setNotes((items) => [...items, { id: nextId, title: title.trim(), category: ${JSON.stringify(category)}, done: false }]);
        setNextId((id) => id + 1);
        setTitle("");
        setNotice("Note added in this example.");
      }}>
        <Label htmlFor="new-note">A new note</Label>
        <Input id="new-note" placeholder="Something worth remembering" value={title} onChange={(event) => setTitle(event.target.value)} />
        <Button type="submit">Add note</Button>
      </form>
      {visible.map((note) => (
        <InkRemoval key={note.id} removed={removing.includes(note.id)} onExitComplete={() => {
          setNotes((items) => items.filter((item) => item.id !== note.id));
          setRemoving((items) => items.filter((id) => id !== note.id));
          setNotice("Note removed in this example.");
        }}>
        <ListRow
          leading={<Checkbox aria-label={\`Complete \${note.title}\`} checked={note.done}
            onCheckedChange={(done) => setNotes((items) => items.map((item) => item.id === note.id ? { ...item, done: done === true } : item))} />}
          title={<InkText crossedOut={note.done}>{note.title}</InkText>} description={<Badge>{note.category}</Badge>}
          trailing={<DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={\`Actions for \${note.title}\`}><MoreHorizontal /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" onCloseAutoFocus={(event) => {
              if (removing.includes(note.id)) { event.preventDefault(); document.getElementById("new-note")?.focus(); }
            }}><DropdownMenuItem onSelect={() => {
              document.getElementById("new-note")?.focus();
              setRemoving((items) => [...items, note.id]);
            }}><Trash2 size={16} />Delete note</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>} />
        </InkRemoval>
      ))}
      {visible.length === 0 ? <p>No notes in this view.</p> : null}
      <p role="status">{notice}</p>
    </div>
  );
}`;

function Notebook() {
  const [notes, setNotes] = useState(initialNotes);
  const [removing, setRemoving] = useState<number[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [nextId, setNextId] = useState(3);
  const [category, setCategory] = useState<"Ideas" | "Recipes" | "Home">(
    "Ideas",
  );
  const [showCompleted, setShowCompleted] = useState(true);
  const [tab, setTab] = useState("notes");
  const [bookmarked, setBookmarked] = useState(false);
  const [notice, setNotice] = useState(
    "Try adding a note or completing an item.",
  );
  const [invalid, setInvalid] = useState(false);
  const id = useId();
  const visible = notes.filter((note) => showCompleted || !note.done);
  const reset = () => {
    setNotes(initialNotes);
    setRemoving([]);
    setTitle("");
    setNextId(3);
    setCategory("Ideas");
    setShowCompleted(true);
    setTab("notes");
    setBookmarked(false);
    setNotice("Try adding a note or completing an item.");
    setInvalid(false);
  };
  return (
    <Playground
      name="Notebook"
      className="notebook-playground"
      code={notebookCode(category, showCompleted)}
      onReset={reset}
      hint="Everything here works. Add a note, check it off, switch views, or open a row's menu. Changes stay in this example."
      controls={
        <>
          <SelectControl
            label="New note category"
            value={category}
            options={["Ideas", "Recipes", "Home"]}
            onChange={setCategory}
          />
          <ToggleControl
            label="Show completed"
            checked={showCompleted}
            onChange={setShowCompleted}
          />
        </>
      }
    >
      <div className="notebook-demo">
        <div className="notebook-heading">
          <div>
            <h3>A little notebook</h3>
          </div>
          <Badge tone="neutral">{notes.length} notes</Badge>
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList aria-label="Notebook views">
            <TabsTrigger value="notes" inkTone="butter">Notes</TabsTrigger>
            <TabsTrigger value="links" inkTone="sky">Saved links</TabsTrigger>
          </TabsList>
          <TabsContent value="notes">
            <form
              className="notebook-compose"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                if (!title.trim()) {
                  setInvalid(true);
                  setNotice("Write a note before adding it.");
                  return;
                }
                setNotes((items) => [
                  ...items,
                  { id: nextId, title: title.trim(), category, done: false },
                ]);
                setNextId((value) => value + 1);
                setTitle("");
                setInvalid(false);
                setNotice("Note added in this example.");
              }}
            >
              <div>
                <Label htmlFor={id}>A new note</Label>
                <Input
                  ref={input}
                  id={id}
                  placeholder="Something worth remembering"
                  value={title}
                  aria-invalid={invalid}
                  aria-describedby={`${id}-status`}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setInvalid(false);
                  }}
                />
              </div>
              <Button type="submit" size="sm">
                <Plus />
                Add note
              </Button>
            </form>
            <div className="notebook-rows">
              {visible.map((note) => (
                <InkRemoval key={note.id} removed={removing.includes(note.id)} onExitComplete={() => {
                  setNotes(items => items.filter(item => item.id !== note.id));
                  setRemoving(items => items.filter(item => item !== note.id));
                  setNotice("Note removed in this example.");
                }}>
                <ListRow
                  className={note.done ? "note-complete" : undefined}
                  key={note.id}
                  leading={
                    <Checkbox
                      aria-label={`Complete ${note.title}`}
                      checked={note.done}
                      onCheckedChange={(done) => {
                        setNotes((items) =>
                          items.map((item) =>
                            item.id === note.id
                              ? { ...item, done: done === true }
                              : item,
                          ),
                        );
                        setNotice(
                          done
                            ? "Note marked complete."
                            : "Note marked incomplete.",
                        );
                      }}
                    />
                  }
                  title={
                    <InkText className="note-title" crossedOut={note.done}>{note.title}</InkText>
                  }
                  description={
                    <Badge
                      tone={
                        note.category === "Recipes"
                          ? "butter"
                          : note.category === "Home"
                            ? "sky"
                            : "mint"
                      }
                    >
                      {note.category}
                    </Badge>
                  }
                  trailing={
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Actions for ${note.title}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onCloseAutoFocus={event => {
                        if (removing.includes(note.id)) { event.preventDefault(); input.current?.focus(); }
                      }}>
                        <DropdownMenuItem
                          onSelect={() => {
                            setRemoving(items => [...items, note.id]);
                          }}
                        >
                          <Trash2 size={16} />
                          Delete note
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                />
                </InkRemoval>
              ))}
            </div>
            {visible.length === 0 ? (
              <EmptyState
                title={notes.length ? "All caught up" : "A fresh page"}
                description={
                  notes.length
                    ? "Your notes are complete. Show completed items to see them again."
                    : "Add your first note using the field above."
                }
              />
            ) : null}
          </TabsContent>
          <TabsContent value="links">
            <ListRow
              leading={<Bookmark size={20} />}
              title={<span className="handwritten">A little inspiration</span>}
              description="Ideas · Saved link"
              trailing={
                <Button
                  size="sm"
                  variant={bookmarked ? "secondary" : "default"}
                  aria-pressed={bookmarked}
                  onClick={() => {
                    setBookmarked((value) => !value);
                    setNotice(
                      bookmarked
                        ? "Link removed from favourites."
                        : "Link added to favourites.",
                    );
                  }}
                >
                  <AnimatedIcon name="bookmark" animationKey={bookmarked} active={bookmarked} />
                  {bookmarked ? "Saved" : "Keep it"}
                </Button>
              }
            />
          </TabsContent>
        </Tabs>
        <p className="demo-status" id={`${id}-status`} role="status">
          {notice}
        </p>
      </div>
    </Playground>
  );
}

export function Showcase() {
  return (
    <>
      <Section id="try-it" title="Try it together">
        <Notebook />
      </Section>
      <Section id="browse" title="Explore the components">
        <p>
          Open a playground to change props, test the states, and copy the code.
        </p>
        <ComponentCatalogue />
      </Section>
      <Section id="built-in" title="Made for Polli">
        <p>
          Serif structure, handwritten content, and a quiet pastel palette. The
          previews use the actual shared components so what you try here is what
          you build with.
        </p>
        <div className="related-links">
          <RelatedLink id="brand">Brand guidelines</RelatedLink>
          <RelatedLink id="getting-started">
            Install the shared package
          </RelatedLink>
        </div>
      </Section>
    </>
  );
}
