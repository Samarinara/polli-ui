export const pages = [
  {
    id: "overview",
    title: "Brand guidelines",
    group: "Introduction",
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
    group: "Brand",
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
    group: "Brand",
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
    group: "Brand",
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
    group: "Interface",
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
    id: "components",
    title: "Components",
    group: "Interface",
    description:
      "Shared React primitives for Polli interfaces. Examples use the real package, so the guidance and the implementation stay together.",
    sections: [
      {
        id: "buttons",
        title: "Buttons",
        keywords: "primary secondary ghost coral butter sky variants actions",
      },
      {
        id: "fields",
        title: "Fields",
        keywords: "input textarea select label form validation",
      },
      {
        id: "selection",
        title: "Selection",
        keywords: "checkbox switch badge preferences",
      },
      {
        id: "navigation",
        title: "Navigation",
        keywords: "tabs accordion categories",
      },
      {
        id: "overlays",
        title: "Overlays",
        keywords: "dialog menu tooltip focus escape",
      },
      {
        id: "feedback",
        title: "Feedback & lists",
        keywords: "alert avatar empty state list row surface separator",
      },
    ],
  },
  {
    id: "motion",
    title: "Motion",
    group: "Interface",
    description:
      "Motion responds to an action and helps explain the result. Reading a page should feel still and immediate.",
    sections: [
      {
        id: "interaction",
        title: "Interaction",
        keywords: "click press hover no lift animation",
      },
      {
        id: "timing",
        title: "Timing",
        keywords: "duration easing transitions weight",
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
    group: "Resources",
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
  {
    id: "getting-started",
    title: "Getting started",
    group: "Resources",
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
] as const;

export type PageId = (typeof pages)[number]["id"];
export type Page = (typeof pages)[number];
export const groups = [
  "Introduction",
  "Brand",
  "Interface",
  "Resources",
] as const;
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
