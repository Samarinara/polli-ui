import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@samarinara/polli-ui/components/button";

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
