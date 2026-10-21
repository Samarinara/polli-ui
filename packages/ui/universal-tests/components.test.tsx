import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  PolliProvider,
  Text,
  Button,
  Field,
  Input,
  Checkbox,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  NativeSelect,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  InkRemoval,
} from "../src";
const wrap = (children: React.ReactNode) =>
  render(<PolliProvider>{children}</PolliProvider>);
describe("universal components on React Native Web", () => {
  it("supports native press and text input callbacks and field labels", async () => {
    const press = vi.fn();
    const change = vi.fn();
    wrap(
      <>
        <Button onPress={press}>Save thought</Button>
        <Field label="Thought">
          <Input onChangeText={change} />
        </Field>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save thought" }));
    expect(press).toHaveBeenCalledOnce();
    await userEvent.type(screen.getByRole("textbox", { name: "Thought" }), "A");
    expect(change).toHaveBeenLastCalledWith("A");
  });
  it("supports uncontrolled and disabled selection", async () => {
    wrap(
      <>
        <Checkbox accessibilityLabel="Keep" />
        <Switch accessibilityLabel="Sync" disabled />
      </>,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Keep" }));
    expect(screen.getByRole("checkbox")).toBeChecked();
    fireEvent.click(screen.getByRole("switch", { name: "Sync" }));
    expect(screen.getByRole("switch")).not.toBeChecked();
  });
  it("changes tab content and expands accordions", async () => {
    wrap(
      <>
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">First panel</TabsContent>
          <TabsContent value="two">Second panel</TabsContent>
        </Tabs>
        <Accordion type="single" collapsible>
          <AccordionItem value="about">
            <AccordionTrigger>About</AccordionTrigger>
            <AccordionContent>About Polli</AccordionContent>
          </AccordionItem>
        </Accordion>
      </>,
    );
    await userEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByText("Second panel")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "About" }));
    expect(screen.getByText("About Polli")).toBeVisible();
  });
  it("opens and closes a portalled dialog, including Escape", async () => {
    wrap(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Keep this?</DialogTitle>
          <DialogDescription>A private thought</DialogDescription>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Keep this?");
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
  it("selects data options and invokes menu actions", async () => {
    const change = vi.fn();
    const action = vi.fn();
    wrap(
      <>
        <NativeSelect
          accessibilityLabel="Collection"
          options={[
            { value: "notes", label: "Notes" },
            { value: "recipes", label: "Recipes" },
          ]}
          onValueChange={change}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onPress={action}>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Collection" }));
    await userEvent.click(
      await screen.findByRole("option", { name: "Recipes" }),
    );
    expect(change).toHaveBeenCalledWith("recipes");
    expect(
      screen.getByRole("button", { name: "Collection" }),
    ).toHaveTextContent("Recipes");
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Archive" }),
    );
    expect(action).toHaveBeenCalledOnce();
  });
  it("completes removal once under StrictMode with reduced motion", async () => {
    const complete = vi.fn();
    render(
      <React.StrictMode>
        <PolliProvider>
          <InkRemoval removed onExitComplete={complete}>
            <Text>Removed</Text>
          </InkRemoval>
        </PolliProvider>
      </React.StrictMode>,
    );
    await waitFor(() => expect(complete).toHaveBeenCalledOnce());
  });
});
