export const pages = [
  {
    id: "overview",
    title: "Component showcase",
    group: "Start here",
    description:
      "The building blocks of Polli, ready to try. Explore the components, change their props, and take the code into your app.",
    sections: [
      {
        id: "try-it",
        title: "Try it together",
        keywords: "interactive demo notes form tabs checkbox save",
      },
      {
        id: "browse",
        title: "Explore the components",
        keywords: "library catalogue buttons fields dialog menu tooltip",
      },
      {
        id: "built-in",
        title: "Made for Polli",
        keywords: "brand fonts colour accessibility keyboard react package",
      },
    ],
  },
  {
    id: "getting-started",
    title: "Getting started",
    group: "Start here",
    description:
      "Bring the shared components and brand tokens into a Polli app. Keep app-specific behaviour alongside the app.",
    sections: [
      {
        id: "install",
        title: "Install the package",
        keywords: "npm github packages token registry authentication",
      },
      {
        id: "use",
        title: "Use the components",
        keywords: "React styles CSS imports shadcn",
      },
      {
        id: "registry",
        title: "shadcn registry",
        keywords: "CLI add wrappers shared updates version",
      },
    ],
  },
  {
    id: "components",
    title: "All components",
    group: "Components",
    description:
      "Pick a component to open its playground. Every preview uses the shared Polli UI package, with working interactions and copyable React examples.",
    sections: [
      {
        id: "catalogue",
        title: "Component library",
        keywords:
          "button field input textarea select checkbox switch badge tabs accordion dialog menu tooltip alert avatar empty state list row surface separator",
      },
    ],
  },
  {
    id: "buttons",
    title: "Button",
    group: "Components",
    description:
      "Primary actions, secondary choices, and a little colour. Test every variant, size, and disabled state.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords:
          "variant size default secondary coral butter sky ghost destructive icon click press",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "variant size default secondary coral butter sky ghost destructive icon click press props import",
      },
    ],
  },
  {
    id: "fields",
    title: "Fields",
    group: "Components",
    description:
      "Printed labels. Personal values. Type, submit, and test validation for inputs, textareas, and native selects.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords:
          "input textarea select field label required disabled invalid error form",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "input textarea select field label required disabled invalid error form props import",
      },
    ],
  },
  {
    id: "checkbox",
    title: "Checkbox",
    group: "Components",
    description:
      "Select an item, or represent a mixed collection. Try checked, unchecked, indeterminate, and disabled states.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords: "checked indeterminate disabled selection check",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords: "checked indeterminate disabled selection check props import",
      },
    ],
  },
  {
    id: "switch",
    title: "Switch",
    group: "Components",
    description:
      "Turn a preference on or off. Changes happen immediately, with a clear label and visible state.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords: "checked disabled toggle preference",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords: "checked disabled toggle preference props import",
      },
    ],
  },
  {
    id: "badge",
    title: "Badge",
    group: "Components",
    description:
      "A small label for a category or status. Explore the Polli pastel tones and change the text.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords: "tone mint coral butter sky neutral status category",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "tone mint coral butter sky neutral status category props import",
      },
    ],
  },
  {
    id: "tabs",
    title: "Tabs",
    group: "Components",
    description:
      "Move between related views without leaving the page. Try the arrow keys and manual activation.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords:
          "keyboard orientation activationMode automatic manual disabled tab",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "keyboard orientation activationMode automatic manual disabled tab props import",
      },
    ],
  },
  {
    id: "accordion",
    title: "Accordion",
    group: "Components",
    description:
      "Keep the main task in view and reveal detail when it helps. Explore single and multiple open sections.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords:
          "single multiple collapsible defaultValue disclosure keyboard",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "single multiple collapsible defaultValue disclosure keyboard props import",
      },
    ],
  },
  {
    id: "dialog",
    title: "Dialog",
    group: "Components",
    description:
      "A focused space for a short task. Open it, edit the form, and try cancel, submit, and Escape.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords:
          "modal overlay focus trap escape title description close form",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "modal overlay focus trap escape title description close form props import",
      },
    ],
  },
  {
    id: "menu",
    title: "Dropdown menu",
    group: "Components",
    description:
      "Keep nearby actions within reach. Try mouse and keyboard selection, placement, and disabled items.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords:
          "dropdown menu keyboard align start center end disabled actions",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "dropdown menu keyboard align start center end disabled actions props import",
      },
    ],
  },
  {
    id: "tooltip",
    title: "Tooltip",
    group: "Components",
    description:
      "A short clarification on hover or focus. Test placement and delay, then activate the underlying action.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords: "hover focus side top right bottom left delayDuration hint",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "hover focus side top right bottom left delayDuration hint props import",
      },
    ],
  },
  {
    id: "feedback",
    title: "Feedback",
    group: "Components",
    description:
      "Clear results and useful empty states. Save a change, dismiss the message, and add the first item.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords: "alert empty state title description action confirmation",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "alert empty state title description action confirmation props import",
      },
    ],
  },
  {
    id: "lists",
    title: "Lists & surfaces",
    group: "Components",
    description:
      "Open, connected rows for everyday content. Edit a profile, change its category, and remove or restore a row.",
    sections: [
      {
        id: "playground",
        title: "Playground",
        keywords: "avatar initials list row surface separator leading trailing",
      },
      {
        id: "usage",
        title: "Usage",
        keywords: "guidelines accessibility keyboard",
      },
      {
        id: "api",
        title: "API reference",
        keywords:
          "avatar initials list row surface separator leading trailing props import",
      },
    ],
  },
  {
    id: "brand",
    title: "Brand guidelines",
    group: "Foundations",
    description:
      "The shared visual language for Polli. Use this guide to make every app feel familiar, thoughtful, and easy to use.",
    sections: [
      {
        id: "the-brand",
        title: "The brand",
        keywords:
          "everyday software people recipes notes bookmarks open standards",
      },
      {
        id: "principles",
        title: "Design principles",
        keywords:
          "editorial minimalism space progressive disclosure connected accessible",
      },
      {
        id: "using-this-guide",
        title: "Using this guide",
        keywords: "foundations interface components installation",
      },
    ],
  },
  {
    id: "logo",
    title: "Logo",
    group: "Foundations",
    description:
      "A consistent signature across the Polli family. Use the original artwork and give it room to breathe.",
    sections: [
      {
        id: "wordmark",
        title: "Wordmark",
        keywords: "identity mark download svg official",
      },
      {
        id: "placement",
        title: "Placement",
        keywords: "clear space size header alignment",
      },
      {
        id: "care",
        title: "Handling the artwork",
        keywords: "stretch recolour rotate effects mascot",
      },
    ],
  },
  {
    id: "colour",
    title: "Colour",
    group: "Foundations",
    description:
      "Green anchors the identity. Soft pastels add warmth, while a quiet canvas keeps the content clear.",
    sections: [
      {
        id: "palette",
        title: "Brand palette",
        keywords: "green coral yellow blue white mint ink hex tokens",
      },
      {
        id: "roles",
        title: "Colour roles",
        keywords: "background foreground primary accent selection",
      },
      {
        id: "contrast",
        title: "Accessible pairings",
        keywords: "contrast wcag text accessibility",
      },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    group: "Foundations",
    description:
      "The structure feels printed. The content feels personal. Three clear type roles create the character of a well-used notebook.",
    sections: [
      {
        id: "type-roles",
        title: "Type roles",
        keywords: "Lora Inter Patrick Hand serif sans handwritten fonts",
      },
      {
        id: "hierarchy",
        title: "Hierarchy",
        keywords: "headings titles subtitles body labels scale",
      },
      {
        id: "personal-content",
        title: "Personal content",
        keywords: "inputs handwritten readability notes",
      },
    ],
  },
  {
    id: "layout",
    title: "Layout",
    group: "Foundations",
    description:
      "Build on a single canvas. Use spacing, alignment, and typographic hierarchy to make relationships clear.",
    sections: [
      {
        id: "composition",
        title: "Composition",
        keywords: "editorial minimalism cards borders connected lists",
      },
      {
        id: "spacing",
        title: "Spacing & shape",
        keywords: "rhythm margins radius 4px grid",
      },
      {
        id: "disclosure",
        title: "Progressive disclosure",
        keywords: "advanced options categories accordion responsive",
      },
    ],
  },
  {
    id: "motion",
    title: "Motion",
    group: "Foundations",
    description:
      "Motion responds to an action and helps explain the result. Reading a page should feel still and immediate.",
    sections: [
      {
        id: "interaction",
        title: "Interaction",
        keywords: "click press hover no lift animation bones meat notebook ink",
      },
      {
        id: "timing",
        title: "Timing",
        keywords: "duration easing transitions weight",
      },
      {
        id: "notebook-gestures",
        title: "Notebook gestures",
        keywords: "animated icon copy pencil bookmark bell check ink cross out removal underline",
      },
      {
        id: "reduced-motion",
        title: "Reduced motion",
        keywords: "accessibility loading skeleton entrance reveal",
      },
    ],
  },
  {
    id: "voice",
    title: "Writing",
    group: "Foundations",
    description:
      "Use plain, specific language. Help people understand what they can do, what happened, and what comes next.",
    sections: [
      {
        id: "tone",
        title: "Tone of voice",
        keywords: "friendly professional clear concise microcopy",
      },
      {
        id: "interface-copy",
        title: "Interface copy",
        keywords: "button labels empty states errors validation",
      },
      {
        id: "naming",
        title: "Names & terminology",
        keywords: "Polli polli.page Brownbag Topix Pinnit",
      },
    ],
  },
] as const;

export type PageId = (typeof pages)[number]["id"];
export type Page = (typeof pages)[number];
export const groups = ["Start here", "Components", "Foundations"] as const;
export const repoUrl = "https://github.com/Samarinara/polli-ui";
export function pageHref(id: PageId) {
  return id === "overview" ? "./index.html" : `./${id}.html`;
}
export function resolvePage(id: string | undefined): Page {
  return pages.find((page) => page.id === id) ?? pages[0];
}

const searchEntries = pages.flatMap((page) => [
  {
    title: page.title,
    context: page.group,
    href: pageHref(page.id),
    text: `${page.title} ${page.description}`,
  },
  ...page.sections.map((section) => ({
    title: section.title,
    context: page.title,
    href: `${pageHref(page.id)}#${section.id}`,
    text: `${page.title} ${section.title} ${section.keywords}`,
  })),
]);
export function searchDocs(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return searchEntries
    .filter((entry) =>
      terms.every((term) => entry.text.toLowerCase().includes(term)),
    )
    .slice(0, 9);
}
