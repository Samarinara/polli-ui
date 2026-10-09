import * as React from 'react';
import {describe,it,expect} from 'vitest';
import {render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button} from '../src/components/button';
import {Dialog,DialogTrigger,DialogContent,DialogTitle,DialogDescription} from '../src/components/dialog';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '../src/components/tabs';
import {Checkbox,Switch} from '../src/components/selection';
import {Input,Label} from '../src/components/field';
import {Accordion,AccordionItem,AccordionTrigger,AccordionContent} from '../src/components/accordion';
describe('shared component contracts',()=>{
 it('does not submit forms accidentally and supports a real link',async()=>{render(<form><Button>Action</Button><Button asChild><a href="/ideas">Ideas</a></Button></form>);expect(screen.getByRole('button')).toHaveAttribute('type','button');expect(screen.getByRole('link')).toHaveAttribute('href','/ideas')});
 it('labels fields and forwards refs for focus',()=>{const ref=React.createRef<HTMLInputElement>();render(<><Label htmlFor="person">Person</Label><Input id="person" ref={ref}/></>);ref.current?.focus();expect(screen.getByLabelText('Person')).toHaveFocus()});
 it('opens a labelled dialog, closes with Escape, and restores focus',async()=>{const user=userEvent.setup();render(<Dialog><DialogTrigger asChild><Button>Open idea</Button></DialogTrigger><DialogContent><DialogTitle>An idea</DialogTitle><DialogDescription>Save something good.</DialogDescription><Input aria-label="Idea"/></DialogContent></Dialog>);await user.click(screen.getByRole('button',{name:'Open idea'}));expect(screen.getByRole('dialog')).toHaveAccessibleName('An idea');expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Save something good.');await user.keyboard('{Escape}');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();await waitFor(()=>expect(screen.getByRole('button',{name:'Open idea'})).toHaveFocus())});
 it('supports keyboard tabs',async()=>{const user=userEvent.setup();render(<Tabs defaultValue="notes"><TabsList><TabsTrigger value="notes">Notes</TabsTrigger><TabsTrigger value="links">Links</TabsTrigger></TabsList><TabsContent value="notes">My notes</TabsContent><TabsContent value="links">My links</TabsContent></Tabs>);screen.getByRole('tab',{name:'Notes'}).focus();await user.keyboard('{ArrowRight}');expect(screen.getByRole('tab',{name:'Links'})).toHaveAttribute('aria-selected','true');expect(screen.getByRole('tabpanel')).toHaveTextContent('My links')});
 it('toggles switches and checkboxes using the keyboard',async()=>{const user=userEvent.setup();render(<><Checkbox aria-label="Finished"/><Switch aria-label="Sync"/></>);await user.tab();await user.keyboard(' ');expect(screen.getByRole('checkbox')).toBeChecked();await user.tab();await user.keyboard(' ');expect(screen.getByRole('switch')).toBeChecked()});
 it('preserves uncontrolled multiple accordion state, callbacks, and root refs',async()=>{
  const user=userEvent.setup();
  const ref=React.createRef<HTMLDivElement>();
  const changes:string[][]=[];
  render(<Accordion type="multiple" defaultValue={['first']} ref={ref} onValueChange={value=>changes.push(value)}>
   <AccordionItem value="first"><AccordionTrigger>First</AccordionTrigger><AccordionContent>First entry</AccordionContent></AccordionItem>
   <AccordionItem value="second"><AccordionTrigger>Second</AccordionTrigger><AccordionContent>Second entry</AccordionContent></AccordionItem>
  </Accordion>);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(screen.getByText('First entry')).toBeVisible();
  screen.getByRole('button',{name:'Second'}).focus();
  await user.keyboard(' ');
  expect(screen.getByText('First entry')).toBeVisible();
  expect(screen.getByText('Second entry')).toBeVisible();
  expect(changes).toEqual([['first','second']]);
 });
 it('supports a controlled dialog opened by an external action',async()=>{
  const user=userEvent.setup();
  function ExternalDialog(){
   const [open,setOpen]=React.useState(false);
   return <><Button onClick={()=>setOpen(true)}>External action</Button><Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogTitle>Controlled note</DialogTitle><DialogDescription>Personal content.</DialogDescription></DialogContent></Dialog></>;
  }
  render(<ExternalDialog/>);
  await user.click(screen.getByRole('button',{name:'External action'}));
  expect(screen.getByRole('dialog')).toHaveAccessibleName('Controlled note');
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
 });
});
