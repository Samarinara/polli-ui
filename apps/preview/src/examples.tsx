import { useRef, useState } from "react";
import { AnimatedIcon } from "@samarinara/polli-ui/components/animated-icon";
import { InkText, InkRemoval } from "@samarinara/polli-ui/components/ink";
import { Button } from "@samarinara/polli-ui/components/button";
import { Input, Label } from "@samarinara/polli-ui/components/field";
import { Checkbox, Switch } from "@samarinara/polli-ui/components/selection";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@samarinara/polli-ui/components/accordion";

export function NotebookMotionExample() {
  const [finished, setFinished] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [bellKey, setBellKey] = useState(0);
  const [removed, setRemoved] = useState(false);
  const [visible, setVisible] = useState(true);
  const [note, setNote] = useState("Pick up flowers on the way home");
  const [savedNote, setSavedNote] = useState(note);
  const [saveKey, setSaveKey] = useState(0);
  const [editKey, setEditKey] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="motion-notebook">
      <form onSubmit={event => {
        event.preventDefault();
        if (!note.trim()) return;
        setSavedNote(note.trim());
        setSaveKey(value => value + 1);
      }}>
        <Label htmlFor="motion-note">A little reminder</Label>
        <Input ref={input} id="motion-note" value={note} onChange={event => setNote(event.target.value)} required />
        <div className="demo-row motion-note-actions">
          <Button type="submit" size="sm"><AnimatedIcon name="check" animationKey={saveKey} /><InkText underlineKey={saveKey}>Save edit</InkText></Button>
          <Button variant="ghost" size="sm" onClick={() => { setEditKey(value => value + 1); input.current?.focus(); }}>
            <AnimatedIcon name="pencil" animationKey={editKey} />Edit reminder
          </Button>
        </div>
      </form>
      <p className="motion-saved-note" role="status"><span className="handwritten">{savedNote}</span></p>
      {visible ? <InkRemoval removed={removed} onExitComplete={() => setVisible(false)}>
        <div className="motion-notebook-row">
          <Checkbox id="motion-finished" checked={finished} onCheckedChange={value => setFinished(value === true)} />
          <label htmlFor="motion-finished"><InkText crossedOut={finished}>Pick up flowers</InkText></label>
          <Button variant="ghost" size="sm" onClick={() => { setRemoved(true); input.current?.focus(); }}>Remove reminder</Button>
        </div>
      </InkRemoval> : <Button variant="ghost" size="sm" onClick={() => { setRemoved(false); setVisible(true); setFinished(false); }}>Restore reminder</Button>}
      <div className="motion-notebook-row">
        <Switch id="motion-reminders" checked={reminders} onCheckedChange={value => {
          setReminders(value);
          if (value) setBellKey(key => key + 1);
        }} />
        <label htmlFor="motion-reminders">Remind me tomorrow</label>
        <AnimatedIcon name="bell" animationKey={bellKey} />
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="details">
          <AccordionTrigger>More details</AccordionTrigger>
          <AccordionContent><span className="handwritten">Something yellow for the kitchen table.</span></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function IconMotionExample() {
  const [copyKey, setCopyKey] = useState(0);
  const [bookmark, setBookmark] = useState(false);
  const [notice, setNotice] = useState("");
  return <div className="motion-notebook">
    <div className="demo-row">
      <Button variant="secondary" onClick={async () => {
        try {
          await navigator.clipboard.writeText("Pick up flowers on the way home");
          setCopyKey(key => key + 1);
          setNotice("Reminder copied.");
        } catch { setNotice("Copy unavailable. Select the reminder text to copy it."); }
      }}><AnimatedIcon name="copy" animationKey={copyKey} />Copy reminder</Button>
      <Button variant="ghost" aria-pressed={bookmark} onClick={() => setBookmark(value => !value)}>
        <AnimatedIcon name="bookmark" animationKey={bookmark} active={bookmark} />{bookmark ? "Bookmarked" : "Bookmark reminder"}
      </Button>
    </div>
    <p className="demo-status" role="status">{notice || "Keep a reminder close, or copy it to share."}</p>
  </div>;
}

export function ButtonExample() {
  const [saved, setSaved] = useState(false);
  const [saveKey, setSaveKey] = useState(0);
  return (
    <>
      <div className="demo-row">
        <Button onClick={() => { setSaved(true); setSaveKey(key => key + 1); }}>
          <AnimatedIcon name="check" animationKey={saveKey} />
          <InkText underlineKey={saveKey}>{saved ? "Saved" : "Save note"}</InkText>
        </Button>
        <Button variant="secondary" onClick={() => setSaved(false)}>
          Reset
        </Button>
        <Button variant="ghost" disabled>
          Unavailable
        </Button>
      </div>
      <p className="demo-status" role="status">
        {saved
          ? "Note saved in this example."
          : "Click Save note to try the primary action."}
      </p>
    </>
  );
}
