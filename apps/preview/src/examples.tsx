import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@samarinara/polli-ui/components/button";
import { Input, Label } from "@samarinara/polli-ui/components/field";
import { Checkbox, Switch } from "@samarinara/polli-ui/components/selection";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@samarinara/polli-ui/components/accordion";

export function NotebookMotionExample() {
  const [finished, setFinished] = useState(false);
  const [reminders, setReminders] = useState(false);
  return (
    <div className="motion-notebook">
      <Label htmlFor="motion-note">A little reminder</Label>
      <Input id="motion-note" defaultValue="Pick up flowers on the way home" />
      <div className="motion-notebook-row">
        <Checkbox id="motion-finished" checked={finished} onCheckedChange={value => setFinished(value === true)} />
        <label htmlFor="motion-finished" className="handwritten">{finished ? "Flowers picked up" : "Pick up flowers"}</label>
      </div>
      <div className="motion-notebook-row">
        <Switch id="motion-reminders" checked={reminders} onCheckedChange={setReminders} />
        <label htmlFor="motion-reminders">Remind me tomorrow</label>
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
      <p className="demo-status" role="status">
        {saved
          ? "Note saved in this example."
          : "Click Save note to try the primary action."}
      </p>
    </>
  );
}
