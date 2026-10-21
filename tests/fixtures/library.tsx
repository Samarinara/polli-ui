import { useId, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@samarinara/polli-ui/web/components/button';
import { Field, Input, Textarea, NativeSelect } from '@samarinara/polli-ui/web/components/field';
import { Checkbox, Switch } from '@samarinara/polli-ui/web/components/selection';
import { Badge } from '@samarinara/polli-ui/web/components/badge';
import { Avatar, Alert, EmptyState, ListRow, Separator, Skeleton, Surface } from '@samarinara/polli-ui/web/components/layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@samarinara/polli-ui/web/components/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@samarinara/polli-ui/web/components/accordion';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@samarinara/polli-ui/web/components/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@samarinara/polli-ui/web/components/menu';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@samarinara/polli-ui/web/components/tooltip';
import { AnimatedIcon } from '@samarinara/polli-ui/web/components/animated-icon';
import { InkText, InkRemoval } from '@samarinara/polli-ui/web/components/ink';

const longWord = 'AReallyLongUnbrokenPieceOfUserContentThatMustFitEvenOnTheSmallestSupportedScreen'.repeat(3);
const stack = { display: 'grid', gap: '1rem', minWidth: 0 } as const;

function ReusableField() {
  return <Field label="Reusable title" hint="Each instance has its own label and hint."><Input /></Field>;
}

function LibraryFixture() {
  const [notice, setNotice] = useState('Ready.');
  const [removed, setRemoved] = useState(false);
  const [visible, setVisible] = useState(true);
  const titleId = useId();
  return <main className="polli-root" style={{ ...stack, padding: 16, maxWidth: 900, margin: 'auto' }}>
    <h1>Library integration</h1>
    <section aria-label="Buttons" style={stack}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['default', 'secondary', 'coral', 'butter', 'sky', 'ghost', 'destructive'] as const).map(variant => <Button key={variant} variant={variant}>{variant}</Button>)}
        <Button disabled>Unavailable</Button>
        <Button size="icon" aria-label="Save note"><AnimatedIcon name="check" /></Button>
      </div>
      <Button data-testid="long-button">{longWord}</Button>
      <Button asChild><a href="#fields">Go to fields</a></Button>
      <Button asChild disabled onClick={() => setNotice('Disabled parent activated.')}><a href="#blocked" onClick={() => setNotice('Disabled child activated.')}>Disabled link</a></Button>
    </section>
    <section id="fields" aria-label="Fields" style={stack}>
      <ReusableField /><ReusableField />
      <Field label="Note" hint="Your personal note."><Textarea defaultValue="Something worth remembering" /></Field>
      <Field label="Category"><NativeSelect defaultValue="ideas"><option value="ideas">Ideas</option><option value="home">Home</option></NativeSelect></Field>
      <Field label="Email" error="Enter a valid email address."><Input type="email" defaultValue="invalid" /></Field>
      <Input disabled aria-label="Disabled field" value="Unavailable" readOnly />
    </section>
    <form aria-label="Preferences" style={stack} onSubmit={event => {
      event.preventDefault();
      setNotice(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
    }}>
      <Field label="Completed" hint="Finish this task"><Checkbox asChild name="completed" value="yes" defaultChecked><button /></Checkbox></Field>
      <Field label="Reminders"><Switch asChild name="reminders" value="yes" defaultChecked><button /></Switch></Field>
      <Checkbox aria-label="Mixed selection" defaultChecked="indeterminate" />
      <Checkbox aria-label="Disabled checkbox" disabled />
      <Switch aria-label="Disabled switch" disabled />
      <div><Button type="submit">Save preferences</Button> <Button type="reset" variant="ghost">Reset preferences</Button></div>
    </form>
    <section aria-label="Related views" style={stack}>
      {(['horizontal', 'vertical'] as const).map(orientation => <Tabs key={orientation} orientation={orientation} defaultValue="notes">
        <TabsList aria-label={`${orientation} views`}><TabsTrigger value="notes">Notes</TabsTrigger><TabsTrigger value="links">Links</TabsTrigger><TabsTrigger value="unavailable" disabled>Unavailable</TabsTrigger></TabsList>
        <TabsContent value="notes">Your notes</TabsContent><TabsContent value="links">Your links</TabsContent>
      </Tabs>)}
      <Accordion type="multiple" defaultValue={['first']}>
        <AccordionItem value="first"><AccordionTrigger asChild><button>First detail</button></AccordionTrigger><AccordionContent>Useful supporting content.</AccordionContent></AccordionItem>
        <AccordionItem value="second"><AccordionTrigger>Second detail</AccordionTrigger><AccordionContent>More supporting content.</AccordionContent></AccordionItem>
        <AccordionItem value="disabled" disabled><AccordionTrigger>Disabled detail</AccordionTrigger><AccordionContent>Unavailable content.</AccordionContent></AccordionItem>
      </Accordion>
    </section>
    <Surface asChild><section aria-label="People">
      <ListRow leading={<Avatar name="Alex Chen" />} title={longWord} description="Personal content wraps without pushing actions away." trailing={<Badge tone="coral">People</Badge>} />
      <Separator />
      <ListRow asChild title="Read saved note" description="A native link"><a href="#fields" /></ListRow>
      <Badge asChild tone="sky"><button type="button" onClick={() => setNotice('Ideas selected.')}>Ideas category</button></Badge>
    </section></Surface>
    <Alert title="Saved">Your changes are up to date.</Alert>
    <EmptyState title="No notes yet" description="Keep ideas and reminders here." icon={<AnimatedIcon name="bookmark" />} action={<Button>Add your first note</Button>} />
    <Skeleton style={{ width: '60%' }} />
    <section aria-label="Floating content" style={stack}>
      {([true, false] as const).map(modal => <div key={String(modal)} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button>Before {modal ? 'modal' : 'nonmodal'} menu</Button>
        <DropdownMenu modal={modal}><DropdownMenuTrigger asChild><Button>{modal ? 'Modal' : 'Nonmodal'} keyboard menu</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Keyboard action</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        <Button>After {modal ? 'modal' : 'nonmodal'} menu</Button>
      </div>)}
      <DropdownMenu><DropdownMenuTrigger asChild><Button asChild disabled><a href="#blocked">Disabled menu trigger</a></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Unavailable action</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      <Dialog><DialogTrigger asChild><Button>Open long dialog</Button></DialogTrigger><DialogContent asChild><section>
        <DialogTitle>{longWord}</DialogTitle><DialogDescription>This dialog remains readable and scrollable on small screens.</DialogDescription>
        <Field label="Dialog note"><Input /></Field>
        <DropdownMenu modal><DropdownMenuTrigger asChild><Button>Nested modal actions</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Nested action</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        {Array.from({ length: 18 }, (_, index) => <p key={index}>Supporting detail {index + 1}: {longWord}</p>)}
      </section></DialogContent></Dialog>
      <DropdownMenu><DropdownMenuTrigger asChild><Button>Open long menu</Button></DropdownMenuTrigger><DropdownMenuContent>
        {Array.from({ length: 25 }, (_, index) => <DropdownMenuItem key={index} onSelect={() => setNotice(`Action ${index + 1} selected.`)}>Action {index + 1}{index === 0 ? ` ${longWord}` : ''}</DropdownMenuItem>)}
      </DropdownMenuContent></DropdownMenu>
      <DropdownMenu modal><DropdownMenuTrigger asChild><Button>Open modal menu</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Modal action</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      <TooltipProvider delayDuration={0}><Tooltip><TooltipTrigger asChild><Button>Long tooltip</Button></TooltipTrigger><TooltipContent>{longWord}</TooltipContent></Tooltip></TooltipProvider>
    </section>
    <section aria-label="Notebook motion" style={stack}>
      <Input id={titleId} aria-label="Removal focus target" />
      {visible ? <InkRemoval removed={removed} onExitComplete={() => setVisible(false)}><ListRow title={<InkText>Remove this note</InkText>} trailing={<Button onClick={() => { document.getElementById(titleId)?.focus(); setRemoved(true); }}>Remove note</Button>} /></InkRemoval> : <p>Note removed.</p>}
    </section>
    <p role="status" aria-label="Example result">{notice}</p>
  </main>;
}

createRoot(document.getElementById('root')!).render(<LibraryFixture />);
