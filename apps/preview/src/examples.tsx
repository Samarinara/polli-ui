import { useState } from "react";
import { Plus, MoreHorizontal, Settings, Bookmark } from "lucide-react";
import { Button } from "@samarinara/polli-ui/components/button";
import { Badge } from "@samarinara/polli-ui/components/badge";
import {
  Input,
  Textarea,
  NativeSelect,
  Label,
  Field,
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

export function ButtonExample() {
  const [saved, setSaved] = useState(false);
  return (
    <>
      <div className="demo-row">
        <Button onClick={() => setSaved(!saved)}>
          <Plus />
          {saved ? "Saved" : "Save note"}
        </Button>
        <Button variant="secondary" onClick={() => setSaved(false)}>
          Reset
        </Button>
        <Button variant="ghost" disabled>
          Unavailable
        </Button>
      </div>
      <div className="demo-row">
        <Button variant="coral">Coral</Button>
        <Button variant="butter">Butter</Button>
        <Button variant="sky">Sky</Button>
      </div>
      <p className="demo-status" role="status">
        {saved
          ? "Note saved in this example."
          : "Click Save note to try the primary action."}
      </p>
    </>
  );
}

export function FieldExample() {
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="demo-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
      onChange={() => setSaved(false)}
    >
      <Field label={<Label htmlFor="note-title">Title</Label>}>
        <Input
          id="note-title"
          name="title"
          defaultValue="Things to make this weekend"
          required
        />
      </Field>
      <Field
        label={<Label htmlFor="note-body">Note</Label>}
        hint={<span id="note-hint">Add the details you want to remember.</span>}
      >
        <Textarea
          id="note-body"
          name="body"
          aria-describedby="note-hint"
          defaultValue="Try the lemon cake recipe. Pick up flowers for the table."
        />
      </Field>
      <Field label={<Label htmlFor="note-category">Category</Label>}>
        <NativeSelect id="note-category" name="category">
          <option>Home</option>
          <option>Recipes</option>
          <option>Ideas</option>
        </NativeSelect>
      </Field>
      <Button type="submit">Save note</Button>
      {saved ? (
        <Alert title="Note saved">
          This example keeps the entry in your browser until you leave the page.
        </Alert>
      ) : null}
    </form>
  );
}

export function SelectionExample() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Checkbox
          id="shopping"
          checked={checked}
          onCheckedChange={(value) => setChecked(value === true)}
        />
        <Label htmlFor="shopping">Add lemons to the shopping list</Label>
        {checked ? <Badge>Added</Badge> : null}
      </div>
      <ListRow
        title={<Label htmlFor="shared-categories">Shared categories</Label>}
        description="Use the same categories across your apps."
        trailing={<Switch id="shared-categories" defaultChecked />}
      />
      <div className="demo-row">
        <Badge tone="coral">People</Badge>
        <Badge tone="butter">Ideas</Badge>
        <Badge tone="sky">Saved</Badge>
        <Badge tone="neutral">Unsorted</Badge>
      </div>
    </div>
  );
}

export function NavigationExample() {
  return (
    <>
      <Tabs defaultValue="notes">
        <TabsList aria-label="Saved content">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <ListRow
            title={
              <span className="handwritten">Things to make this weekend</span>
            }
            description="Home · 2 notes"
          />
        </TabsContent>
        <TabsContent value="links">
          <ListRow
            leading={<Bookmark size={18} />}
            title="Lemon cake"
            description="Recipes · Saved link"
          />
        </TabsContent>
      </Tabs>
      <Accordion type="single" collapsible>
        <AccordionItem value="advanced">
          <AccordionTrigger>More options</AccordionTrigger>
          <AccordionContent>
            <p className="demo-description">
              Show secondary settings here. Keep required fields in the main
              form.
            </p>
            <div className="demo-row">
              <Switch id="archive-notes" />
              <Label htmlFor="archive-notes">Include archived notes</Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export function OverlayExample() {
  const [notice, setNotice] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <TooltipProvider>
      <div className="demo-row">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add category</DialogTitle>
            <DialogDescription>
              Categories are available across your Polli apps.
            </DialogDescription>
            <form
              className="demo-stack"
              onSubmit={(event) => {
                event.preventDefault();
                setNotice(`Category “${name}” created in this example.`);
                setOpen(false);
              }}
            >
              <Label htmlFor="category-name">Category name</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <div className="demo-row">
                <Button type="submit">Create category</Button>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              Options
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => setNotice("Note archived in this example.")}
            >
              Archive note
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setNotice("Note duplicated in this example.")}
            >
              Duplicate note
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              Move to another account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Preferences">
              <Settings />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Preferences</TooltipContent>
        </Tooltip>
      </div>
      {notice ? (
        <p className="demo-status" role="status">
          {notice}
        </p>
      ) : null}
    </TooltipProvider>
  );
}

export function FeedbackExample() {
  return (
    <div className="demo-stack">
      <Alert title="Changes saved">Your shopping list is up to date.</Alert>
      <div>
        <ListRow
          leading={<Avatar name="Alex Chen" />}
          title="Alex Chen"
          description="Birthday · 12 June"
          trailing={<Badge tone="coral">Friend</Badge>}
        />
        <ListRow
          leading={<Avatar name="Sam Rivera" />}
          title="Sam Rivera"
          description="Neighbour"
        />
        <Separator />
      </div>
      <Surface>
        <p className="demo-description">
          A surface can group a related set of information. Use it when the
          grouping carries meaning.
        </p>
      </Surface>
      <EmptyState
        title="No saved links"
        description="Save a link to find it here later."
      />
    </div>
  );
}
