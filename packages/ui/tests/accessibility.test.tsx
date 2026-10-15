import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/button';
import { Field, Input, Label, NativeSelect, Textarea } from '../src/components/field';
import { Checkbox, Switch } from '../src/components/selection';
import { Avatar, ListRow, Surface } from '../src/components/layout';
import { Badge } from '../src/components/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../src/components/accordion';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '../src/components/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../src/components/menu';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../src/components/tooltip';

describe('drop-in accessibility and composition', () => {
  it('connects unique field labels, help text, errors, and explicit descriptions', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLInputElement>();
    const view = (error?: string) => <>
      <p id="extra-help">Only you can see this.</p>
      <Field label="Title" hint="A short title." error={error}><Input ref={ref} aria-describedby="extra-help extra-help" /></Field>
      <Field label="Another title" hint="Separate help."><Input /></Field>
    </>;
    const { rerender } = render(view());
    const title = screen.getByRole('textbox', { name: /^Title$/ });
    expect(title).toHaveAccessibleDescription('Only you can see this. A short title.');
    expect(title.id).not.toBe(screen.getByRole('textbox', { name: 'Another title' }).id);
    await user.click(screen.getByText('Title', { exact: true }));
    expect(title).toHaveFocus();
    expect(ref.current).toBe(title);
    rerender(view('Enter a title.'));
    expect(title).toHaveAttribute('aria-invalid', 'true');
    expect(title).toHaveAccessibleDescription('Only you can see this. Enter a title.');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a title.');
    rerender(view());
    expect(title).not.toHaveAttribute('aria-invalid');
    expect(title).toHaveAccessibleDescription('Only you can see this. A short title.');
  });

  it('keeps existing explicit IDs and supports nested controls and all field primitives', async () => {
    const user = userEvent.setup();
    render(<>
      <Field label={<Label htmlFor="existing">Existing label</Label>} hint="Existing help"><Input id="existing" /></Field>
      <Field label="Legacy field" hint={<span id="legacy-help">Legacy help</span>}><Input aria-describedby="legacy-help" /></Field>
      <Field label="Note"><Textarea id="note" /></Field>
      <Field label="Category"><NativeSelect><option>Ideas</option></NativeSelect></Field>
      <Field label="Finished" hint="Mark this note complete"><Checkbox /></Field>
      <Field label="Reminders" htmlFor="nested-switch"><div><Switch id="nested-switch" /></div></Field>
    </>);
    expect(screen.getByLabelText('Existing label')).toHaveAccessibleDescription('Existing help');
    expect(screen.getByLabelText('Legacy field')).toHaveAccessibleDescription('Legacy help');
    expect(screen.getByLabelText('Note')).toHaveAttribute('id', 'note');
    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue('Ideas');
    await user.click(screen.getByText('Finished', { exact: true }));
    expect(screen.getByRole('checkbox', { name: 'Finished' })).toBeChecked();
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Mark this note complete');
    await user.click(screen.getByText('Reminders', { exact: true }));
    expect(screen.getByRole('switch', { name: 'Reminders' })).toBeChecked();
  });

  it('submits checkbox and switch values through native forms and resets uncontrolled state', async () => {
    const user = userEvent.setup();
    render(<form aria-label="Preferences"><Checkbox name="done" value="yes" defaultChecked aria-label="Done" /><Switch name="remind" value="yes" defaultChecked aria-label="Remind" /><Button type="reset">Reset</Button></form>);
    const form = screen.getByRole('form') as HTMLFormElement;
    expect(new FormData(form).get('done')).toBe('yes');
    expect(new FormData(form).get('remind')).toBe('yes');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('switch'));
    expect(new FormData(form).has('done')).toBe(false);
    expect(new FormData(form).has('remind')).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    await waitFor(() => expect(screen.getByRole('checkbox')).toBeChecked());
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('blocks disabled slotted links and keeps slotted native buttons from submitting', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<form><Button asChild disabled onClick={onClick} onClickCapture={onClick}><a href="#saved" onClick={onClick} onClickCapture={onClick}>Save link</a></Button><Button asChild><button>Action</button></Button></form>);
    const link = screen.getByRole('link', { name: 'Save link' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Action' })).toHaveAttribute('type', 'button');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus();
  });

  it('does not open a menu through a disabled slotted trigger', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu><DropdownMenuTrigger asChild><Button asChild disabled><a href="#actions">Unavailable actions</a></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Archive</DropdownMenuItem></DropdownMenuContent></DropdownMenu>);
    const trigger = screen.getByRole('link', { name: 'Unavailable actions' });
    await user.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('preserves slotted selection roots, refs, marks, and keyboard activation', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLButtonElement>();
    const { container } = render(<><Checkbox asChild ref={ref} aria-label="Slotted checkbox"><button /></Checkbox><Switch asChild aria-label="Slotted switch"><button /></Switch></>);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
    await user.tab();
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(container.querySelector('[data-polli="checkbox-mark"]')).toBeInTheDocument();
    await user.tab();
    await user.keyboard(' ');
    expect(screen.getByRole('switch')).toBeChecked();
    expect(container.querySelector('[data-polli="switch-thumb"]')).toBeInTheDocument();
  });

  it('falls back to useful initials after image errors and tries replacement images', () => {
    const { container, rerender } = render(<Avatar name="  alex   chen  " src="/first.png" />);
    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByRole('img', { name: 'alex chen' })).toHaveTextContent('AC');
    expect(container.querySelector('img')).toBeNull();
    rerender(<Avatar name="Jamie Park" src="/second.png" />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/second.png');
    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByRole('img', { name: 'Jamie Park' })).toHaveTextContent('JP');
    rerender(<Avatar name="   " />);
    expect(screen.getByRole('img', { name: 'Unknown person' })).toHaveTextContent('?');
  });

  it('composes rows, badges, and surfaces with native links and buttons', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<>
      <ListRow asChild title="Saved note" description="Read it"><a href="#note" /></ListRow>
      <Badge asChild tone="sky"><button type="button" onClick={onClick}>Ideas</button></Badge>
      <Surface asChild><section aria-label="Related notes">Notes</section></Surface>
    </>);
    expect(screen.getByRole('link', { name: 'Saved note Read it' })).toHaveAttribute('href', '#note');
    expect(screen.getByRole('region', { name: 'Related notes' })).toHaveAttribute('data-polli', 'surface');
    await user.tab();
    expect(screen.getByRole('link')).toHaveFocus();
    await user.tab();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('supports slotted accordion triggers and dialog content with built-in controls', async () => {
    const user = userEvent.setup();
    render(<>
      <Accordion type="single" collapsible><AccordionItem value="details"><AccordionTrigger asChild><button>Details</button></AccordionTrigger><AccordionContent>Extra detail</AccordionContent></AccordionItem></Accordion>
      <Dialog><DialogTrigger asChild><Button>Open</Button></DialogTrigger><DialogContent asChild closeLabel="Dismiss note"><section><DialogTitle>Note</DialogTitle><DialogDescription>Details of this note.</DialogDescription></section></DialogContent></Dialog>
    </>);
    await user.click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.getByText('Extra detail')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog', { name: 'Note' }).tagName).toBe('SECTION');
    await user.click(screen.getByRole('button', { name: 'Dismiss note' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus());
  });

  it('navigates a menu by keyboard, skips disabled actions, and restores focus', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(<DropdownMenu><DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem disabled>Archive</DropdownMenuItem><DropdownMenuItem onSelect={select}>Duplicate</DropdownMenuItem><DropdownMenuItem>Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>);
    await user.tab();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus());
    await user.keyboard('{Enter}');
    expect(select).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus());
  });

  it('describes a focused tooltip trigger and dismisses with Escape', async () => {
    const user = userEvent.setup();
    render(<TooltipProvider delayDuration={0}><Tooltip><TooltipTrigger asChild><Button aria-label="Bookmark">☆</Button></TooltipTrigger><TooltipContent>Keep this note close</TooltipContent></Tooltip></TooltipProvider>);
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Keep this note close');
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Keep this note close');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveFocus();
  });
});
